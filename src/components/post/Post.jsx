import { useState , useEffect, useContext } from 'react';
import './post.css'
import { MoreVert } from '@mui/icons-material';
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import Swal from 'sweetalert2';
const Post = ({ post }) => {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);

  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const { user:currentUser } = useContext(AuthContext);

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
            <img src={user.profilePicture ? PF + user.profilePicture : PF+"person/noAvatar.jpg"} alt="" className="postProfileImg" />
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
          <div className="postText" style={{ whiteSpace: "pre-wrap" }}>{post?.desc}</div>
          
          {post.img && typeof post.img === "string" && (
            <img src={PF + post.img} alt="" className="postImg" />
          )}
          
          {post.img && Array.isArray(post.img) && post.img.length > 0 && (
            <div className="postImagesContainer" style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
              {post.img.map((imgName, i) => (
                <img key={i} src={PF + imgName} alt="" className="postImg" style={{ margin: 0 }} />
              ))}
            </div>
          )}

          {post.video && Array.isArray(post.video) && post.video.length > 0 && (
            <div className="postVideosContainer" style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
              {post.video.map((videoName, i) => (
                <video key={i} src={PF + videoName} controls className="postImg" style={{ margin: 0, backgroundColor: "#000" }} />
              ))}
            </div>
          )}
        </div>

        <div className="postBottom">
          <div className="postBottomLeft">
            <img src={`${PF}like.png`} onClick={likeHandler} alt="" className="likeIcon" />
            <img src={`${PF}heart.png`} onClick={likeHandler} alt="" className="likeIcon" />
            <span className='postLikeCounter'>{like} people like it</span>
          </div>

          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post;
