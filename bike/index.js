import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Distance from "./models/Distance.js";
import Checkpoint from "./models/Checkpoint.js";
import Meeting from "./models/Meeting.js";
import generateGoogleMapsLink from "./functions/generateGoogleMapsLink.js";

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

    const distance = await Distance.create({
      from: req.body.from,
      to: req.body.to,
      distance: Number(req.body.distance),
    });

    await Distance.create({
      from: req.body.to,
      to: req.body.from,
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

app.post("/meeting", async (req, res) => {
  if (
    !req.body.checkpoints ||
    !req.body.date ||
    !req.body.distance ||
    !req.body.attendees
  ) {
    return res
      .status(400)
      .json({ message: "Checkpoints, distance and attendees are required" });
  }
  if (req.body.checkpoints.length < 2) {
    return res
      .status(400)
      .json({ message: "At least two checkpoints are required" });
  }

  try {
    const checkpoints = await Checkpoint.find({
      _id: { $in: req.body.checkpoints },
    });
    if (checkpoints.length !== req.body.checkpoints.length) {
      return res.status(400).json({ message: "Invalid checkpoint" });
    }

    const checkpointMap = new Map(
      checkpoints.map((checkpoint) => [checkpoint._id.toString(), checkpoint])
    );
    const orderedCheckpoints = req.body.checkpoints.map((checkpointId) =>
      checkpointMap.get(checkpointId)
    );

    const googleMapsLink = generateGoogleMapsLink(
      orderedCheckpoints[0].name,
      orderedCheckpoints[orderedCheckpoints.length - 1].name,
      orderedCheckpoints.slice(1, -1).map((checkpoint) => checkpoint.name)
    );

    const meeting = await Meeting.create({
      checkpoints: req.body.checkpoints,
      date: new Date(req.body.date),
      distance: new Number(req.body.distance),
      attendees: req.body.attendees,
      googleMapsLink,
    });
    res.status(201).json(meeting);
  } catch (err) {
    res.status(500).json({ message: "Failed to create meeting" });
  }
});

app.get("/meetings", async (req, res) => {
  try {
    const meetings = await Meeting.find();
    res.status(200).json(meetings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch meetings" });
  }
});

app.get("/meetings/:userId", async (req, res) => {
  try {
    const meetings = await Meeting.find({ attendees: req.params.userId });
    res.status(200).json(meetings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch meetings" });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(4001, () => {
  console.log("Server running on port 4001");
});
