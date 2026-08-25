import { createContext, useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  
  const [notifications, setNotifications] = useState(() => {
    if (user && user._id) {
      const saved = localStorage.getItem("notifications_" + user._id);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return [];
        }
      }
    }
    return [];
  });

  useEffect(() => {
    if (user && user._id) {
      const saved = localStorage.getItem("notifications_" + user._id);
      if (saved) {
        try {
          setNotifications(JSON.parse(saved));
        } catch (e) {
          setNotifications([]);
        }
      } else {
        setNotifications([]);
      }
    } else {
      setNotifications([]);
    }
  }, [user?._id]);

  useEffect(() => {
    if (user && user._id) {
      localStorage.setItem("notifications_" + user._id, JSON.stringify(notifications));
    }
  }, [notifications, user?._id]);

  useEffect(() => {
    if (user) {
      const SOCKET_URL = import.meta.env.PROD 
        ? "https://social-media-app-backend-l94r39p6n-azka-azeems-projects.vercel.app" 
        : "http://localhost:8800";
        
      const newSocket = io(SOCKET_URL);
      setSocket(newSocket);

      newSocket.on("connect", () => {
        newSocket.emit("newUser", user.username);
      });

      newSocket.on("getNotification", (data) => {
        setNotifications((prev) => [...prev, { ...data, isRead: false, id: Date.now() + Math.random() }]);
      });

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, notifications, setNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};
