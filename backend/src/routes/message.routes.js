const express = require("express");
const {
  sendMessage,
  listMessages,
  addReaction,
  removeReaction,
  pinMessage,
  unpinMessage,
  getPinnedMessages,
} = require("../controllers/message.controller");

const {
  updateMessage,
  deleteMessage,
} = require("../controllers/message.controller");

const router = express.Router({ mergeParams: true });

router.post("/", sendMessage);

router.get("/", listMessages);

// PINNED MESSAGES
router.get("/pinned", getPinnedMessages);

// PIN MESSAGE
router.put("/:messageId/pin", pinMessage);

// UNPIN MESSAGE
router.delete("/:messageId/pin", unpinMessage);

// ADD REACTION
router.put("/:messageId/reactions/:emoji", addReaction);

// REMOVE REACTION
router.delete("/:messageId/reactions/:emoji", removeReaction);
router.put("/:messageId", updateMessage);
router.delete("/:messageId", deleteMessage);

module.exports = router;
