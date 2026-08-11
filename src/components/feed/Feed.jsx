import Share from "../share/Share";
import Post from "../post/Post";
import "./feed.css";
import { useEffect, useState } from "react";
import axios from "axios";

const Feed = ({username}) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = username
        ? await axios.get("/posts/profile/" + username)
        : await axios.get("/posts/timeline/6a6eebd4b19b454046a134df");
      setPosts(res.data);
    };
    fetchPosts();
  }, [username])
  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share />
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  )
}

export default Feed;
