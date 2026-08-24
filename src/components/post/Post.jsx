import { useState , useEffect, useContext } from 'react';
import './post.css'
import { MoreVert } from '@mui/icons-material';
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';


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

  const handleDelete = async () => {
    if(window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`/posts/${post._id}`, { data: { userId: currentUser._id } });
        window.dispatchEvent(new CustomEvent('postCreated')); // reuse this event to trigger feed refresh
      } catch(err) {
        console.log(err);
      }
    }
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
          <div className="postText">{post?.desc}</div>
          {post.img && <img src={PF + post.img} alt="" className="postImg" />}
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
