const express = require("express");
const messageRoutes = require("./message.routes");
const { listChannels } = require("../controllers/channel.controller");

const router = express.Router({ mergeParams: true });

router.get("/", listChannels);

router.use("/:channelId/messages", messageRoutes);

module.exports = router;