let onlineUsers = new Set();

module.exports = function (io) {
  io.on('connection', (socket) => {
    console.log('⚡ User connected:', socket.id);

    // 👤 User joins with username
    socket.on('user joined', (username) => {
      socket.username = username;
      onlineUsers.add(username);

      console.log('👋', username, 'joined');
      io.emit('online users', Array.from(onlineUsers)); // broadcast online list
    });

    // 💬 Chat message
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg); // broadcast message to all
    });

    // ❌ On disconnect
    socket.on('disconnect', () => {
      console.log('❌', socket.username || 'User', 'disconnected');
      if (socket.username) {
        onlineUsers.delete(socket.username);
        io.emit('online users', Array.from(onlineUsers));
      }
    });
  });
};
