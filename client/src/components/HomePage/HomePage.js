import "./HomePage.css";
import { useContext, useEffect, useState } from "react";
import UserDataContext from "../../contexts/UserDataContext";
import axios from "axios";
import WeatherDisplay from "../WeatherDisplay/WeatherDisplay";

const HomePage = () => {
  const { userDataContextValue } = useContext(UserDataContext);
  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:4000/");
        setWeatherData(res.data);
      } catch (err) {
        setError(err.response.data.message);
      }
    };

    fetchData();
  }, []);
  return (
    <main>
      {userDataContextValue ? (
        <section>
          <WeatherDisplay weatherData={weatherData} error={error} />
        </section>
      ) : (
        <section>
          <h1>Welcome to Lodz City Bikers Community</h1>
          <p>
            We are happy to see you, if you create an account you will get an
            opportunity to attend or create bike meetings in the city of Lodz.
          </p>
          <WeatherDisplay weatherData={weatherData} error={error} />
        </section>
      )}
    </main>
  );
};

export default HomePage;
