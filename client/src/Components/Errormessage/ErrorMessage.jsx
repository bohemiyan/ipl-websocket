import React from "react";
import "./errormessage.css";
import { toast } from "react-toastify";

const ErrorMessage = ({ message }) => {
  toast(message)
  return 
  <div className="error-message">
    
    {message}
    
    </div>;
};

export default ErrorMessage;
