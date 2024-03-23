import React, { useContext, useEffect, useState } from 'react'
import { getSubscribedTeam } from '../../APIs/TeamsApi';
import { toast } from "react-toastify";
import TeamCard from '../TeamCards/TeamsCard';
import AppContext from '../../Contex';


const MyTeam = () => {
  const { webSocketAlert , userLevel} = useContext(AppContext);
  const [Teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
  
    fetchData();
  }, [webSocketAlert]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await getSubscribedTeam();
      setTeams(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  }


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