import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Mood from "@/models/Mood";

// GET - Fetch mood entries for a user
export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const query: any = { userId };

    // Add date range filter if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    const moods = await Mood.find(query)
      .sort({ date: -1 })
      .lean();

    return NextResponse.json(
      {
        moods: moods.map((mood) => ({
          _id: String(mood._id),
          userId: String(mood.userId),
          date: mood.date instanceof Date ? mood.date.toISOString() : mood.date,
          moodType: mood.moodType,
          moodValue: mood.moodValue,
          energy: mood.energy,
          stress: mood.stress,
          notes: mood.notes,
          createdAt: mood.createdAt instanceof Date ? mood.createdAt.toISOString() : mood.createdAt,
          updatedAt: mood.updatedAt instanceof Date ? mood.updatedAt.toISOString() : mood.updatedAt,
        })),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get moods error:", error);
    return NextResponse.json(
      { message: "Failed to fetch moods", error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new mood entry
export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { userId, date, moodType, moodValue, energy, stress, notes } = body;

    if (!userId || !date || !moodType || !moodValue) {
      return NextResponse.json(
        { message: "UserId, date, moodType, and moodValue are required" },
        { status: 400 }
      );
    }

    // Validate moodType
    if (!["happy", "neutral", "sad"].includes(moodType)) {
      return NextResponse.json(
        { message: "Invalid mood type" },
        { status: 400 }
      );
    }

    // Create new entry (allow multiple entries per day with different times)
    // Use provided date/time (should include time from frontend)
    const moodDate = new Date(date);
    
    const mood = await Mood.create({
      userId,
      date: moodDate,
      moodType,
      moodValue,
      energy,
      stress,
      notes,
    });

    return NextResponse.json(
      {
        message: "Mood saved successfully",
        mood: {
          _id: String(mood._id),
          userId: String(mood.userId),
          date: mood.date,
          moodType: mood.moodType,
          moodValue: mood.moodValue,
          energy: mood.energy,
          stress: mood.stress,
          notes: mood.notes,
          createdAt: mood.createdAt,
          updatedAt: mood.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Save mood error:", error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Mood entry already exists for this date" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Failed to save mood", error: error.message },
      { status: 500 }
    );
  }
}

