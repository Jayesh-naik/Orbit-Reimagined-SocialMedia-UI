const { Server } = require('socket.io');

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // Client joins a room per project so events only go to relevant users
    socket.on('joinProject', (projectId) => {
      socket.join(`project:${projectId}`);
    });

    socket.on('leaveProject', (projectId) => {
      socket.leave(`project:${projectId}`);
    });

    // Client joins user-specific room for targeted notifications
    socket.on('joinUser', (userId) => {
      socket.join(`user:${userId}`);
      console.log(`Socket ${socket.id} joined room user:${userId}`);
    });

    socket.on('leaveUser', (userId) => {
      socket.leave(`user:${userId}`);
    });

    // Typing indicator for project chat / comments
    socket.on('typing', ({ projectId, user }) => {
      socket.to(`project:${projectId}`).emit('userTyping', { user });
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized. Call initSocket(server) first.');
  return io;
};

module.exports = { initSocket, getIO };
