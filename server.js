const cors = require('cors');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*", // Allow any frontend
    methods: ["GET", "POST"]
  }
});

// Allow HTTP CORS
app.use(cors());

// Just a test route
app.get('/', (req, res) => {
  res.send("Socket server running 🎉");
});

// Socket events
io.on('connection', (socket) => {
  console.log("✅ New user connected");

  socket.on('user joined', (name) => {
    console.log(`${name} joined`);
    socket.broadcast.emit('chat message', `${name} joined`);
    socket.data.name = name;
  });

  socket.on('typing', () => {
    socket.broadcast.emit('typing', socket.data.name || 'Someone');
  });

  socket.on('chat message', (msg) => {
    const sender = socket.data.name || 'Anonymous';
    io.emit('chat message', `${sender}: ${msg}`);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
