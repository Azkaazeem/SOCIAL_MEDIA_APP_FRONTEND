import "./rightbar.css";
import { Online } from "../online/Online";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"
import { Add, Remove, Edit } from "@mui/icons-material"

const Rightbar = ({ user }) => {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([])
  const { user: currentUser, dispatch } = useContext(AuthContext)
  const [followed, setFollowed] = useState(false)

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    city: "",
    from: "",
    relationship: 1
  });

  useEffect(() => {
    if (user?._id) {
        setFollowed(currentUser.followings.includes(user._id));
    }
    setEditData({
      city: user?.city || "",
      from: user?.from || "",
      relationship: user?.relationship || 1
    });
  }, [currentUser, user]);

  useEffect(() => {
    const getFriends = async () => {
      const targetUserId = user?._id || currentUser._id;
      if (!targetUserId) return;
      try {
        const friendList = await axios.get("/users/friends/" + targetUserId);
        setFriends(friendList.data)
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user, currentUser]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put("/users/" + user._id + "/unfollow", {userId:currentUser._id});
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put("/users/" + user._id + "/follow", {userId:currentUser._id});
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
    } catch (err) {
      console.log(err);
    }
  }

  const handleEditSave = async () => {
    try {
      const updateData = { userId: currentUser._id, ...editData };
      await axios.put(`/users/${currentUser._id}`, updateData);
      dispatch({ type: "UPDATE_USER", payload: updateData });
      setIsEditing(false);
    } catch (err) {
      console.log(err);
    }
  }

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  }

  const HomeRightbar = () => {
    const today = new Date();
    const todayMonth = today.getMonth() + 1; // 1-12
    const todayDate = today.getDate();

    const birthdayFriends = friends.filter(f => {
      if (!f.dob) return false;
      const dobDate = new Date(f.dob);
      return (dobDate.getMonth() + 1) === todayMonth && dobDate.getDate() === todayDate;
    });

    return (
      <>
        {birthdayFriends.length > 0 && (
          <div className="birthdayContainer">
            <img className="birthdayImg" src="/assets/gift.png" alt="" />
            <span className="birthdayText">
              <b>{birthdayFriends.map(f => f.username).join(", ")}</b> {birthdayFriends.length > 1 ? "have" : "has"} a birthday today!
            </span>
          </div>
        )}
        <img src="assets/ad.png" alt="" className="rightbarAd" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {friends.map((u) => (
            <Link to={"/profile/" + u.username} style={{textDecoration: "none", color: "inherit"}} key={u._id}>
                <Online user={u} />
            </Link>
          ))}
        </ul>
      </>
    )
  }

  const ProfileRightbar = () => {
    const isOwnProfile = user?.username === currentUser.username;

    return (
      <>
        {
          !isOwnProfile && (
            <button className="rightbarFollowButton" onClick={handleClick}>
              {followed ? "Unfollow" : "Follow"}
              {followed ? <Remove /> : <Add />}
            </button>
          )
        }
        
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px"}}>
          <h4 className="rightbarTitle" style={{marginBottom: 0}}>User Information</h4>
          {isOwnProfile && !isEditing && (
            <button onClick={() => setIsEditing(true)} style={{border: "none", background: "transparent", color: "#4f46e5", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontWeight: "600"}}>
              <Edit style={{fontSize: "16px"}}/> Edit
            </button>
          )}
        </div>

        <div className="rightbarInfo">
          {isEditing ? (
            <div style={{display: "flex", flexDirection: "column", gap: "10px", padding: "10px 0"}}>
              <div>
                <label style={{fontSize: "14px", color: "#6b7280", marginBottom: "5px", display: "block"}}>City</label>
                <input type="text" name="city" value={editData.city} onChange={handleEditChange} style={{width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #d1d5db"}} />
              </div>
              <div>
                <label style={{fontSize: "14px", color: "#6b7280", marginBottom: "5px", display: "block"}}>From</label>
                <input type="text" name="from" value={editData.from} onChange={handleEditChange} style={{width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #d1d5db"}} />
              </div>
              <div>
                <label style={{fontSize: "14px", color: "#6b7280", marginBottom: "5px", display: "block"}}>Relationship</label>
                <select name="relationship" value={editData.relationship} onChange={handleEditChange} style={{width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #d1d5db"}}>
                  <option value={1}>Single</option>
                  <option value={2}>Married</option>
                  <option value={3}>-</option>
                </select>
              </div>
              <div style={{display: "flex", gap: "10px", marginTop: "10px"}}>
                <button onClick={handleEditSave} style={{padding: "6px 15px", backgroundColor: "#4f46e5", color: "white", border: "none", borderRadius: "5px", cursor: "pointer"}}>Save</button>
                <button onClick={() => setIsEditing(false)} style={{padding: "6px 15px", backgroundColor: "#e5e7eb", color: "#4b5563", border: "none", borderRadius: "5px", cursor: "pointer"}}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className="rightbarInfoItem">
                <div className="rightbarInfoKey">City:</div>
                <div className="rightbarInfoValue"> {user.city}</div>
              </div>

              <div className="rightbarInfoItem">
                <div className="rightbarInfoKey">From:</div>
                <div className="rightbarInfoValue"> {user.from}</div>
              </div>

              <div className="rightbarInfoItem">
                <div className="rightbarInfoKey">Relationship:</div>
                <div className="rightbarInfoValue"> {user.relationship === 1 ? "Single" : user.relationship === 2 ? "Married" : "-"}</div>
              </div>
            </>
          )}
        </div>

        <h4 className="rightbarTitle">User Friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend, index) => (
            <Link style={{ textDecoration: "none", color: "black" }} key={friend._id} to={"/profile/" + friend.username}>
              <div className="rightbarFollowing" key={index}>
                <img src={friend.profilePicture ? PF + friend.profilePicture : PF + "person/noAvatar.jpg"} alt="" className="rightbarFollowingImg" />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    )
  }

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  )
}

export default Rightbar