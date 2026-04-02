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

//  ADD REACTION
exports.addReaction = async (req, res) => {
  const { messageId, emoji } = req.params;
  const userId = req.auth.userId;

  try {
    await messageService.addReaction({ messageId, userId, emoji });

    res.json({
      success: true,
      message: "Reaction added"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

// REMOVE REACTION
exports.removeReaction = async (req, res) => {
  const { messageId, emoji } = req.params;
  const userId = req.auth.userId;

  try {
    await messageService.removeReaction({ messageId, userId, emoji });

    res.json({
      success: true,
      message: "Reaction removed"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

// PIN MESSAGE
exports.pinMessage = async (req, res) => {
  const { channelId, messageId } = req.params;
  const pinnedBy = req.auth.userId;

  try {
    const result = await messageService.pinMessage({ messageId, channelId, pinnedBy });

    if (result.rowCount === 0) {
      return res.status(409).json({ error: "Message is already pinned" });
    }

    res.status(201).json({
      success: true,
      message: "Message pinned",
      pinned: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

// UNPIN MESSAGE
exports.unpinMessage = async (req, res) => {
  const { channelId, messageId } = req.params;

  try {
    const result = await messageService.unpinMessage({ messageId, channelId });

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Pinned message not found" });
    }

    res.json({
      success: true,
      message: "Message unpinned"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

// GET PINNED MESSAGES
exports.getPinnedMessages = async (req, res) => {
  const { channelId } = req.params;

  try {
    const result = await messageService.getPinnedMessages({ channelId });

    res.json({
      pinnedMessages: result.rows,
      count: result.rows.length
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};