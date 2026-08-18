import { useState,useEffect } from "react";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import "./profile.css";
import axios from "axios";
import { useParams } from "react-router-dom";

const Profile = () => {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const { username } = useParams();
  

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`);
      setUser(res.data);
    };
    fetchUser();
  }, [username])

  const coverImage = user?.coverPicture ? PF + user.coverPicture : PF + "person/noBanner.jpg";
  const profileImage = user?.profilePicture ? PF + user.profilePicture : PF + "person/noAvatar.jpg";

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img src={coverImage} alt="" className="profileCoverImg" />
              <img src={profileImage} alt="" className="profileUserImg" />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username}/>
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile;
