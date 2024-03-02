import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://mongo:27017/mydb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", async (req, res) => {
  try {
    fetch(
      "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/%C5%81%C3%B3d%C5%BA%2C%2010%2C%20PL/today?unitGroup=metric&include=obs%2Ccurrent&key=AYV277Z85K8LCTMK9P8TQHG3X&contentType=json",
      {
        method: "GET",
        headers: {},
      }
    )
      .then(async (response) => {
        const responseJson = await response.json();
        const data = {
          conditions: responseJson.currentConditions.conditions,
          temperature: responseJson.currentConditions.temp,
          wind: responseJson.currentConditions.windspeed,
          humidity: responseJson.currentConditions.humidity,
        };
        res.status(200).json(data);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: "Failed to fetch weather data from server" });
      });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch weather data from server" });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
