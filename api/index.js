import express from "express";
import cors from "cors";
import mongoose from "mongoose";

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

app.get("/", async (req, res) => {
  try {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Lodz&APPID=${process.env.WEATHER_API_KEY}&units=metric`,
      {
        method: "GET",
        headers: {},
      }
    )
      .then(async (response) => {
        const responseJson = await response.json();
        const data = {
          description: responseJson.weather[0].description,
          icon: responseJson.weather[0].icon,
          temperature: responseJson.main.temp,
          humidity: responseJson.main.humidity,
          wind: responseJson.wind.speed,
          city: responseJson.name,
          pressure: responseJson.main.pressure,
        };
        res.status(200).json(data);
      })
      .catch((err) => {
        console.log(err);
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
