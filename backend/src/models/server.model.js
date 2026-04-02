const pool = require("../db");

exports.listServers = async () => {
  return pool.query(
    `
      SELECT id, name, owner_id, created_at
      FROM servers
      ORDER BY created_at DESC
    `
  );
};
