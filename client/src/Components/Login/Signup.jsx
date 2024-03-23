import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import images from "./icons/assetprovider";
import "./login.css";
import { signup } from "../APIs/LoginApi";
import { toast } from "react-toastify";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [firstName, setfirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [role, setrole] = useState('client');
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const datas = {
                userID: email,
                firstName,
                lastName,
                role,
                password
            }
            await signup(datas);

            setIsLoading(false);
            navigate("/");
        } catch (error) {
            setIsLoading(false);
            toast.error(error.response.data.message || "An error occurred");
        }
    };


    return (
        <div className="login-container" >
            {/* {wallpaper && <img src={wallpaper} alt="Wallpaper" />} */}
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-heading">Signup :</h2>
                <div className="form-group">
                    <label htmlFor="email">
                        Mail Id
                        <span className="mandatory-indicator">*</span>
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Mail Id"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">
                        First Name
                        <span className="mandatory-indicator">*</span>
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter First Name"
                        value={firstName}
                        onChange={(e) => setfirstName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">
                        Last Name
                        <span className="mandatory-indicator">*</span>
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>

                <div className="row">
              <div className="col-25">
                <label htmlFor="sensor">ACCOUNT TYPE</label>
              </div>
              <div className="col-75">
                <select
                  id="sensors"
                  name="sensor"
                  onChange={(e) => {
                    setrole(e.target.value);
                  }}
                >
                  <option value="client">CLIENT</option>
                  <option value="admin">ADMIN</option>
                </select>
              </div>
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
                        {isLoading ? "Loading..." : "Sign Up"}
                    </button>
                </div>
                <p className="mt-3">
                    <Link to="/Login" style={{ color: "red" }}>
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;
