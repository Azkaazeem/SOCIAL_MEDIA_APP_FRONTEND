import Share from "../share/Share";
import Post from "../post/Post";
import "./feed.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const Feed = ({username}) => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useContext(AuthContext);

  const fetchPosts = async () => {
    try {
      const res = username
        ? await axios.get("/posts/profile/" + username)
        : await axios.get("/posts/all");
      
      // Sort posts to show newest first
      setPosts(res.data.sort((p1, p2) => {
        return new Date(p2.createdAt) - new Date(p1.createdAt);
      }));
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  };

  useEffect(() => {
    if (username || user?._id) {
      fetchPosts();
    }
  }, [username, user?._id]);

  useEffect(() => {
    window.addEventListener('postCreated', fetchPosts);
    return () => window.removeEventListener('postCreated', fetchPosts);
  }, [username, user?._id]);

  // Listen for search query changes from Topbar
  useEffect(() => {
    const handleSearch = (e) => setSearchQuery(e.detail.toLowerCase());
    window.addEventListener('searchQueryChanged', handleSearch);
    return () => window.removeEventListener('searchQueryChanged', handleSearch);
  }, []);

  const displayedPosts = posts.filter(p => 
    searchQuery === "" || (p.desc && p.desc.toLowerCase().includes(searchQuery))
  );

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username ===  user.username ) && <Share />}
        {displayedPosts.length > 0 ? (
          displayedPosts.map((p) => (
            <Post key={p._id} post={p} />
          ))
        ) : (
          <div style={{ textAlign: "center", marginTop: "20px", color: "#6b7280" }}>
            No posts found.
          </div>
        )}
      </div>
    </div>
  )
}

export default Feed;
