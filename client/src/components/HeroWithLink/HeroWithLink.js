import { Link } from "react-router-dom";
import "./HeroWithLink.css";

const HeroWithLink = ({ title, description, url, urlText }) => {
  return (
    <div className="hero-container">
      <h2>{title}</h2>
      <p>{description}</p>
      <Link to={url} className="activity-link">
        {urlText}
      </Link>
    </div>
  );
};

export default HeroWithLink;
