import React, { useEffect } from 'react';
import './home.css';
import { AppProvider } from './Contex';
import Navbar from './Navbar/Navbar';
import Websocket from './Websocket';
import { Route, Routes, useNavigate } from 'react-router-dom';
import MyTeam from './Teams/MyTeams/MyTeam';
import AllTeams from './Teams/AllTeams/AllTeams';
import Notifications from './Notification/Notifications';

const Home = () => {
    const navigate = useNavigate();


  useEffect(() => {
    const isloggedin = localStorage.getItem("token");
    if (!isloggedin) {
      navigate("/login");
    }else{
        const userdata = localStorage.getItem("userDetails");
        const { userLevel } = JSON.parse(userdata);
        if (userLevel == 1) navigate('/AllTeams')
    }
  }, []);

    // useEffect(() => {
    //     const userdata = localStorage.getItem("userDetails");
    //     const { userLevel } = JSON.parse(userdata);
    //     if (userLevel < 1) navigate('/MyTeams')
    // }, [])

    return (
        <AppProvider>
            <Websocket />
            <Navbar />

            <div className="bodycontainer">
                <Routes>
                    <Route path='/' element={<MyTeam />} />
                    <Route path='/AllTeams' element={<AllTeams />} />
                    <Route path='/notifications' element={<Notifications />} />
                    <Route path='/notifications/:teamID' element={<Notifications />} />
                </Routes>
            </div>

        </AppProvider>
    );
};

export default Home;
