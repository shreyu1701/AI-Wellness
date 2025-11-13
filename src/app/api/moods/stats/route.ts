import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Mood from "@/models/Mood";

// GET - Get mood statistics for a user
export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const days = parseInt(searchParams.get("days") || "7");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Fetch moods for stats calculation (limited to days parameter)
    const moods = await Mood.find({
      userId,
      date: { $gte: startDate },
    })
      .sort({ date: 1 })
      .lean();

    // For streak calculation, fetch all moods (or at least last 365 days)
    const streakStartDate = new Date();
    streakStartDate.setDate(streakStartDate.getDate() - 365); // Check last year for streak
    streakStartDate.setHours(0, 0, 0, 0);

    const allMoodsForStreak = await Mood.find({
      userId,
      date: { $gte: streakStartDate },
    })
      .sort({ date: 1 })
      .lean();

    // Calculate streak first (even if no recent moods)
    // Group all moods by unique days for streak calculation
    const streakDailyEntries = new Set<string>();
    allMoodsForStreak.forEach((mood) => {
      const dayKey = new Date(mood.date).toDateString();
      streakDailyEntries.add(dayKey);
    });

    // Calculate streak: consecutive days backwards from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    let checkDate = new Date(today);

    // Check consecutive days backwards from today
    while (true) {
      const checkDateKey = checkDate.toDateString();

      if (streakDailyEntries.has(checkDateKey)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // If today has no entry, don't count it as a streak day
        // Start checking from yesterday if today has no entry
        if (streak === 0 && checkDate.getTime() === today.getTime()) {
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        }
        break;
      }
    }

    // If no moods in the requested period, return early with calculated streak
    if (moods.length === 0) {
      return NextResponse.json(
        {
          averageMood: 0,
          bestDay: null,
          worstDay: null,
          streak,
          totalEntries: 0,
        },
        { status: 200 }
      );
    }

    // Group moods by day and calculate daily averages
    const dailyAverages: {
      [key: string]: { sum: number; count: number; date: Date };
    } = {};

    moods.forEach((mood) => {
      const dayKey = new Date(mood.date).toDateString();
      if (!dailyAverages[dayKey]) {
        dailyAverages[dayKey] = {
          sum: 0,
          count: 0,
          date: new Date(mood.date),
        };
      }
      dailyAverages[dayKey].sum += mood.moodValue;
      dailyAverages[dayKey].count += 1;
    });

    // Calculate average mood from daily averages (to avoid bias from multiple entries per day)
    const dailyAvgValues = Object.values(dailyAverages).map(
      (day) => day.sum / day.count
    );
    const averageMood =
      dailyAvgValues.reduce((sum, avg) => sum + avg, 0) / dailyAvgValues.length;

    // Find best and worst days based on daily averages
    let bestDayData = null;
    let worstDayData = null;
    let bestAvg = -1;
    let worstAvg = 6;

    Object.values(dailyAverages).forEach((day) => {
      const avg = day.sum / day.count;
      if (avg > bestAvg) {
        bestAvg = avg;
        bestDayData = day;
      }
      if (avg < worstAvg) {
        worstAvg = avg;
        worstDayData = day;
      }
    });

    const bestDay = bestDayData
      ? (bestDayData as { date: Date }).date.toLocaleDateString("en-US", {
          weekday: "long",
        })
      : null;
    const worstDay = worstDayData
      ? (worstDayData as { date: Date }).date.toLocaleDateString("en-US", {
          weekday: "long",
        })
      : null;

    return NextResponse.json(
      {
        averageMood: Math.round(averageMood * 10) / 10,
        bestDay,
        worstDay,
        streak,
        totalEntries: moods.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get mood stats error:", error);
    return NextResponse.json(
      { message: "Failed to get mood statistics", error: error.message },
      { status: 500 }
    );
  }
}
