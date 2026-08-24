import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AuthContextProvider } from "./context/AuthContext";
import axios from "axios";

// local link || deploy link
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "https://social-media-app-backend-tan.vercel.app/api";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <App/>
    </AuthContextProvider>
  </StrictMode>,
)
