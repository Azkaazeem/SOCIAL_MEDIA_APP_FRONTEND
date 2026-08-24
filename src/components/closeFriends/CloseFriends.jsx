import "./closeFriends.css"

const Closefriends = ({ user }) => {
    const PF = import.meta.env.VITE_PUBLIC_FOLDER;
    return (
        <li className="sidebarFriend">
            <img className="sidebarFriendImg" src={user.profilePicture ? PF + user.profilePicture : PF + "person/noAvatar.jpg"} alt="" />
            <span className="sidebarFriendName">{user.username}</span>
        </li>
    )
}

export default Closefriends