import axios from "axios";
import { BaseURL } from "./ApiConfig";

export const loginApi = async (userID, password) => {
    const payload = {
        userID, password
    }
    const response = await axios.post(`${BaseURL}/login`, payload);
    console.log(response);
    const { data } = response;
    localStorage.setItem('token', data.token);
    localStorage.setItem('userDetails', JSON.stringify(data));
};

export const signup = async (payload) => {
    const response = await axios.post(`${BaseURL}/create-account`, payload);
    console.log(response);
    const { data } = response;
    localStorage.setItem('token', data.token);
    localStorage.setItem('userDetails', JSON.stringify(data));
}

