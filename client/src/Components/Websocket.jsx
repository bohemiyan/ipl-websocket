import React, { useEffect, useState } from "react";
import { useContext } from "react";
import AppContext from "./Contex";
import { webSocketUrl } from "./APIs/ApiConfig";

const Websocket = () => {
  const { setwebSocketAlert } = useContext(AppContext);
  const userID = localStorage.getItem("userId");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Handle the case where the token is not available (e.g., redirect to login)
      return;
    }

    const ws = new WebSocket(`${webSocketUrl}?token=${token}`);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      setwebSocketAlert(JSON.parse(event.data));
    };
    



    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    // return () => {
    //   ws.close();
    // };
  }, [userID]);

  //   return <div>{/* Your component JSX */}</div>;
};

export default Websocket;
