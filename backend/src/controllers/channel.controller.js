const channelService = require("../services/channel.service");

exports.listChannels = async (req, res) => {
  const { serverId } = req.params;

  try {
    const result = await channelService.listChannels({ serverId });

    return res.json({
      channels: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Database error" });
  }
};
