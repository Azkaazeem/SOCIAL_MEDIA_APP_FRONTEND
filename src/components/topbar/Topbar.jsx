import "./Topbar.css";
import { Search, Person, Chat, Notifications, Menu, Close, Logout } from "@mui/icons-material";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../sidebar/Sidebar";
import Swal from 'sweetalert2';
import { SocketContext } from "../../context/SocketContext";

const Topbar = () => {

  const { user, dispatch } = useContext(AuthContext);
  const { notifications, setNotifications } = useContext(SocketContext);
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);

  const resolvePath = (path) => path ? (path.startsWith("http") ? path : PF + path) : "";
  const profileImage = user?.profilePicture ? resolvePath(user.profilePicture) : "https://i.pinimg.com/736x/2c/3b/f6/2c3bf6dcf64197a30ee1efea7d198ddd.jpg";
  const profileLink = user?.username ? `/profile/${user.username}` : "/login";

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    window.dispatchEvent(new CustomEvent('searchQueryChanged', { detail: query }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/`);
      setIsMobileMenuOpen(false); 
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

  const handleNotificationClick = () => {
    setOpenNotifications(!openNotifications);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
            <span className="topbarLink" onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Logout style={{ fontSize: "18px" }} /> Logout
            </span>
          </div>
          <div className="topbarIcons">
            <div className="topbarIconItem" onClick={handleNotificationClick} style={{cursor: "pointer", position: "relative"}}>
              <Notifications />
              {unreadCount > 0 && <span className="topbarIconBadge">{unreadCount}</span>}
              
              {openNotifications && (
                <div className="notificationsDropdown" style={{ position: "absolute", top: "45px", right: "-10px", backgroundColor: "white", color: "black", width: "320px", borderRadius: "10px", boxShadow: "0px 0px 15px -10px rgba(0,0,0,0.75)", zIndex: 999, padding: "15px", maxHeight: "400px", overflowY: "auto" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ddd", paddingBottom: "10px", marginBottom: "10px" }}>
                    <h4 style={{ margin: 0, fontSize: "16px", color: "#333" }}>Notifications</h4>
                    {notifications.length > 0 && (
                      <span onClick={(e) => { e.stopPropagation(); setNotifications([]); }} style={{ fontSize: "12px", color: "#ef4444", cursor: "pointer", fontWeight: "600" }}>Clear All</span>
                    )}
                  </div>
                  
                  {notifications.length === 0 ? (
                    <span style={{ fontSize: "14px", color: "gray", display: "block", textAlign: "center", margin: "20px 0" }}>No new notifications</span>
                  ) : (
                    notifications.map((n, i) => (
                      <div key={n.id || i} style={{ display: "flex", alignItems: "center", padding: "10px", borderBottom: "1px solid #eee", gap: "10px", cursor: "pointer", backgroundColor: n.isRead ? "white" : "#fce4ec", borderRadius: "8px", marginBottom: "5px" }} onClick={() => { 
                          setOpenNotifications(false); 
                          setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, isRead: true } : item));
                          if (n.type === "like" && n.postId) {
                            navigate(`/post/${n.postId}`);
                          } else {
                            navigate(`/profile/${n.senderName}`); 
                          }
                        }}>
                        <img 
                          src={n.senderProfilePicture ? resolvePath(n.senderProfilePicture) : "https://i.pinimg.com/736x/2c/3b/f6/2c3bf6dcf64197a30ee1efea7d198ddd.jpg"} 
                          alt="" 
                          style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} 
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenNotifications(false);
                            setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, isRead: true } : item));
                            navigate(`/profile/${n.senderName}`);
                          }}
                        />
                        <div style={{ flex: 1, fontSize: "13px", lineHeight: "1.4" }}>
                          <span style={{ fontWeight: "bold" }}>{n.senderName}</span> {n.type === "like" ? "liked your post." : "started following you."}
                        </div>
                        <Close 
                          style={{ fontSize: "24px", color: "#ef4444", padding: "5px", cursor: "pointer" }} 
                          onClick={(e) => {
                            e.stopPropagation();
                            setNotifications((prev) => prev.filter((item) => item.id !== n.id));
                          }} 
                        />
                      </div>
                    ))
                  )}
                </div>
              )}
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