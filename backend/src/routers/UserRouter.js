const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const User = require('../models/User');
const logger = require('../helpers/Logger');
const authMiddleware = require('../middleware/Authenticator');

const UserRouter = express.Router();

// Login route
UserRouter.post('/login', async (req, res) => {
    const { userID, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ userID });
        if (!user) {
            logger.error('User not found.');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            logger.error('Invalid password.');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userID: user.userID }, 'your_secret_key', { expiresIn: '1h' }); // Adjust expiration time as needed

        // Send user details and token as response
        res.json({
            userID: user.userID,
            firstName: user.firstName,
            lastName: user.lastName,
            token,
            role: user.role,
            userLevel: user.userLevel
        });
    } catch (error) {
        logger.error('Error during login:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Create account route
UserRouter.post('/create-account', async (req, res) => {
    try {
        const { userID, password, firstName, lastName, role } = req.body;
        // Check if user exists
        const existingUser = await User.findOne({ userID });
        if (existingUser) {
            logger.error('User already exists.');
            return res.status(400).json({ message: 'User already exists' });
        }

        // Determine userLevel based on role
        let userLevel;
        if (role === 'admin') {
            userLevel = 1;
        } else {
            userLevel = 0; // Default to client
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            userID,
            password: hashedPassword,
            firstName,
            lastName,
            role,
            userLevel
        });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ userID: newUser.userID }, 'your_secret_key', { expiresIn: '12h' }); // Adjust expiration time as needed

        // Send user details and token as response
        res.status(201).json({
            userID: newUser.userID,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            role: newUser.role,
            userLevel: newUser.userLevel,
            token
        });
    } catch (error) {
        console.log(error);
        logger.error('Error creating user:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update last seen route
UserRouter.post('/updatelastseen', authMiddleware, async (req, res) => {
    const { userID } = req.user;

    try {
        // Find the user by userID and update the lastSeen field to the current time
        const updatedUser = await User.findOneAndUpdate(
            { userID },
            { lastSeen: new Date() },
            { new: true } // Return the updated user document
        );

        if (!updatedUser) {
            logger.error('User not found.');
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Last seen timestamp updated successfully' });
    } catch (error) {
      
        logger.error('Error updating last seen timestamp:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = UserRouter;
