import "./closeFriends.css"

const Closefriends = ({ user }) => {
    const PF = import.meta.env.VITE_PUBLIC_FOLDER;
    const resolvePath = (path) => path ? (path.startsWith("http") ? path : PF + path) : "";
    return (
        <li className="sidebarFriend">
            <img className="sidebarFriendImg" src={user.profilePicture ? resolvePath(user.profilePicture) : PF + "person/noAvatar.jpg"} alt="" />
            <span className="sidebarFriendName">{user.username}</span>
        </li>
    )
}

export default Closefriends