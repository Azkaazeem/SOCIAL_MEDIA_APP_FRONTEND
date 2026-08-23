import { useContext, useRef, useState } from "react";
import "./share.css";
import { PermMedia, Label, Room, EmojiEmotions } from "@mui/icons-material"
import { AuthContext } from "../../context/AuthContext"
import axios from "axios";

const Share = () => {

    const { user } = useContext(AuthContext)
    const PF = import.meta.env.VITE_PUBLIC_FOLDER;
    const desc = useRef();
    const [file, setFile] = useState(null);

    const submitHandler = (e) => {
        e.preventDefault()
        const newPost = {
            userId: user._id,
            desc: desc.current.value
        };

        if (file) {
            const data = new FormData();
            const filename = Date.now() + file.name;
            data.append("file", file);
            data.append("name", filename);
            
        }



        try {
            axios.post("/posts", newPost)
        } catch (err) {

        }
    }

    // console.log(user);

    return (
        <div className="share">
            <div className="shareWrapper">
                <div className="shareTop">
                    <img className="shareProfileImg" src={user.profilePicture ? PF + user.profilePicture : PF + "person/noAvatar.jpg"} alt="profile" ref={desc} />
                    <input type="text" placeholder={"What's in your mind " + user.username + "?"} className="shareInput" />
                </div>
                <hr className="shareHr" />
                <form className="shareBottom" onSubmit={submitHandler}>
                    <div className="shareOptions">
                        <label htmlFor="file" className="shareOption">
                            <PermMedia htmlColor="tomato" className="shareIcon" />
                            <span className="shareOptionText">Photo or Video</span>
                            <input style={{ display: "none" }} type="file" id="file" accept=".png, .jpeg, .jpg" onChange={(e) => {setFile(e.target.files[0])}} />
                        </label>

                        <div className="shareOption">
                            <Label htmlColor="blue" className="shareIcon" />
                            <span className="shareOptionText">Tag</span>
                        </div>

                        <div className="shareOption">
                            <Room htmlColor="green" className="shareIcon" />
                            <span className="shareOptionText">Location</span>
                        </div>

                        <div className="shareOption">
                            <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
                            <span className="shareOptionText">Feelings</span>
                        </div>
                    </div>
                    <button className="shareButton" type="submit">Share</button>
                </form>
            </div>

        </div>
    )
}

export default Share;