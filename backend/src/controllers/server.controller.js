const serverService = require("../services/server.service");

exports.listServers = async (_req, res) => {
  try {
    const result = await serverService.listServers();

    return res.json({
      servers: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Database error" });
  }
};
