import { useRef, useState } from 'react';
import './register.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Register = () => {
    const username = useRef();
    const email = useRef();
    const password = useRef();
    const passwordAgain = useRef();
    const history = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordAgain, setShowPasswordAgain] = useState(false);


    const handleClick = async (e) => {
        e.preventDefault();
        passwordAgain.current.setCustomValidity("");

        if(passwordAgain.current.value !== password.current.value) {
            passwordAgain.current.setCustomValidity("Password don't match!")
            passwordAgain.current.reportValidity();
            return;
        } else {
            const user = {
                username: username.current.value,
                email: email.current.value,
                password: password.current.value,
            }

            try{
                await axios.post("/auth/register", user);
                history("/login");
            } catch(err) {
                console.log(err);
                
            }
        }
    }
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
                            <input type="text" placeholder='Username' className="loginInput" ref={username} required />
                            <input type="email" placeholder='Email' className="loginInput" ref={email} required />
                            <div className="passwordInputWrapper">
                                <input type={showPassword ? "text" : "password"} placeholder='Password' className="loginInput" minLength="6" ref={password} required />
                                <button
                                    type="button"
                                    className="passwordToggle"
                                    onClick={() => setShowPassword((visible) => !visible)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </button>
                            </div>
                            <div className="passwordInputWrapper">
                                <input
                                    type={showPasswordAgain ? "text" : "password"}
                                    placeholder='Password Again'
                                    className="loginInput"
                                    ref={passwordAgain}
                                    onChange={() => passwordAgain.current.setCustomValidity("")}
                                    required
                                />
                                <button
                                    type="button"
                                    className="passwordToggle"
                                    onClick={() => setShowPasswordAgain((visible) => !visible)}
                                    aria-label={showPasswordAgain ? "Hide confirmation password" : "Show confirmation password"}
                                >
                                    {showPasswordAgain ? <VisibilityOff /> : <Visibility />}
                                </button>
                            </div>
                            <button className="loginButton" type='submit'>Sign Up</button>
                            <button className="loginRegisterButton">Log into Account</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register;
