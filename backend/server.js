// server.js (CommonJS)
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');
const connectDB = require('./database/connectDB');
const authRoutes = require('./router/authRoutes');

const app = express();
const server = http.createServer(app);

/* ---- CORS: allow your Firebase site + local dev ---- */
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5500',
  'https://chat-app-d4b18.web.app',   // <-- your Firebase Hosting URL
];

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true); // allow curl/postman
      cb(null, ALLOWED_ORIGINS.includes(origin));
    },
    credentials: true,
  })
);

app.use(express.json());

/* ---- Socket.IO with same CORS ---- */
const io = new Server(server, {
  cors: { origin: ALLOWED_ORIGINS, credentials: true },
  transports: ['websocket', 'polling'], // helps with Render cold starts
});

/* ---- Routes ---- */
app.use('/api/auth', authRoutes);

/* ---- Optional: serve static only if you need it for local testing ---- */
app.use(express.static(path.join(__dirname, 'public')));

/* ---- Simple health check for Render ---- */
app.get('/healthz', (_req, res) => res.status(200).send('ok'));

/* ---- Socket handlers ---- */
require('./backend/socket/onlineUsers')(io);

/* ---- Start only after DB connects ---- */
const PORT = process.env.PORT || 3000;
(async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
