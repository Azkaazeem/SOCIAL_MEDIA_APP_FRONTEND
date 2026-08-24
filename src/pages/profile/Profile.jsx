import { useState, useEffect, useContext } from "react";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import "./profile.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { AddAPhoto } from "@mui/icons-material";

const Profile = () => {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const { username } = useParams();
  const { user: currentUser, dispatch } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`);
      setUser(res.data);
    };
    fetchUser();
  }, [username, currentUser]) // added currentUser to dep array so if we update current user, profile re-renders

  const handleImageUpdate = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      
      const updateData = { userId: currentUser._id };
      updateData[type] = fileName;

      try {
        await axios.post("/upload", data);
        await axios.put(`/users/${currentUser._id}`, updateData);
        // Update local context
        dispatch({ type: "UPDATE_USER", payload: updateData });
        // Update local state to reflect instantly
        setUser(prev => ({ ...prev, ...updateData }));
      } catch (err) {
        console.error(err);
      }
    }
  }

  const isOwnProfile = username === currentUser.username;
  const coverImage = user.coverPicture ? PF + user.coverPicture : PF + "person/noBanner.jpg";
  const profileImage = user.profilePicture ? PF + user.profilePicture : PF + "person/noAvatar.jpg";

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img src={coverImage} alt="" className="profileCoverImg" />
              {isOwnProfile && (
                <label htmlFor="coverFile" className="editCoverBtn">
                  <AddAPhoto /> <span>Edit Cover</span>
                  <input style={{ display: "none" }} type="file" id="coverFile" accept=".png,.jpeg,.jpg" onChange={(e) => handleImageUpdate(e, "coverPicture")} />
                </label>
              )}
              
              <div className="profileUserImgContainer">
                <img src={profileImage} alt="" className="profileUserImg" />
                {isOwnProfile && (
                  <label htmlFor="profileFile" className="editProfileBtn">
                    <AddAPhoto style={{fontSize: "18px"}} />
                    <input style={{ display: "none" }} type="file" id="profileFile" accept=".png,.jpeg,.jpg" onChange={(e) => handleImageUpdate(e, "profilePicture")} />
                  </label>
                )}
              </div>
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
