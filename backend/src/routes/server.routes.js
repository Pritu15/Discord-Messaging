const express = require("express");
const channelRoutes = require("./channel.routes");
const { listServers } = require("../controllers/server.controller");

const router = express.Router();

router.get("/", listServers);

router.use("/:serverId/channels", channelRoutes);

module.exports = router;