import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Rightbar from "../../components/rightbar/Rightbar";
import Post from "../../components/post/Post";
import "./singlePost.css";

export default function SinglePost() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get("/posts/" + postId);
        setPost(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPost();
  }, [postId]);

  return (
    <>
      <Topbar />
      <div className="singlePostContainer" style={{ display: "flex", width: "100%" }}>
        <Sidebar />
        <div className="singlePostWrapper" style={{ flex: 5.5, display: "flex", justifyContent: "center", padding: "20px" }}>
          {post ? (
             <div style={{ width: "100%", maxWidth: "600px" }}>
               <Post post={post} />
             </div>
          ) : (
             <div style={{ marginTop: "50px", fontSize: "18px", color: "gray" }}>Loading post...</div>
          )}
        </div>
        <Rightbar />
      </div>
    </>
  );
}
