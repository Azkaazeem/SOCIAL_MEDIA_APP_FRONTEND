import { useContext, useRef, useState } from "react";
import "./share.css";
import { PermMedia, PlayCircle, Article } from "@mui/icons-material"
import { AuthContext } from "../../context/AuthContext"
import axios from "axios";
import { Cancel } from "@mui/icons-material";

const Share = () => {

    const { user } = useContext(AuthContext)
    const PF = import.meta.env.VITE_PUBLIC_FOLDER;
    const desc = useRef();
    const [files, setFiles] = useState([]);
    const [isArticle, setIsArticle] = useState(false);

    const handleFileChange = (e) => {
        setFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }

    const removeFile = (indexToRemove) => {
        setFiles(files.filter((_, i) => i !== indexToRemove));
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        const newPost = {
            userId: user._id,
            desc: desc.current.value,
            img: [],
            video: []
        };

        if (files.length > 0) {
            await Promise.all(files.map(async (f) => {
                const data = new FormData();
                const filename = Date.now() + "_" + f.name;
                data.append("name", filename);
                data.append("file", f);
                try {
                    const res = await axios.post("/upload", data);
                    const cloudUrl = res.data?.url || filename;
                    
                    if (f.type.startsWith("image/")) {
                        newPost.img.push(cloudUrl);
                    } else if (f.type.startsWith("video/")) {
                        newPost.video.push(cloudUrl);
                    }
                } catch (err) {
                    console.log(err);
                }
            }));
        }

        try {
            await axios.post("/posts", newPost);
            desc.current.value = "";
            setFiles([]);
            setIsArticle(false);
            window.dispatchEvent(new CustomEvent('postCreated'));
        } catch (err) {
            console.log(err);
        }
    }

    const resolvePath = (path) => path ? (path.startsWith("http") ? path : PF + path) : "";

    return (
        <div className="share">
            <div className="shareWrapper">
                <div className="shareTop">
                    <img className="shareProfileImg" src={user.profilePicture ? resolvePath(user.profilePicture) : "https://i.pinimg.com/736x/2c/3b/f6/2c3bf6dcf64197a30ee1efea7d198ddd.jpg"} alt="profile" />
                    {isArticle ? (
                        <textarea 
                            placeholder={"Write your article, " + user.username + "..."} 
                            className="shareInput" 
                            ref={desc} 
                            style={{minHeight: "150px", resize: "vertical", marginTop: "10px", width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "8px"}}
                        />
                    ) : (
                        <input type="text" placeholder={"What's in your mind " + user.username + "?"} className="shareInput" ref={desc} style={{flex: 1}} />
                    )}
                </div>
                <hr className="shareHr" />
                
                {files.length > 0 && (
                    <div className="shareFilesContainer" style={{display: "flex", flexWrap: "wrap", gap: "10px", padding: "0 20px 20px 20px"}}>
                        {files.map((f, i) => (
                            <div key={i} className="shareFilePreview" style={{position: "relative"}}>
                                {f.type.startsWith("image/") ? (
                                    <img className="shareImg" src={URL.createObjectURL(f)} alt="" style={{width: "150px", height: "150px", objectFit: "cover", borderRadius: "10px"}} />
                                ) : (
                                    <video className="shareImg" src={URL.createObjectURL(f)} style={{width: "150px", height: "150px", objectFit: "cover", borderRadius: "10px"}} />
                                )}
                                <Cancel className="shareCancelImg" onClick={() => removeFile(i)} style={{position: "absolute", top: "5px", right: "5px", cursor: "pointer", color: "white", backgroundColor: "rgba(0,0,0,0.5)", borderRadius: "50%"}} />
                            </div>
                        ))}
                    </div>
                )}

                <form className="shareBottom" onSubmit={submitHandler}>
                    <div className="shareOptions">
                        <label htmlFor="photo" className="shareOption">
                            <PermMedia htmlColor="tomato" className="shareIcon" />
                            <span className="shareOptionText">Photo</span>
                            <input style={{ display: "none" }} type="file" id="photo" multiple accept="image/*" onChange={handleFileChange} />
                        </label>

                        <label htmlFor="video" className="shareOption">
                            <PlayCircle htmlColor="blue" className="shareIcon" />
                            <span className="shareOptionText">Video</span>
                            <input style={{ display: "none" }} type="file" id="video" multiple accept="video/*" onChange={handleFileChange} />
                        </label>

                        <div className="shareOption" onClick={() => setIsArticle(!isArticle)}>
                            <Article htmlColor="green" className="shareIcon" />
                            <span className="shareOptionText">Article</span>
                        </div>
                    </div>
                    <button className="shareButton" type="submit">Share</button>
                </form>
            </div>
        </div>
    )
}

export default Share;