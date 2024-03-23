const express = require('express');
const { createServer } = require("http");
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const teamRouter = require('./src/routers/TeamRouter');
const notificationRouter = require('./src/routers/NotificationRouter');
const UserRouter = require('./src/routers/UserRouter');
const Team = require('./src/models/Team');
const logger = require('./src/helpers/Logger');
const { WS_Router } = require('./src/notificationHandler');
const path = require('path');

// Load environment variables from .env file
dotenv.config();
const app = express();


const PORT = process.env.PORT;
// MongoDB connection details
const MONGODB_URL = process.env.MONGODB_URL;
const MONGODB_DBNAME = process.env.MONGODB_DBNAME || 'ipl';

// MongoDB connection string
const dbURI = `mongodb://${MONGODB_URL}/${MONGODB_DBNAME}`;

// Start the HTTP server
const httpServer = createServer(app);

// Connect to MongoDB
mongoose.set("strictQuery", true);
mongoose.connect(dbURI)
  .then(() => {
    console.log('Connected to MongoDB');

    // Start listening once connected to MongoDB
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
  });



// Middleware for enabling CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Use routers
app.use('/api', teamRouter);
app.use('/api', notificationRouter);
app.use('/api', UserRouter);


// Get the current script directory
const scriptDir = path.dirname(__filename);
const clientPath = path.join(scriptDir, "clientBuild");

app.use(express.static(clientPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

// Error handling for unhandled requests
app.use((req, res) => res.status(400).json({ error: "Not a valid request" }));

// WebSocket server
const { wss } = WS_Router(httpServer);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
