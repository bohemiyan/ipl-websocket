const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token: String,
    role: {
        type: String,
        enum: ['admin', 'client'],
        default: 'client'
    },
    userLevel: {
        type: Number,
        enum: [0, 1],
        default: 0
    },
    teams: [{
        type: String,
    }],
    lastSeen: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
