import { useRef, useState } from 'react';
import '../login/login.css'; // Reusing the identical CSS classes
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
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
    const [errorMessage, setErrorMessage] = useState("");
    const [isFetching, setIsFetching] = useState(false);

    const handleClick = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        passwordAgain.current.setCustomValidity("");

        if(passwordAgain.current.value !== password.current.value) {
            setErrorMessage("Passwords don't match!");
            return;
        } 
        
        setIsFetching(true);
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
            setErrorMessage(err.response?.data?.message || "Registration failed. Please try again.");
            setIsFetching(false);
        }
    }

    const handleInputChange = () => {
        if(errorMessage) setErrorMessage("");
    }

    return (
        <div className="login">
            <div className="loginCard">
                <div className="loginHeader">
                    <h1 className="loginLogo">ZakoraSocial</h1>
                    <p className="loginDesc">Create a new account.</p>
                </div>

                <form className="loginForm" onSubmit={handleClick}>
                    {errorMessage && (
                        <div className="loginErrorBanner" role="alert">
                            <span className="errorIcon">⚠️</span>
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <div className="inputGroup">
                        <label className="inputLabel">Username</label>
                        <input 
                            type="text" 
                            placeholder='Enter a username' 
                            className={`loginInput ${errorMessage ? 'inputError' : ''}`} 
                            ref={username} 
                            onChange={handleInputChange}
                            required 
                        />
                    </div>
                    
                    <div className="inputGroup">
                        <label className="inputLabel">Email</label>
                        <input 
                            type="email" 
                            placeholder='Enter your email' 
                            className={`loginInput ${errorMessage ? 'inputError' : ''}`} 
                            ref={email} 
                            onChange={handleInputChange}
                            required 
                        />
                    </div>

                    <div className="inputGroup">
                        <label className="inputLabel">Password</label>
                        <div className="passwordInputWrapper">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder='Create a password' 
                                className={`loginInput ${errorMessage ? 'inputError' : ''}`} 
                                minLength="6" 
                                ref={password} 
                                onChange={handleInputChange}
                                required 
                            />
                            <button
                                type="button"
                                className="passwordToggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </button>
                        </div>
                    </div>

                    <div className="inputGroup">
                        <label className="inputLabel">Confirm Password</label>
                        <div className="passwordInputWrapper">
                            <input
                                type={showPasswordAgain ? "text" : "password"}
                                placeholder='Confirm your password'
                                className={`loginInput ${errorMessage ? 'inputError' : ''}`}
                                ref={passwordAgain}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="button"
                                className="passwordToggle"
                                onClick={() => setShowPasswordAgain(!showPasswordAgain)}
                                aria-label={showPasswordAgain ? "Hide confirmation password" : "Show confirmation password"}
                            >
                                {showPasswordAgain ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </button>
                        </div>
                    </div>

                    <button className="loginButton" type='submit' disabled={isFetching}>
                        {isFetching ? "Signing up..." : "Sign Up"}
                    </button>
                </form>

                <p className="loginFooter">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    )
}

export default Register;
