import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Note from "./models/Note.js";

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

app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post("/notes", async (req, res) => {
  if (!req.body.title || !req.body.content) {
    return res.status(400).json({ message: "Invalid data" });
  }
  const note = new Note({
    title: req.body.title,
    content: req.body.content,
  });

  try {
    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (err) {
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(4001, () => {
  console.log("Server running on port 4001");
});
