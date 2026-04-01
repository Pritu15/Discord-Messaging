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

exports.updateMessage = async ({ channelId, messageId, content, deleteAttachmentIds, hasContent }) => {
  return messageModel.updateMessage({
    channelId,
    messageId,
    content,
    deleteAttachmentIds,
    hasContent,
  });
};
