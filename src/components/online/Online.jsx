import "./online.css"

import React from 'react'

export const Online = ({user}) => {
    const PF = import.meta.env.VITE_PUBLIC_FOLDER;
    const resolvePath = (path) => path ? (path.startsWith("http") ? path : PF + path) : "";

    return (
        <li className="rightbarFriend">
            <div className="rightbarProfileImgContainer">
                <img className="rightbarProfileImg" src={user.profilePicture ? resolvePath(user.profilePicture) : PF+"person/noAvatar.jpg"} alt="" />
                <span className="rightbarOnline"></span>
            </div>
            <span className="rightbarUsername">{user.username}</span>
        </li>
    )
}