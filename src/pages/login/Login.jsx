import './login.css'
import { useContext, useRef } from 'react';
import { loginCall } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';
import { CircularProgress } from "@mui/material"

const Login = () => {
    const email = useRef();
    const password = useRef();
    const { user, isFetching, error, dispatch } = useContext(AuthContext);

    const handleClick = (e) => {
        e.preventDefault();
        loginCall({ email: email.current.value, password: password.current.value }, dispatch)
    }

    console.log(user);
    
  return (
    <>
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">ZakoraSocial</h3>
                    <span className="loginDesc">
                        Connect with friends and the world around you on ZakoraSocial
                    </span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleClick}>
                        <input type="text" placeholder='Email' className="loginInput" ref={email} required />
                        <input type="password" placeholder='Password' className="loginInput" ref={password} required minLength={6}/>
                        <button className="loginButton" disabled={isFetching}>{ isFetching ? <CircularProgress color='white' size="25px"/> : "Log In"}</button>
                        <span className="loginForgot">Forgot Password</span>
                        <button className="loginRegisterButton">{ isFetching ? <CircularProgress color='white' size="25px"/> : "Create New Account"}</button>
                    </form>
                </div>
            </div>
        </div>
    </>
  )
}

export default Login
