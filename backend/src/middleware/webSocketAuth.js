const jwt = require("jsonwebtoken");
const logger = require("../helpers/Logger");


const WebSocketauth = async (req) => {
  try {
    const usertoken = req.url.replace("/", "").split("?token=")[1];
 
    if (!usertoken) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    const decoded = jwt.verify(usertoken, 'your_secret_key');
     const user = decoded;
     return user;
  } catch (error) {
    logger.error(`WebSocket authentication error: ${error.message}`);
    throw error;
  }
};
module.exports = { WebSocketauth };