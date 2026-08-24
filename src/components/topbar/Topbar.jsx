import "./Topbar.css";
import { Search, Person, Chat, Notifications } from "@mui/icons-material";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Topbar = () => {

  const {user} = useContext(AuthContext);
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const profileImage = user?.profilePicture ? PF + user.profilePicture : PF + "person/noAvatar.jpg";
  const profileLink = user?.username ? `/profile/${user.username}` : "/login";

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    // Dispatch a custom event so Feed can filter posts in real-time
    window.dispatchEvent(new CustomEvent('searchQueryChanged', { detail: query }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/profile/${searchQuery}`);
      setSearchQuery(""); // Clear after searching
      window.dispatchEvent(new CustomEvent('searchQueryChanged', { detail: "" }));
    }
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{textDecoration:"none"}}><span className="logo">ZakoraSocial</span></Link>
      </div>
      <div className="topbarCenter">
        <form className="searchBar" onSubmit={handleSearch}>
          <Search className="searchIcon"/>
          <input 
            placeholder="Search for posts or friends..." 
            className="searchInput" 
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </form>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">Home Page</span>
          <span className="topbarLink">Timeline</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>

          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">2</span>
          </div>

          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>

      <Link to={profileLink} >
        <img src={profileImage} alt="" className="topbarImg" />
      </Link>
      </div>
    </div>
  )
}

export default Topbar;