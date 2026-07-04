const { rooms } = require("../controllers/roomController");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    // Join Room
    socket.on("join-room", ({ roomId, username }) => {
      const room = rooms.get(roomId);

      if (!room) {
        socket.emit("invalid-room");
        return;
      }

      socket.join(roomId);

      room.users.push({
        socketId: socket.id,
        username,
      });
      socket.emit("receive-code", room.code);
      socket.emit("receive-language", room.language);
      socket.emit("receive-theme", room.theme);
      console.log(`${username} joined room ${roomId}`);

      io.to(roomId).emit("room-users", room.users);
    });
    socket.on("theme-change", ({ roomId, theme }) => {
      const room = rooms.get(roomId);

      if (!room) return;

      room.theme = theme;

      socket.to(roomId).emit("receive-theme", theme);
    });
    socket.on("language-change", ({ roomId, language }) => {
      const room = rooms.get(roomId);

      if (!room) return;

      room.language = language;

      socket.to(roomId).emit("receive-language", language);
    });
    // Code Sync
    socket.on("code-change", ({ roomId, code }) => {
      const room = rooms.get(roomId);

      if (!room) return;

      // Save latest code
      room.code = code;

      // Send to everyone except sender
      socket.to(roomId).emit("receive-code", code);
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);

      for (const [roomId, room] of rooms) {
        const index = room.users.findIndex(
          (user) => user.socketId === socket.id,
        );

        if (index !== -1) {
          room.users.splice(index, 1);

          io.to(roomId).emit("room-users", room.users);

          if (room.users.length === 0) {
            rooms.delete(roomId);
            console.log(`Room ${roomId} deleted`);
          }

          break;
        }
      }
    });
  });
};

module.exports = socketHandler;
