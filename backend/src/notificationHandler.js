const { WebSocketServer } = require('ws');
const { WebSocketauth } = require('./middleware/webSocketAuth');
const logger = require('./helpers/Logger');
const User = require('./models/User');


const clients = new Map();

const WS_Router = (appserver) => {

    const wss = new WebSocketServer({ server: appserver });

    wss.on("connection", async (ws, req) => {
        try {
            const authData = await WebSocketauth(req);
            const { userID } = authData;

            clients.set(userID, ws);

            logger.info(`WebSocket Client connected with user ID: ${userID}`);
            ws.on("message", (message) => {
                logger.info(message);
            });

            ws.on("close", () => {
                clients.delete(userID);
                logger.info(`Client disconnected with user ID: ${userID}`);
            });
        } catch (error) {
            logger.info("WebSocket connection terminated:", error.message);
        }
    });

    return {
        wss,
    };
};

const sendAlert = async (data) => {
    try {
        const { teamID } = data;
        const users = await User.find({ teams: teamID });

        for (const user of users) {
            const recipientUserId = user.userID;
            const recipientClientUser = clients.get(recipientUserId);
            if (recipientClientUser && recipientClientUser.readyState) {
                recipientClientUser.send(JSON.stringify(data));
                logger.info(
                    `New alert notification sent through WebSocket to user: ${recipientUserId}`
                );
            }
        }
    } catch (error) {
        logger.error({ method: 'websocket notification sender.', error: error.message })
    }
};

module.exports = { WS_Router, sendAlert };