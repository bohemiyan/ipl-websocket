const { DateTime } = require('luxon');
const logger = require('./Logger');

const timeUtils = {
  visual: function () {
    try {
      const now = DateTime.now().setZone('Asia/Kolkata');

      const formattedDate = now.toFormat('dd-MM-yyyy'); // Adjusted date format
      const formattedTime = now.toFormat('hh:mm:ss a');
      const visibleTimestamp = `${formattedDate} : ${formattedTime}`;
      return visibleTimestamp;
    } catch (error) {
      logger.error('Error in visual format:', error.message);
      throw error;
    }
  },

  timestamp: function () {
    try {
      const now = DateTime.now().setZone('Asia/Kolkata');
      return now.ts;
    } catch (error) {
      logger.error('Error in timestamp format:', error.message);
      throw error;
    }
  },

  timestampToVisual: function (stamp) {
    try {
      let timestamp = stamp;
      if (typeof timestamp === "string") {
        timestamp = parseInt(timestamp);
      }
      const date = DateTime.fromMillis(timestamp);

      const formattedDate = date.toFormat('dd-MM-yyyy'); // Adjusted date format
      const formattedTime = date.toFormat('hh:mm:ss a');

      const visibleTimestamp = `${formattedDate} : ${formattedTime}`;

      return {
        visibleTimestamp,
        formattedDate,
        formattedTime,
      };
    } catch (error) {
      logger.error('Error in timestampToVisual:', error.message);
      throw error;
    }
  }
};

module.exports = timeUtils;
