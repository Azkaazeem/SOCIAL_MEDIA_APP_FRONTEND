import './login.css'

const Login = () => {
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
                    <div className="loginBox">
                        <input type="text" placeholder='Email' className="loginInput" />
                        <input type="password" placeholder='Password' className="loginInput" />
                        <button className="loginButton">Log In</button>
                        <span className="loginForgot">Forgot Password</span>
                        <button className="loginRegisterButton">Create New Account</button>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Login