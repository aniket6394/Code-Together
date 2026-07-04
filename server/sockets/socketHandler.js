const colors = [
  "#FFB3BA", // Pink
  "#BAFFC9", // Green
  "#BAE1FF", // Blue
  "#FFFFBA", // Yellow
  "#E6CCFF", // Purple
  "#FFD8B1", // Orange
];
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

      const color = colors[room.users.length % colors.length];

      room.users.push({
        socketId: socket.id,
        username,
        color,
      });
      socket.emit("receive-files", room.files);
      socket.emit("receive-language", room.language);
      socket.emit("receive-theme", room.theme);
      console.log(`${username} joined room ${roomId}`);

      io.to(roomId).emit("room-users", room.users);
    });
    socket.on("selection-change", (data) => {
      socket.to(data.roomId).emit("receive-selection", data);
    });
    socket.on("theme-change", ({ roomId, theme }) => {
      const room = rooms.get(roomId);

      if (!room) return;

      room.theme = theme;

      socket.to(roomId).emit("receive-theme", theme);
    });
    socket.on("create-file", ({ roomId, file }) => {
      const room = rooms.get(roomId);

      if (!room) return;

      room.files.push(file);

      io.to(roomId).emit("file-created", room.files);
    });
    socket.on("language-change", ({ roomId, language }) => {
      const room = rooms.get(roomId);

      if (!room) return;

      room.language = language;

      socket.to(roomId).emit("receive-language", language);
    });
    // Code Sync
    socket.on("code-change", ({ roomId, fileId, code }) => {
      const room = rooms.get(roomId);

      if (!room) return;

      const file = room.files.find((f) => f.id === fileId);

      if (!file) return;

      file.content = code;

      socket.to(roomId).emit("receive-code", {
        fileId,
        code,
      });
    });
    socket.on("rename-file", ({ roomId, fileId, newName }) => {
      const room = rooms.get(roomId);

      if (!room) return;

      const file = room.files.find((f) => f.id === fileId);

      if (!file) return;

      file.name = newName;

      io.to(roomId).emit("files-updated", room.files);
    });
    socket.on("send-message", ({ roomId, message }) => {
      io.to(roomId).emit("receive-message", message);
    });
    // Disconnect
    socket.on("cursor-change", (data) => {
      socket.to(data.roomId).emit("receive-cursor", data);
    });
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
