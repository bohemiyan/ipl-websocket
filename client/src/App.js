import React, { useEffect } from 'react'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import './App.css';
import Login from './Components/Login/Login';
import Home from './Components/Home';
import Signup from './Components/Login/Signup';

function App() {
  const navigate = useNavigate();



  return (
    <div className="App">
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <ToastContainer theme="dark" autoClose={2000} />
    </div>
  );
}

export default App;

