const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    notificationID: {
        type: String,
        required: true,
    },
    teamID: {
        type: String,
        required: true
    },
    teamName: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    message: {
        type: String,
        required: true
    },

});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
