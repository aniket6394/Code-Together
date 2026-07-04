const { v4: uuid } = require("uuid");

const rooms = new Map();

const createRoom = (req, res) => {
  const roomId = uuid();

  rooms.set(roomId, {
    host: null,
    users: [],
    code: "// Start Coding...\n",
    language: "javascript",
    theme: "dark",
  });

  return res.status(201).json({
    success: true,
    roomId,
  });
};

module.exports = {
  createRoom,
  rooms,
};
