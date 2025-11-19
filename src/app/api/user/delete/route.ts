import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Mood from "@/models/Mood";

export async function DELETE(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Delete all moods associated with the user
    await Mood.deleteMany({ userId });

    // Delete the user account
    await User.findByIdAndDelete(userId);

    return NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { message: "Failed to delete account", error: error.message },
      { status: 500 }
    );
  }
}

