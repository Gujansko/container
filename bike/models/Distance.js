import mongoose from "mongoose";

const DistanceSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Checkpoint",
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Checkpoint",
  },
  distance: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

DistanceSchema.pre("find", function (next) {
  this.populate("from").populate("to");
  next();
});

const Distance = mongoose.model("Distance", DistanceSchema);
export default Distance;
