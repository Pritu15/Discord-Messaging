const express = require("express");
const { listMessages, updateMessage } = require("../controllers/message.controller");

const router = express.Router({ mergeParams: true });

router.get("/", listMessages);
router.put("/:messageId", updateMessage);

module.exports = router;