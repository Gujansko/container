import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import User from "./models/User.js";

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

app.get("/login/:userName/:password", async (req, res) => {
  try {
    if (!req.params.userName || !req.params.password) {
      return res.status(400).json({ message: "Invalid data" });
    }
    const user = await User.findOne({
      userName: req.params.userName,
      password: req.params.password,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post("/register", async (req, res) => {
  if (!req.body.userName || !req.body.password) {
    return res.status(400).json({ message: "Invalid data" });
  }
  const user = new User({
    userName: req.body.userName,
    password: req.body.password,
  });

  try {
    const savedUser = await user.save();
    res.status(201).json(savedUser);
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
