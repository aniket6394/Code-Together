const express = require("express");
const cors = require("cors");

const roomRoutes = require("./routes/roomRoutes");

const app = express();
const runRoute = require("./routes/runRoute");

app.use(cors());
app.use(express.json());
app.use("/", roomRoutes);
app.use("/api/run", runRoute);

module.exports = app;
