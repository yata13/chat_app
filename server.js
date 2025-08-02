const cors = require("cors");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*", // or set to your Firebase site URL for more security
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.static("public")); // optional if you serve static

// Socket stuff
io.on("connection", (socket) => {
  console.log("✅ Client connected");

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("user joined", (name) => {
    io.emit("user joined", name);
  });

  socket.on("typing", (name) => {
    socket.broadcast.emit("typing", name);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
