const messageService = require("../services/message.service");

exports.sendMessage = async (req, res) => {
  const { serverId, channelId } = req.params;
  const userId = req.auth.userId;
  const { content } = req.body;

  if (!content || !String(content).trim()) {
    return res.status(400).json({
      error: "Validation error",
      details: ["content is required"]
    });
  }

  try {
    const createdMessage = await messageService.sendMessage({
      serverId,
      channelId,
      authorId: userId,
      content: String(content).trim(),
    });

    return res.status(201).json({
      message: createdMessage.rows[0],
    });
  } catch (err) {
    console.error(err);

    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }

    return res.status(500).json({ error: "Database error" });
  }
};

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