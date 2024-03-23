import React, { createContext, useState } from 'react';

// Create a new context
const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [appState, setAppState] = useState({ });
    const [webSocketAlert, setwebSocketAlert ] = useState();
    const [userLevel, setuserLevel] = useState(0);



    return (
        <AppContext.Provider value={
          { 
           webSocketAlert,
           setwebSocketAlert,
           userLevel,
           setuserLevel
          
          }
          
          }>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
