const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "https://chat-app-d4b18.web.app",
    methods: ["GET", "POST"]
  }
});


// CORS for HTTP routes
app.use(cors({
  origin: "https://chat-app-d4b18.web.app"
}));

app.get('/', (req, res) => {
  res.send("Socket server running 🎉");
});

io.on('connection', (socket) => {
  console.log("🔌 User connected");

  // Handle when someone joins
  socket.on('user joined', (name) => {
    console.log(`${name} joined`);
    socket.broadcast.emit('chat message', `${name} joined`);
    
    // Save name in socket
    socket.data.name = name;
  });

  // Handle typing event
  socket.on('typing', () => {
    socket.broadcast.emit('typing', socket.data.name || 'Someone');
  });

  // Handle chat messages
  socket.on('chat message', (msg) => {
    const sender = socket.data.name || 'Anonymous';
    io.emit('chat message', `${sender}: ${msg}`);
  });
});


const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


