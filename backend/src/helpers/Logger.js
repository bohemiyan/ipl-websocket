const { createLogger, transports, format } = require('winston');

const logger = createLogger({
  level: 'info', // Default log level
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    // Info log file transport
    new transports.File({ 
      filename: 'info.log', 
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.json()
      )
    }),
    // Error log file transport
    new transports.File({ 
      filename: 'error.log', 
      level: 'error',
      format: format.combine(
        format.timestamp(),
        format.json()
      )
    })
  ]
});

module.exports = logger;
