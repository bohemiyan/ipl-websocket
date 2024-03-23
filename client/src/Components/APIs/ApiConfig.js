const { protocol, hostname, port } = window.location;

const defaultIP = 'localhost';
const defaultPort = '9696';

const backendIP = hostname === 'localhost' ? defaultIP : hostname;
const backendPort = port || defaultPort;
// const backendPort = defaultPort;

export const PrimeIP = backendIP;

// Construct the BaseURL and webSocketUrl
export const BaseURL = `${protocol}//${backendIP}:${backendPort}/api`;
export const webSocketUrl = `ws://${backendIP}:${backendPort}`;


export const BaseAxiosConfig = async () => {
  const token = localStorage.getItem("token");
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosConfig;
};