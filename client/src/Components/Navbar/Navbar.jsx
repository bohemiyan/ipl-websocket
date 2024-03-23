import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import defaultlogo from "./assets/ipl.png";
import userlogo from "./assets/icons8-user-30.png";
import "./navbar.css";
import AppContext from "../Contex";
import { toast } from "react-toastify";
import { getUnseenNotifications } from "../APIs/NotificationApi";

const Navbar = () => {
  const { webSocketAlert, userLevel, setuserLevel } = useContext(AppContext);
  const [user, setuser] = useState(false);
  const [alarms, setAlarms] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (webSocketAlert) {
          toast.info(`${webSocketAlert.teamID}-${webSocketAlert.message}`)
        }

        const userdata = localStorage.getItem("userDetails");
        setuser(JSON.parse(userdata));
        const userLevel = userdata ? JSON.parse(userdata).userLevel : 0;
        setuserLevel(userLevel)

        const response = await getUnseenNotifications();
        setAlarms(response.data);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
    fetchData();
  }, [webSocketAlert]);

  const handleclick = (e) => {
    navigate("/notifications");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = async () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="navbarContainer">
      <div className="LogoCont">
        <img src={defaultlogo} alt="LOGO" />
      </div>

      <div className="organization">{user && <h2>{user.firstName}</h2>}</div>

      <div className="menus">
        <div
          className={location.pathname === "/AllTeams" ? "active" : ""}
          onClick={() => {
            navigate("/AllTeams");
          }} >
          <i>All Teams</i>
        </div>


        {userLevel < 1 && <div
          className={location.pathname === "/" ? "active" : ""}
          onClick={() => {
            navigate("/");
          }}
        >
          <i>My Teams</i>
        </div>}


        {userLevel < 1 && (
          <div className="notifications">
            <i className="fa-regular fa-bell fa-xl " title="Notification"></i>
            {alarms && alarms.length > 0 ? (
              <span
                className="number-bubble"
                onClick={handleclick}
                title="Notification"
              >
                {alarms.length}
              </span>
            ) : (
              ""
            )}
          </div>
        )}

        <div
          className="userIconContainer"
          onMouseEnter={toggleDropdown}
          onMouseLeave={toggleDropdown}
        >
          <span className="userIcon">
            <img src={userlogo} alt="User" />
          </span>
          {showDropdown &&
            (!user ? (
              <div className="dropdown">
                <button
                  className="button-17"
                  id="LoginButton"
                  onClick={handleLogout}
                >
                  <i
                    className="fa-solid fa-right-from-bracket fa-xl me-2"
                    style={{ color: "blue" }}
                  />
                  <h3>Login</h3>
                </button>
              </div>
            ) : (
              <div className="dropdown">
                <button
                  className="button-17"
                  id="LogoutButton"
                  onClick={handleLogout}
                >
                  <i
                    className="fa-solid fa-right-from-bracket fa-xl me-2"
                    style={{ color: "red", backgroundColor: "#03254c" }}
                  />
                  <h3>Logout</h3>
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
