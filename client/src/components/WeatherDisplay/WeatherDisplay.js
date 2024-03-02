import "./WeatherDisplay.css";
import { Cloud } from "lucide-react";

const WeatherDisplay = ({ weatherData, error }) => {
  return (
    <div className="weather-display">
      {!error && weatherData ? (
        <div className="container">
          <Cloud size="100" />
          <div>
            <h2>Weather in Lodz</h2>
            <p>Temperature: {weatherData.temperature}°C</p>
            <p>Pressure: {weatherData.pressure}hPa</p>
            <p>Humidity: {weatherData.humidity}%</p>
            <p>Wind: {weatherData.wind}m/s</p>
          </div>
        </div>
      ) : (
        <p className="error container">{error}</p>
      )}
    </div>
  );
};

export default WeatherDisplay;
