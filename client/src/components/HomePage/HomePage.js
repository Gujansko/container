import "./HomePage.css";
import { useContext, useEffect, useState } from "react";
import UserDataContext from "../../contexts/UserDataContext";
import axios from "axios";
import WeatherDisplay from "../WeatherDisplay/WeatherDisplay";
import HeroWithLink from "../HeroWithLink/HeroWithLink";

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
          <div className="hero-wrapper">
            <HeroWithLink
              title="Create a new meeting"
              description="Create a new bike meeting in the city of Lodz and tell others about it"
              url="/create-meeting"
              urlText="Create Meeting"
            />
            <HeroWithLink
              title="Check out the meetings"
              description="Attend a bike meeting and have fun with other bikers"
              url="/meetings"
              urlText="Meetings"
            />
            <HeroWithLink
              title="My meetings"
              description="See the meetings you want to attend or the ones you already attended"
              url="/my-meetings"
              urlText="My Meetings"
            />
            <HeroWithLink
              title="Create a new checkpoint"
              description="Create a new checkpoint in the city of Lodz so we could visit it on our bike meetings"
              url="/checkpoint"
              urlText="Create Checkpoint"
            />
          </div>
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
