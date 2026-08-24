import "./Topbar.css";
import { Search, Person, Chat, Notifications, Menu, Close } from "@mui/icons-material";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../sidebar/Sidebar";
import Swal from 'sweetalert2';

const Topbar = () => {

  const { user, dispatch } = useContext(AuthContext);
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const resolvePath = (path) => path ? (path.startsWith("http") ? path : PF + path) : "";
  const profileImage = user?.profilePicture ? resolvePath(user.profilePicture) : PF + "person/noAvatar.jpg";
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
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your account.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        dispatch({ type: "LOGOUT" });
        navigate("/login");
      }
    });
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
            <div className="topbarIconItem not-functional">
              <Person />
              <span className="topbarIconBadge">1</span>
            </div>
            <div className="topbarIconItem not-functional">
              <Chat />
              <span className="topbarIconBadge">2</span>
            </div>
            <div className="topbarIconItem not-functional">
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
          <form className="searchBar" onSubmit={handleSearch} style={{margin: "0", height: "35px", width: "100%"}}>
            <Search className="searchIcon" style={{fontSize: "18px", marginLeft: "5px"}}/>
            <input 
              placeholder="Search..." 
              className="searchInput" 
              value={searchQuery}
              onChange={handleSearchChange}
              style={{fontSize: "12px", width: "100%"}}
            />
          </form>
        </div>
        <div className="mobileRight">
          <Chat className="mobileMessageIcon not-functional" />
          <Link to={profileLink} style={{display: "flex"}}>
            <img src={profileImage} alt="" className="mobileAvatarImg" />
          </Link>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="mobileMenuOverlay">
          <div className="mobileMenuHeader">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={{textDecoration:"none"}}><span className="logo">ZakoraSocial</span></Link>
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