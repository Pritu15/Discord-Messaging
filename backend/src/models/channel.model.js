const pool = require("../db");

exports.listChannels = async ({ serverId }) => {
  return pool.query(
    `
      SELECT id, server_id, name, created_at
      FROM channels
      WHERE server_id = $1
      ORDER BY created_at DESC
    `,
    [serverId]
  );
};
