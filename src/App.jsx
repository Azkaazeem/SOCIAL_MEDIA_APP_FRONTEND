import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home'
import Profile from './pages/profile/Profile'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {

  const {user} = useContext(AuthContext)
  return (
    <>


      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile/:username" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
