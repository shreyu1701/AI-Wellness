import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Mood from "@/models/Mood";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface MoodEntry {
  date: Date;
  moodType: string;
  moodValue: number;
  energy?: number;
  stress?: number;
  notes?: string;
}

// GET - Generate AI insights based on mood entries with notes
export async function GET(req: Request) {
  try {
    // Connect to database with error handling
    try {
      await dbConnect();
    } catch (dbError: any) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        {
          insights: generateFallbackInsights([]),
          message:
            "Database connection failed. Please check your MongoDB connection string.",
        },
        { status: 200 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          insights: [],
          message:
            "AI service not configured. Please add OPENAI_API_KEY to environment variables.",
        },
        { status: 200 }
      );
    }

    // Fetch recent mood entries with notes (last 30 days)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    startDate.setHours(0, 0, 0, 0);

    let moods;
    try {
      moods = await Mood.find({
        userId,
        date: { $gte: startDate },
        notes: { $exists: true, $ne: "" },
      })
        .sort({ date: -1 })
        .lean()
        .limit(50); // Limit to most recent 50 entries with notes
    } catch (dbError: any) {
      console.error("Database query error:", dbError);
      // Return fallback insights if database query fails
      return NextResponse.json(
        {
          insights: generateFallbackInsights([]),
          message:
            "Unable to fetch mood data. Please check your database connection.",
        },
        { status: 200 }
      );
    }

    if (moods.length === 0) {
      return NextResponse.json(
        {
          insights: [],
          message:
            "No mood entries with notes found. Start adding notes to your mood entries to receive AI insights!",
        },
        { status: 200 }
      );
    }

    // Prepare mood data for AI analysis
    const moodData = moods.map((mood) => ({
      date: mood.date.toISOString().split("T")[0],
      mood: mood.moodType,
      moodValue: mood.moodValue,
      energy: mood.energy,
      stress: mood.stress,
      notes: mood.notes,
    }));

    // Create prompt for AI
    const prompt = `You are a mental wellness AI assistant. Analyze the following mood tracking data and provide actionable, personalized recommendations.

Mood Entries:
${JSON.stringify(moodData, null, 2)}

Based on the notes and mood patterns, provide 3-5 specific, actionable recommendations. Each recommendation should:
1. Be directly related to patterns or concerns mentioned in the notes
2. Be practical and actionable
3. Include a priority level (high, medium, low)
4. Include a category (mindfulness, activity, sleep, nutrition, social, or other)
5. Be empathetic and supportive

Return ONLY a valid JSON array with this exact structure:
[
  {
    "title": "Short recommendation title",
    "description": "Detailed explanation of the recommendation and why it's relevant based on the notes",
    "category": "mindfulness|activity|sleep|nutrition|social|other",
    "priority": "high|medium|low",
    "actionable": true
  }
]

Focus on actionable tasks that the user can implement. Be specific and reference patterns from their notes when relevant.`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful mental wellness AI assistant. Always respond with valid JSON arrays only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error("No response from AI");
      }

      // Parse AI response
      let insights;
      try {
        // Extract JSON from response (in case there's extra text)
        const jsonMatch = responseContent.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          insights = JSON.parse(jsonMatch[0]);
        } else {
          insights = JSON.parse(responseContent);
        }
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        // Fallback to default insights
        insights = generateFallbackInsights(moodData);
      }

      // Validate and format insights
      const formattedInsights = Array.isArray(insights)
        ? insights
            .slice(0, 6) // Limit to 6 insights
            .map((insight: any, index: number) => ({
              id: index + 1,
              title: insight.title || "Wellness Recommendation",
              description: insight.description || "",
              category: insight.category || "other",
              priority: insight.priority || "medium",
              actionable: insight.actionable !== false,
              date: getRelativeTime(index),
            }))
        : generateFallbackInsights(moodData);

      return NextResponse.json(
        {
          insights: formattedInsights,
        },
        { status: 200 }
      );
    } catch (aiError: any) {
      console.error("AI API error:", aiError);
      // Return fallback insights if AI fails
      return NextResponse.json(
        {
          insights: generateFallbackInsights(moodData),
          message:
            "Using fallback recommendations. AI service temporarily unavailable.",
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("Get AI insights error:", error);
    return NextResponse.json(
      { message: "Failed to generate insights", error: error.message },
      { status: 500 }
    );
  }
}

// Fallback function to generate basic insights if AI fails
function generateFallbackInsights(moodData: any[]) {
  const hasLowMood = moodData.some((m) => m.moodValue <= 2);
  const hasHighStress = moodData.some((m) => m.stress && m.stress >= 7);
  const hasLowEnergy = moodData.some((m) => m.energy && m.energy <= 3);

  const fallbackInsights = [];

  if (hasLowMood) {
    fallbackInsights.push({
      id: 1,
      title: "Mood Support Recommendation",
      description:
        "I noticed some lower mood entries in your tracking. Consider trying mindfulness exercises or reaching out to a friend or professional for support.",
      category: "mindfulness",
      priority: "high",
      actionable: true,
      date: "Just now",
    });
  }

  if (hasHighStress) {
    fallbackInsights.push({
      id: 2,
      title: "Stress Management",
      description:
        "Your stress levels have been elevated. Try deep breathing exercises, short breaks, or light physical activity to help manage stress.",
      category: "mindfulness",
      priority: "high",
      actionable: true,
      date: "Just now",
    });
  }

  if (hasLowEnergy) {
    fallbackInsights.push({
      id: 3,
      title: "Energy Boost Activities",
      description:
        "Low energy levels detected. Consider regular sleep patterns, hydration, and light exercise to boost your energy naturally.",
      category: "activity",
      priority: "medium",
      actionable: true,
      date: "Just now",
    });
  }

  if (fallbackInsights.length === 0) {
    fallbackInsights.push({
      id: 1,
      title: "Keep Tracking Your Mood",
      description:
        "Continue tracking your mood and adding notes. The more data you provide, the better insights we can generate for you!",
      category: "other",
      priority: "low",
      actionable: false,
      date: "Just now",
    });
  }

  return fallbackInsights;
}

function getRelativeTime(index: number): string {
  const times = [
    "Just now",
    "1 hour ago",
    "2 hours ago",
    "5 hours ago",
    "1 day ago",
    "2 days ago",
  ];
  return times[index] || "Recently";
}
