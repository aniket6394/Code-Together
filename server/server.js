const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const socketHandler = require("./sockets/socketHandler");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

socketHandler(io);

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
