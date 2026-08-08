import { useState } from 'react';
import './post.css'
import { MoreVert } from '@mui/icons-material';
import {Users} from "../../dummyData";


const Post = ({post}) => {
  // {console.log(post);}
  const [ like , setLike ] = useState(post.like);
  const [ isLiked , setIsLiked ] = useState(false);

  const PF = import.meta.env.VITE_PUBLIC_FOLDER;

  const likeHandler = () => {
    setLike(isLiked ? like - 1 : like + 1)
    setIsLiked(!isLiked)
  }
  return (
    <div className='post'>
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <img src={Users.find((u) => u.id === post.userId)?.profilePicture} alt="" className="postProfileImg" />
            <div className="postUsername">{Users.find((u) => u.id === post.userId)?.username}</div>
            <div className="postDate">{post.date} ago</div>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>

        <div className="postCenter">
          <div className="postText">{post?.desc}</div>
          <img src= {PF+post.photo} alt="" className="postImg" />
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
