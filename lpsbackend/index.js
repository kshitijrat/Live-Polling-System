// Basic Express server with Socket.IO and MongoDB
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Load environment variables from .env file
require('dotenv').config();

// initialize express app
const app = express();

// create http server
const server = http.createServer(app);

// upgrade the server to websocket
const FRONTEND_URL = process.env.FRONTEND_URL || '*';
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Import MongoDB connection utility
const connectToDB = require('./utils/database');

// Import poll history routes
const historyRoutes = require('./routes/history');

// Import Socket.IO polling logic
const pollSocket = require('./socket/pollSocket');

// Connect to MongoDB
(async () => {
  await connectToDB();
})();

// Use poll history routes
app.use('/history', historyRoutes);

// Set up Socket.IO polling logic
pollSocket(io);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server Started at PORT: ${PORT}`);
});
