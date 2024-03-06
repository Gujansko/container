import mongoose from "mongoose";
import Checkpoint from "./Checkpoint.js";
import User from "./User.js";

const MeetingSchema = new mongoose.Schema({
  checkpoints: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: Checkpoint,
  },
  date: {
    type: Date,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  attendees: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: User,
  },
  googleMapsLink: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

MeetingSchema.pre("find", function (next) {
  this.populate("checkpoints").populate("attendees");
  next();
});

const Meeting = mongoose.model("Meeting", MeetingSchema);
export default Meeting;
