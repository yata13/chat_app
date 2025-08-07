const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');
const connectDB = require('./database/connectDB');
const authRoutes = require('./router/authRoutes');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // or restrict to Firebase frontend
    methods: ['GET', 'POST'],
  },
});

// 🌐 Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // serve login, signup, etc.

// 🔗 API Routes
app.use('/api/auth', authRoutes);

// 🔌 Socket.IO (modular)
require('./backend/socket/onlineUsers')(io); // call logic in separate file

// 🧠 Connect MongoDB
connectDB();

// 🏠 Fallback route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// 🚀 Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


