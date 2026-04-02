const messageModel = require("../models/message.model");

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

exports.sendMessage = async ({ serverId, channelId, authorId, content }) => {
  const channelResult = await messageModel.findChannelInServer({ serverId, channelId });
  if (channelResult.rowCount === 0) {
    throw createHttpError(404, "Channel not found in server");
  }

  const authorResult = await messageModel.findUserById(authorId);
  if (authorResult.rowCount === 0) {
    throw createHttpError(404, "Author not found");
  }

  return messageModel.createMessage({
    channelId,
    authorId,
    content,
  });
};

exports.listMessages = async ({ serverId, channelId, before, after, limit }) => {
  return messageModel.listMessages({
    serverId,
    channelId,
    before,
    after,
    limit,
  });
};

exports.updateMessage = async ({ channelId, messageId, content, deleteAttachmentIds, hasContent }) => {
  return messageModel.updateMessage({
    channelId,
    messageId,
    content,
    deleteAttachmentIds,
    hasContent,
  });
};

exports.deleteMessage = async ({ channelId, messageId }) => {
  return messageModel.deleteMessage({
    channelId,
    messageId,
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