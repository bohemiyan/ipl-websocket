const express = require('express');
const User = require('../models/User');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/Authenticator');
const logger = require('../helpers/Logger');
const notificationRouter = express.Router();



// Route to get all notifications of subscribed teams
notificationRouter.get('/getAllNotifications', authMiddleware, async (req, res) => {
    const { userID } = req.user;

    try {
        // Find the user in the database
        const user = await User.findOne({ userID });
        if (!user) {
            logger.error('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        // Get the user's last seen timestamp
        const lastSeen = user.lastSeen;

        // Find all notifications for subscribed teams
        const notifications = await Notification.find({ teamID: { $in: user.teams } });

        // Determine if each notification has been seen by the user
        const notificationsWithIsSeen = notifications.map(notification => {
            // Check if the notification's timestamp is after the user's last seen timestamp
            const isSeen = notification.timestamp <= lastSeen;
            return {
                _id: notification._id, // Include other fields as needed
                teamID: notification.teamID,
                timestamp: notification.timestamp,
                message: notification.message,
                isSeen
            };
        });

        res.json(notificationsWithIsSeen);
    } catch (error) {
        logger.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



// Route to get unseen notifications for all the unsubscribed teams
notificationRouter.get('/getUnseenNotifications', authMiddleware, async (req, res) => {
    const { userID } = req.user;

    try {
        // Find the user in the database
        const user = await User.findOne({ userID });
        if (!user) {
            logger.error('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        // Get the user's last seen timestamp
        const lastSeen = user.lastSeen;

        // Find all notifications for unsubscribed teams where the user has not seen
        const unseenNotifications = await Notification.find({
            teamID: { $in: user.teams },
            timestamp: { $gt: lastSeen } // Consider notifications arrived after last seen
        });

        res.json(unseenNotifications);
    } catch (error) {
        logger.error('Error fetching unseen notifications:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


notificationRouter.post('/getAllNotificationsByTeam', authMiddleware, async (req, res) => {
    const { userID } = req.user;
    const { teamID } = req.body;

    try {
        // Find the user in the database
        const user = await User.findOne({ userID });
        if (!user) {
            logger.error('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is subscribed to the specified team
        if (!user.teams.includes(teamID)) {
            logger.error('User is not subscribed to the specified team');
            return res.status(404).json({ message: 'User is not subscribed to the specified team' });
        }

        // Find all notifications for the specified team
        const notifications = await Notification.find({ teamID });


        res.json(notifications);
    } catch (error) {
        logger.error('Error fetching notifications by team:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// notificationRouter.post('/setAllNotificationsSeen', authMiddleware, async (req, res) => {
//     const { userID } = req.user;

//     try {
//         // Find the user in the database to get subscribed teams
//         const user = await User.findOne({ userID });
//         if (!user) {
//             logger.error('User not found');
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Get all notifications for subscribed teams
//         const notifications = await Notification.find({ teamID: { $in: user.teams } });

//         // Update each notification to add the user ID to seenByUsers array
//         await Promise.all(notifications.map(async notification => {
//             notification.seenByUsers.push(userID);
//             await notification.save();
//         }));

//         res.json({ message: 'User added to seenByUsers array in all subscribed team notifications successfully' });
//     } catch (error) {
//         logger.error('Error adding user to seenByUsers array in subscribed team notifications:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });




module.exports = notificationRouter;
