import { useState , useEffect, useContext } from 'react';
import './post.css'
import { MoreVert, Favorite, FavoriteBorder } from '@mui/icons-material';
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/SocketContext';
import Swal from 'sweetalert2';
const Post = ({ post }) => {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const resolvePath = (path) => path ? (path.startsWith("http") ? path : PF + path) : null;
  const { user:currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  useEffect( () => {
    setIsLiked(post.likes.includes(currentUser._id))
  }, [currentUser._id, post.likes])

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId])

  const likeHandler = async () => {
    try {
      await axios.put("/posts/" + post._id + "/like" , { userId: currentUser._id })
      
      // If we are liking the post (and it's not our own post)
      if (!isLiked && socket && currentUser._id !== post.userId) {
        socket.emit("sendNotification", {
          senderName: currentUser.username,
          senderProfilePicture: currentUser.profilePicture,
          receiverName: user.username,
          type: "like",
          postId: post._id,
        });
      }
    } catch (err) {

    }
    setLike(isLiked ? like - 1 : like + 1)
    setIsLiked(!isLiked)
  }

  const handleDelete = () => {
    Swal.fire({
      title: 'Delete Post?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/posts/${post._id}`, { data: { userId: currentUser._id } });
          window.dispatchEvent(new CustomEvent('postCreated')); // reuse this event to trigger feed refresh
          Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
        } catch(err) {
          console.log(err);
          Swal.fire('Error!', 'Something went wrong.', 'error');
        }
      }
    });
  }
  
  return (
    <div className='post'>
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
            <img src={user.profilePicture ? resolvePath(user.profilePicture) : "https://i.pinimg.com/736x/2c/3b/f6/2c3bf6dcf64197a30ee1efea7d198ddd.jpg"} alt="" className="postProfileImg" />
            </Link>
            <div className="postUsername">{user.username}</div>
            <div className="postDate">{format(post.createdAt)}</div>
          </div>
          <div className="postTopRight" style={{position: "relative"}}>
            {post.userId === currentUser._id && (
              <>
                <MoreVert style={{cursor: "pointer"}} onClick={() => setMenuOpen(!menuOpen)} />
                {menuOpen && (
                  <div className="postDropdown">
                    <span onClick={handleDelete} className="postDropdownItem">Delete</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="postCenter">
          <div className="postText" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowWrap: "anywhere" }}>{post?.desc}</div>
          
          {post.img && typeof post.img === "string" && (
            <img src={resolvePath(post.img)} alt="" className="postImg" />
          )}
          
          {post.img && Array.isArray(post.img) && post.img.length > 0 && (
            <div className="postImagesContainer" style={{ position: "relative", marginTop: "10px", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f3f4f6", borderRadius: "12px", overflow: "hidden" }}>
              <img src={resolvePath(post.img[currentImgIndex])} alt="" className="postImg" style={{ margin: 0, maxHeight: "500px", width: "100%", objectFit: "contain" }} />
              
              {post.img.length > 1 && (
                <>
                  <div onClick={() => setCurrentImgIndex((prev) => (prev - 1 + post.img.length) % post.img.length)} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", backgroundColor: "rgba(0,0,0,0.5)", color: "white", width: "30px", height: "30px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", userSelect: "none" }}>
                    &#10094;
                  </div>
                  <div onClick={() => setCurrentImgIndex((prev) => (prev + 1) % post.img.length)} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", backgroundColor: "rgba(0,0,0,0.5)", color: "white", width: "30px", height: "30px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", userSelect: "none" }}>
                    &#10095;
                  </div>
                  <div style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", backgroundColor: "rgba(0,0,0,0.5)", color: "white", padding: "4px 10px", borderRadius: "12px", fontSize: "12px" }}>
                    {currentImgIndex + 1} / {post.img.length}
                  </div>
                </>
              )}
            </div>
          )}

          {post.video && Array.isArray(post.video) && post.video.length > 0 && (
            <div className="postVideosContainer" style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
              {post.video.map((videoName, i) => (
                <video key={i} src={resolvePath(videoName)} controls crossOrigin="anonymous" preload="metadata" className="postImg" style={{ margin: 0, backgroundColor: "#000" }} />
              ))}
            </div>
          )}
        </div>

        <div className="postBottom">
          <div className="postBottomLeft">
            {isLiked ? (
              <Favorite htmlColor="red" onClick={likeHandler} className="likeIcon" style={{ cursor: "pointer", fontSize: "24px", marginRight: "5px" }} />
            ) : (
              <FavoriteBorder htmlColor="red" onClick={likeHandler} className="likeIcon" style={{ cursor: "pointer", fontSize: "24px", marginRight: "5px" }} />
            )}
            <span className='postLikeCounter'>{like} people like it</span>
          </div>

          <div className="postBottomRight not-functional">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post;
