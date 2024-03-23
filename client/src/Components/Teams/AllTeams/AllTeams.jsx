import React, { useContext, useEffect, useState } from 'react'
import { getSubscribedTeam } from '../../APIs/TeamsApi';
import { toast } from "react-toastify";
import TeamCard from '../TeamCards/TeamsCard';
import AppContext from '../../Contex';
import { getAllTeams } from '../../APIs/NotificationApi';
import { allTeams } from './allTeamsDemo';


const MyTeam = () => {
  const { webSocketAlert, userLevel } = useContext(AppContext);
  const [Teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        setIsLoading(true);
        const response = await getAllTeams();
        
        // Merge API response data with demo data
        const updatedTeams = allTeams.map(demoTeam => {
            const matchingTeam = response.data.find(apiTeam => apiTeam.teamID === demoTeam.teamID);
            return matchingTeam ? matchingTeam : demoTeam;
        });

        setTeams(updatedTeams);
        setIsLoading(false);
    } catch (error) {
        setIsLoading(false);
        toast.error(error.response.data.message);
    }
};



  return (
    <div >
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="cardContainer">
          {Teams.map((team) => (
            <TeamCard key={team.teamID} data={team} userLevel={userLevel} />
          ))}
        </div>
      )}
    </div>
  )
}

export default MyTeam