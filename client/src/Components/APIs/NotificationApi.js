import axios from "axios";
import { BaseAxiosConfig, BaseURL } from "./ApiConfig";

export const getAllNotifications = async () => {
    const config = await BaseAxiosConfig();
    const response = await axios.get(`${BaseURL}/getAllNotifications`, config);
    return response;
};

export const getUnseenNotifications = async () => {
    const config = await BaseAxiosConfig();
    const response = await axios.get(`${BaseURL}/getUnseenNotifications`, config);
    return response;
};

export const getAllNotificationsByTeam = async (teamID) => {
    const config = await BaseAxiosConfig();
    const response = await axios.post(`${BaseURL}/getAllNotificationsByTeam`,{teamID}, config);
    return response;
};

export const getAllTeams = async () => {
    const config = await BaseAxiosConfig();
    const response = await axios.get(`${BaseURL}/allTeams`, config);
    return response;
};

export const updateLastseen = async () => {
    const config = await BaseAxiosConfig();
    const response = await axios.post(`${BaseURL}/updatelastseen`, {}, config);
    return response;
}