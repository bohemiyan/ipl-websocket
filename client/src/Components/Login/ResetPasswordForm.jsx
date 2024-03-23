import React, { useState } from "react";
import "./login.css";
import ErrorMessage from "../Errormessage/ErrorMessage";
import { useNavigate } from "react-router-dom";
import { ForgotPasswordService } from "../../API/LoginApi";

const ResetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await ForgotPasswordService(email);
      setIsLoading(false);
      navigate("/login");
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setError(error.message);
    }
  };

  const handleCancel = () => {
    navigate("/login");
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleEmailSubmit}>
        <h2 className="login-heading">Password Reset</h2>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {error && <ErrorMessage message={error} />}
        <div className="form-group">
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Loading..." : "Send OTP"}
          </button>
          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
            style={{ background: "red", marginTop: "10px" }}
            onClick={handleCancel}
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
