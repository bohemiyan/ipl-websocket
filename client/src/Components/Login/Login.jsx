import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import images from "./icons/assetprovider";
import { loginApi } from "../APIs/LoginApi";
import "./login.css";
import { toast } from "react-toastify";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();




  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await loginApi(email, password);
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      // console.log(error);
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  };


  return (
    <div className="login-container" >
      {/* {wallpaper && <img src={wallpaper} alt="Wallpaper" />} */}
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-heading">Log In :</h2>
        <div className="form-group">
          <label htmlFor="email">
            Mail ID
            <span className="mandatory-indicator">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            placeholder="Enter Mail Id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">
            Password
            <span className="mandatory-indicator">*</span>
          </label>
          <div className="input-container">
            <input
              type={showPwd ? "text" : "password"}
              className="form-control"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {password.length > 0 && (
              <img
                alt={showPwd ? "Hide password" : "Show password"}
                className="pwd-img"
                src={showPwd ? images.hidepwd : images.showpwd}
                onClick={() => setShowPwd(!showPwd)}
              />
            )}
          </div>
        </div>

        <div className="form-group">
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Loading..." : "Log in"}
          </button>
        </div>
        <p className="mt-3">
          <Link to="/Signup" style={{ color: "red" }}>
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
