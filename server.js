const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: "https://chat-app-d4b18.web.app", // Firebase frontend URL
    methods: ["GET", "POST"]
  }
});

// Allow HTTP routes (like `/`) from frontend
app.use(cors({
  origin: "https://chat-app-d4b18.web.app"
}));

app.get('/', (req, res) => {
  res.send("Socket server running 🎉");
});

io.on('connection', (socket) => {
  console.log("🔌 User connected");

  socket.on('chat message', (data) => {
    io.emit('chat message', data); // Send full data object to all clients
  });

  socket.on('typing', (name) => {
    socket.broadcast.emit('typing', name); // Notify others
  });

  socket.on('disconnect', () => {
    console.log("❌ User disconnected");
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
