import "./Topbar.css";
import { Search, Person, Chat, Notifications, Menu, Close } from "@mui/icons-material";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../sidebar/Sidebar";

const Topbar = () => {

  const { user, dispatch } = useContext(AuthContext);
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const profileImage = user?.profilePicture ? PF + user.profilePicture : PF + "person/noAvatar.jpg";
  const profileLink = user?.username ? `/profile/${user.username}` : "/login";

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    window.dispatchEvent(new CustomEvent('searchQueryChanged', { detail: query }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/profile/${searchQuery}`);
      setSearchQuery(""); // Clear after searching
      window.dispatchEvent(new CustomEvent('searchQueryChanged', { detail: "" }));
      setIsMobileMenuOpen(false); // Close menu if searching from mobile overlay
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("user");
      dispatch({ type: "LOGOUT" });
      navigate("/login");
    }
  };

  return (
    <div className="topbarContainer">
      {/* DESKTOP TOPBAR */}
      <div className="topbarDesktop">
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
            <span className="topbarLink" onClick={() => navigate("/")}>Home</span>
            <span className="topbarLink" onClick={handleLogout}>Logout</span>
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

      {/* MOBILE TOPBAR */}
      <div className="topbarMobile">
        <div className="mobileLeft" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <Close className="mobileHamburgerIcon" /> : <Menu className="mobileHamburgerIcon" />}
        </div>
        <div className="mobileCenter">
          <Link to={profileLink} >
            <img src={profileImage} alt="" className="mobileAvatarImg" />
          </Link>
        </div>
        <div className="mobileRight">
          <Chat className="mobileMessageIcon" />
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="mobileMenuOverlay">
          <div className="mobileMenuHeader">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={{textDecoration:"none"}}><span className="logo">ZakoraSocial</span></Link>
          </div>
          <div className="mobileMenuSearch">
            <form className="searchBar" onSubmit={handleSearch}>
              <Search className="searchIcon"/>
              <input 
                placeholder="Search..." 
                className="searchInput" 
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </form>
          </div>
          <div style={{padding: "0 20px", marginTop: "10px", display: "flex", gap: "15px"}}>
             <button style={{padding: "8px 16px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", width: "100%"}} onClick={handleLogout}>Logout</button>
          </div>
          <div className="mobileMenuSidebarWrapper">
             <Sidebar />
          </div>
        </div>
      )}
    </div>
  )
}

export default Topbar;