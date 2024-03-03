import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Distance from "./models/Distance.js";
import Checkpoint from "./models/Checkpoint.js";

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.post("/checkpoint", async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ message: "Name is required" });
  }
  try {
    const checkpointExisting = await Checkpoint.findOne({
      name: req.body.name,
    });
    if (checkpointExisting) {
      return res.status(400).json({ message: "Checkpoint already exists" });
    }

    const checkpoint = await Checkpoint.create({ name: req.body.name });
    res.status(201).json(checkpoint);
  } catch (err) {
    res.status(500).json({ message: "Failed to create checkpoint" });
  }
});

app.get("/checkpoints", async (req, res) => {
  try {
    const checkpoints = await Checkpoint.find();
    res.status(200).json(checkpoints);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch checkpoints" });
  }
});

app.post("/distance", async (req, res) => {
  if (!req.body.from || !req.body.to || !req.body.distance) {
    return res
      .status(400)
      .json({ message: "From, to and distance are required" });
  }
  try {
    const existingDistance = await Distance.findOne({
      from: req.body.from,
      to: req.body.to,
    });
    if (existingDistance) {
      return res.status(400).json({ message: "Distance already exists" });
    }

    const checkpoints = [req.body.from, req.body.to].sort();

    const distance = await Distance.create({
      from: checkpoints[0],
      to: checkpoints[1],
      distance: Number(req.body.distance),
    });

    res.status(201).json(distance);
  } catch (err) {
    res.status(500).json({ message: "Failed to create distance" });
  }
});

app.get("/distances", async (req, res) => {
  try {
    const distances = await Distance.find();
    res.status(200).json(distances);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch distances" });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(4001, () => {
  console.log("Server running on port 4001");
});
