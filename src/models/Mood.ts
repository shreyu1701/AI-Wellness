import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMood extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  moodType: string; // "happy", "neutral", "sad"
  moodValue: number; // 1-5 scale
  energy?: number; // 1-10 scale (optional)
  stress?: number; // 1-10 scale (optional)
  notes?: string; // Optional notes
  createdAt: Date;
  updatedAt: Date;
}

const MoodSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      index: true,
    },
    moodType: {
      type: String,
      required: [true, "Mood type is required"],
      enum: ["happy", "neutral", "sad"],
    },
    moodValue: {
      type: Number,
      required: [true, "Mood value is required"],
      min: [1, "Mood value must be at least 1"],
      max: [5, "Mood value cannot exceed 5"],
    },
    energy: {
      type: Number,
      min: [1, "Energy level must be at least 1"],
      max: [10, "Energy level cannot exceed 10"],
    },
    stress: {
      type: Number,
      min: [1, "Stress level must be at least 1"],
      max: [10, "Stress level cannot exceed 10"],
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying (removed unique constraint to allow multiple entries per day)
MoodSchema.index({ userId: 1, date: -1 });

// Prevent re-compilation during development
const Mood: Model<IMood> =
  mongoose.models.Mood || mongoose.model<IMood>("Mood", MoodSchema);

export default Mood;

