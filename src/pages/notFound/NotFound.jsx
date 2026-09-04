import { Link } from "react-router-dom";
import { Home, SentimentDissatisfied } from "@mui/icons-material";
import "./notFound.css";

const NotFound = () => {
  return (
    <div className="notFoundContainer">
      <div className="notFoundCard">
        <div className="notFoundIconWrapper">
          <SentimentDissatisfied className="notFoundIcon" />
        </div>
        <div className="notFoundBadge">404 ERROR</div>
        <h1 className="notFoundTitle">Page Not Found</h1>
        <p className="notFoundDesc">
          Oops! The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <div className="notFoundActions">
          <Link to="/" className="notFoundHomeBtn">
            <Home style={{ fontSize: "20px" }} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
