import mongoose from "mongoose";

const CheckpointSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Checkpoint = mongoose.model("Checkpoint", CheckpointSchema);
export default Checkpoint;
