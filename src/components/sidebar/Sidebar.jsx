import "./sidebar.css"
import { RssFeed, Chat, PlayCircle, Group, Bookmark, Help, Work, Event, School } from "@mui/icons-material";
import Closefriends from "../closeFriends/CloseFriends";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const [users, setUsers] = useState([]);
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/users/all");
        // Filter out current user from the random persons list
        setUsers(res.data.filter(u => u._id !== currentUser?._id));
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, [currentUser]);

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">

        <ul className="sidebarList">
          <li className="sidebarListItem">
            <RssFeed className="sidebarIcon" />
            <span className="sidebarListItemText">Feed</span>
          </li>
          <li className="sidebarListItem not-functional">
            <Chat className="sidebarIcon" />
            <span className="sidebarListItemText">Chats</span>
          </li>
          <li className="sidebarListItem not-functional">
            <PlayCircle className="sidebarIcon" />
            <span className="sidebarListItemText">Videos</span>
          </li>
          <li className="sidebarListItem not-functional">
            <Group className="sidebarIcon" />
            <span className="sidebarListItemText">Groups</span>
          </li>
          <li className="sidebarListItem not-functional">
            <Bookmark className="sidebarIcon" />
            <span className="sidebarListItemText">Bookmarks</span>
          </li>
          <li className="sidebarListItem not-functional">
            <Help className="sidebarIcon" />
            <span className="sidebarListItemText">Questions</span>
          </li>
          <li className="sidebarListItem not-functional">
            <Work className="sidebarIcon" />
            <span className="sidebarListItemText">Jobs</span>
          </li>
          <li className="sidebarListItem not-functional">
            <Event className="sidebarIcon" />
            <span className="sidebarListItemText">Events</span>
          </li>
          <li className="sidebarListItem not-functional">
            <School className="sidebarIcon" />
            <span className="sidebarListItemText">Courses</span>
          </li>
        </ul>

        <button className="sidebarButton not-functional">Show More</button>

        <hr className="sidebarHr"/>

        <ul className="sidebarFriendList">
         {users.map((u) => (
          <Link to={"/profile/" + u.username} style={{textDecoration: "none", color: "inherit"}} key={u._id}>
            <Closefriends user={u} />
          </Link>
         ))}
        </ul>

      </div>
    </div>
  )
}

export default Sidebar