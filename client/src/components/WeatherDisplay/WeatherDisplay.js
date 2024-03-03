import "./WeatherDisplay.css";

const WeatherDisplay = ({ weatherData, error }) => {
  return (
    <div className="weather-display">
      {!error && weatherData ? (
        <div className="container">
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
            alt="Weather Icon"
            className="weather-icon"
          />
          <div>
            <h2>Weather in {weatherData.city}</h2>
            <p>Conditions: {weatherData.description}</p>
            <p>Temperature: {weatherData.temperature}°C</p>
            <p>Humidity: {weatherData.humidity}%</p>
            <p>Wind: {weatherData.wind}m/s</p>
            <p>Pressure: {weatherData.pressure}hPa</p>
          </div>
        </div>
      ) : (
        <p className="error container">{error}</p>
      )}
    </div>
  );
};

export default WeatherDisplay;
