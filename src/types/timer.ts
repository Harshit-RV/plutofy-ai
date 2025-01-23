import mongoose from "mongoose";

export interface TimerDoc extends Document {
  _id: mongoose.Types.ObjectId;
  lastCheck: Date,
}