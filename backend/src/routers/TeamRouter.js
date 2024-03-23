const express = require('express');
const Team = require('../models/Team');
const User = require('../models/User');
const authMiddleware = require('../middleware/Authenticator');
const logger = require('../helpers/Logger');
const Notification = require('../models/Notification');
const { CryptoBytes } = require('../helpers/randomBytes');
const { sendAlert } = require('../notificationHandler');
const teamRouter = express.Router();



// Route to get all teams
teamRouter.get('/allTeams', authMiddleware, async (req, res) => {
    const { userID } = req.user;

    try {
        // Find all teams
        const teams = await Team.find();

        // Find the user to check subscription status
        const user = await User.findOne({ userID });
        if (!user) {
            logger.error('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        // Add isSubscribed field to each team
        const teamsWithSubscriptionStatus = teams.map(team => {
            return {
                ...team.toObject(),
                isSubscribed: user.teams.includes(team.teamID)
            };
        });

        res.json(teamsWithSubscriptionStatus);
    } catch (error) {
        logger.error('Error fetching teams:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Route to add a new team
teamRouter.post('/addNewTeam', authMiddleware, async (req, res) => {
    const { teamID, teamName, players } = req.body;

    try {
        const team = new Team({
            teamID,
            teamName,
            players
        });
        await team.save();
        res.status(201).json(team);
    } catch (error) {
        logger.error('Error adding team:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to update team details by teamID
teamRouter.put('/updateTeam', authMiddleware, async (req, res) => {
    const { teamID } = req.body;

    try {

        const old = await Team.findOne({ teamID });
        // If the team doesn't exist, return a 404 error
        if (!old) {
            Team.create(req.body)
        }

        // Update the team data and get the old data in a single query
        const [oldTeamData, updatedTeam] = await Promise.all([
            Team.findOne({ teamID }),
            Team.findOneAndUpdate({ teamID }, { $set: req.body }, { new: true })
        ]);



        // Generate update message
        const updateMessage = generateUpdateMessage(oldTeamData, updatedTeam);

        // Check if any updates were made
        if (updateMessage) {
            // Create a new notification with the update message
            const newNotification = new Notification({
                notificationID: CryptoBytes(),
                teamName: oldTeamData.teamName,
                teamID: updatedTeam.teamID,
                message: updateMessage,
            });
            await newNotification.save();


            sendAlert(
                {
                    teamID: updatedTeam.teamID,
                    message: updateMessage,
                });
        }


        res.json(updatedTeam);
    } catch (error) {
        console.log(error);
        logger.error('Error updating team:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Function to generate update message
function generateUpdateMessage(oldTeam, updatedTeam) {
    const changes = [];

    // Compare fields and add to changes array if updated
    if (oldTeam.teamName !== updatedTeam.teamName) {
        changes.push(`Team name updated from ${oldTeam.teamName} to ${updatedTeam.teamName}`);
    }
    if (oldTeam.runs !== updatedTeam.runs) {
        changes.push(`Runs updated from ${oldTeam.runs} to ${updatedTeam.runs}`);
    }
    if (oldTeam.overs !== updatedTeam.overs) {
        changes.push(`Overs updated from ${oldTeam.overs} to ${updatedTeam.overs}`);
    }
    if (oldTeam.wickets !== updatedTeam.wickets) {
        changes.push(`Wickets updated from ${oldTeam.wickets} to ${updatedTeam.wickets}`);
    }
    // Add comparisons for other fields similarly
    // Return the update message by joining the changes array with newline characters
    return changes.join('\n');
}


// Route to get a team by teamID
teamRouter.get('/getTeam', authMiddleware, async (req, res) => {
    const { teamID } = req.body;

    try {
        const team = await Team.findOne({ teamID });
        if (!team) {
            logger.error('Team not found');
            return res.status(404).json({ message: 'Team not found' });
        }
        res.json(team);
    } catch (error) {
        logger.error('Error fetching team:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



// Route to subscribe or unsubscribe teams
teamRouter.post('/subscribe', authMiddleware, async (req, res) => {
    const { userID } = req.user;
    const { teamID, action } = req.body;
    try {
        // Find the user in the database
        const user = await User.findOne({ userID });
        if (!user) {
            logger.error('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        // // Check if the teamID exists
        // const teamExists = await Team.exists({ teamID });
        // if (!teamExists) {
        //     logger.error('Team not found');
        //     return res.status(404).json({ message: 'Team not found' });
        // }

        // Check if the user is already subscribed to the team
        const isSubscribed = user.teams.includes(teamID);

        // Perform subscription or unsubscription based on the action
        if (action === 'in' && !isSubscribed) {
            // Subscribe to the team if not already subscribed
            user.teams.push(teamID);
        } else if (action === 'un' && isSubscribed) {
            // Unsubscribe from the team if already subscribed
            user.teams = user.teams.filter(id => id !== teamID);
        }

        // Save the updated user data
        await user.save();

        res.json({ message: `${action === 'in' ? 'Subscribed to' : 'Unsubscribed from'} team successfully` });
    } catch (error) {
        logger.error('Error subscribing/unsubscribing team:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



// Route to get subscribed teams of a user
teamRouter.get('/getSubscribed', authMiddleware, async (req, res) => {
    const { userID } = req.user; // Extract userID from authenticated user

    try {
        const user = await User.findOne({ userID });
        if (!user) {
            logger.error('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch subscribed teams for the user
        const subscribedTeams = await Team.find({ teamID: { $in: user.teams } });

        // Prepare response with team information and new notification counts
        const response = await Promise.all(subscribedTeams.map(async team => {
            // Get lastSeen timestamp of the user
            const lastSeen = user.lastSeen;

            // Count new notifications for the team
            const newNotificationCount = await Notification.countDocuments({
                teamID: team.teamID,
                timestamp: { $gt: lastSeen },
            });

            // Construct response object with team information and new notification count
            return {
                teamID: team.teamID,
                teamName: team.teamName,
                runs: team.runs,
                overs: team.overs,
                wickets: team.wickets,
                players: team.players,
                target: team.target,
                newNotificationCount: newNotificationCount
            };
        }));

        res.json(response);
    } catch (error) {
        logger.error('Error fetching subscribed teams:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = teamRouter;
