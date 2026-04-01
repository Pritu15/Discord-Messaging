const messageService = require("../services/message.service");

exports.listMessages = async (req, res) => {
  const { serverId, channelId } = req.params;
  const { limit = 50, before, after } = req.query;

  try {
    const result = await messageService.listMessages({
      serverId,
      channelId,
      before,
      after,
      limit,
    });

    res.json({
      messages: result.rows,
      count: result.rows.length
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

exports.updateMessage = async (req, res) => {
  const { channelId, messageId } = req.params;
  const hasContent = Object.prototype.hasOwnProperty.call(req.body, "content");
  const { content, deleteAttachmentIds } = req.body;

  const hasDeleteAttachmentIds = Array.isArray(deleteAttachmentIds);

  if (!hasContent && !hasDeleteAttachmentIds) {
    return res.status(400).json({ error: "Nothing to update" });
  }

  if (hasContent && typeof content !== "string") {
    return res.status(400).json({ error: "content must be a string" });
  }

  if (deleteAttachmentIds && !Array.isArray(deleteAttachmentIds)) {
    return res.status(400).json({ error: "deleteAttachmentIds must be an array" });
  }

  if (hasContent && hasDeleteAttachmentIds) {
    return res.status(400).json({ error: "Update content or delete attachments, not both" });
  }

  if (hasDeleteAttachmentIds && deleteAttachmentIds.length === 0) {
    return res.status(400).json({ error: "deleteAttachmentIds cannot be empty" });
  }

  try {
    const result = await messageService.updateMessage({
      channelId,
      messageId,
      content,
      deleteAttachmentIds,
      hasContent,
    });

    if (!result) {
      return res.status(404).json({ error: "Message not found" });
    }

    return res.json({
      message: result.message,
      deletedAttachmentIds: result.deletedAttachmentIds,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error" });
  }
};