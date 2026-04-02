const messageModel = require("../models/message.model");

exports.listMessages = async ({ serverId, channelId, before, after, limit }) => {
  return messageModel.listMessages({
    serverId,
    channelId,
    before,
    after,
    limit,
  });
};

// ADD REACTION
exports.addReaction = async ({ messageId, userId, emoji }) => {
  return messageModel.addReaction({ messageId, userId, emoji });
};

// REMOVE REACTION
exports.removeReaction = async ({ messageId, userId, emoji }) => {
  return messageModel.removeReaction({ messageId, userId, emoji });
};

// PIN MESSAGE
exports.pinMessage = async ({ messageId, channelId, pinnedBy }) => {
  return messageModel.pinMessage({ messageId, channelId, pinnedBy });
};

// UNPIN MESSAGE
exports.unpinMessage = async ({ messageId, channelId }) => {
  return messageModel.unpinMessage({ messageId, channelId });
};

// GET PINNED MESSAGES
exports.getPinnedMessages = async ({ channelId }) => {
  return messageModel.getPinnedMessages({ channelId });
};