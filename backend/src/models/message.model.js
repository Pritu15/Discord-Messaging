const pool = require("../db");

exports.listMessages = async ({ channelId, before, after, limit = 50 }) => {
  let values = [channelId];
  let conditions = [`m.channel_id = $1`];
  let paramIndex = 2;

  if (after) {
    conditions.push(`
      m.created_at > (
        SELECT created_at FROM messages WHERE id = $${paramIndex}
      )
    `);
    values.push(after);
    paramIndex++;
  }

  if (before) {
    conditions.push(`
      m.created_at < (
        SELECT created_at FROM messages WHERE id = $${paramIndex}
      )
    `);
    values.push(before);
    paramIndex++;
  }

  const query = `
SELECT 
  m.id,
  m.content,
  m.created_at,

  COALESCE(
    json_agg(DISTINCT jsonb_build_object(
      'id', a.id,
      'file_url', a.file_url,
      'file_name', a.file_name
    )) FILTER (WHERE a.id IS NOT NULL),
    '[]'
  ) AS attachments,

  COALESCE(
    json_agg(DISTINCT jsonb_build_object(
      'id', r.id,
      'emoji', r.emoji,
      'user_id', r.user_id,
      'username', u.username
    )) FILTER (WHERE r.id IS NOT NULL),
    '[]'
  ) AS reactions

FROM messages m

LEFT JOIN message_attachments a 
  ON m.id = a.message_id

LEFT JOIN message_reactions r 
  ON m.id = r.message_id

LEFT JOIN users u 
  ON r.user_id = u.id

WHERE ${conditions.join(" AND ")}

GROUP BY m.id
ORDER BY m.created_at DESC
LIMIT $${paramIndex};
`;

  values.push(limit);

  console.log("QUERY:", query);
  console.log("VALUES:", values);

  return pool.query(query, values);
};

//  ADD REACTION
exports.addReaction = async ({ messageId, userId, emoji }) => {
  const query = `
    INSERT INTO message_reactions (message_id, user_id, emoji)
    VALUES ($1, $2, $3)
    ON CONFLICT DO NOTHING
  `;

  return pool.query(query, [messageId, userId, emoji]);
};

// REMOVE REACTION
exports.removeReaction = async ({ messageId, userId, emoji }) => {
  const query = `
    DELETE FROM message_reactions
    WHERE message_id = $1 AND user_id = $2 AND emoji = $3
  `;

  return pool.query(query, [messageId, userId, emoji]);
};

// PIN MESSAGE
exports.pinMessage = async ({ messageId, channelId, pinnedBy }) => {
  const query = `
    INSERT INTO pinned_messages (message_id, channel_id, pinned_by)
    VALUES ($1, $2, $3)
    ON CONFLICT (message_id) DO NOTHING
    RETURNING *
  `;

  return pool.query(query, [messageId, channelId, pinnedBy]);
};

// UNPIN MESSAGE
exports.unpinMessage = async ({ messageId, channelId }) => {
  const query = `
    DELETE FROM pinned_messages
    WHERE message_id = $1 AND channel_id = $2
    RETURNING *
  `;

  return pool.query(query, [messageId, channelId]);
};

// GET PINNED MESSAGES
exports.getPinnedMessages = async ({ channelId }) => {
  const query = `
    SELECT
      m.id,
      m.content,
      m.created_at,
      pm.pinned_at,
      pm.pinned_by,
      u.username AS pinned_by_username
    FROM pinned_messages pm
    JOIN messages m ON pm.message_id = m.id
    LEFT JOIN users u ON pm.pinned_by = u.id
    WHERE pm.channel_id = $1
    ORDER BY pm.pinned_at DESC
  `;

  return pool.query(query, [channelId]);
};