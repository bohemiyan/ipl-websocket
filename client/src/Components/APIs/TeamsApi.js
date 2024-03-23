import axios from "axios";
import { BaseAxiosConfig, BaseURL } from "./ApiConfig";



export const getAllTeams = async () => {
    const config =await BaseAxiosConfig();
    console.log(config);
    const response = await axios.get(`${BaseURL}/allTeams`, config);
    return response;
};

export const addNewTeam = async (data) => {
    const config =await BaseAxiosConfig();
    const response = await axios.post(`${BaseURL}/addNewTeam`, data, config);
    return response;
};


export const UpdateTeamById = async (data) => {
    const config =await BaseAxiosConfig();
    const response = await axios.put(`${BaseURL}/updateTeam`, data, config);
    return response;
};

export const getTeamById = async (teamID) => {
    const config =await BaseAxiosConfig();
    const response = await axios.get(`${BaseURL}/getTeam`, teamID, config);
    return response;
};

export const SubscribeTeam = async (teamID, action) => {
    const config = await BaseAxiosConfig();
    const response = await axios.post(`${BaseURL}/subscribe`,
        { teamID, action },
        config);
    return response;
};

export const getSubscribedTeam = async () => {
    const config =await BaseAxiosConfig();
    const response = await axios.get(`${BaseURL}/getSubscribed`, config);
    return response;

};