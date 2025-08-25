// backend/socket/onlineUsers.js
module.exports = (io) => {
  const online = new Set();

  io.on('connection', (socket) => {
    console.log('socket connected:', socket.id);

    socket.on('user:online', (userId) => {
      socket.data.userId = userId;
      online.add(userId);
      io.emit('online:list', Array.from(online));
    });

    socket.on('chat:message', (msg) => {
      // msg = { from, to?, text }
      io.emit('chat:message', { ...msg, ts: Date.now() });
    });

    socket.on('disconnect', () => {
      if (socket.data.userId) {
        online.delete(socket.data.userId);
        io.emit('online:list', Array.from(online));
      }
      console.log('socket disconnected:', socket.id);
    });
  });
};
