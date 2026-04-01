const pool = require("../db");

exports.listMessages = async ({ serverId, channelId, before, after, limit }) => {
  let query = `
    SELECT *
    FROM messages
    WHERE channel_id = $1
  `;

  const values = [channelId];
  let paramIndex = 2;

  if (before) {
    query += ` AND id < $${paramIndex}`;
    values.push(before);
    paramIndex++;
  }

  if (after) {
    query += ` AND id > $${paramIndex}`;
    values.push(after);
    paramIndex++;
  }

  query += `
    ORDER BY created_at DESC
    LIMIT $${paramIndex}
  `;

  values.push(parseInt(limit));

  return pool.query(query, values);
};

exports.updateMessage = async ({ channelId, messageId, content, deleteAttachmentIds = [], hasContent }) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const existing = await client.query(
      `
        SELECT id
        FROM messages
        WHERE id = $1 AND channel_id = $2
        LIMIT 1
      `,
      [messageId, channelId]
    );

    if (existing.rowCount === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    let messageResult;

    if (hasContent) {
      messageResult = await client.query(
        `
          UPDATE messages
          SET content = $3,
              edited_at = now()
          WHERE id = $1 AND channel_id = $2
          RETURNING id, channel_id, author_id, content, created_at, edited_at
        `,
        [messageId, channelId, content]
      );
    } else {
      messageResult = await client.query(
        `
          SELECT id, channel_id, author_id, content, created_at, edited_at
          FROM messages
          WHERE id = $1 AND channel_id = $2
        `,
        [messageId, channelId]
      );
    }

    let deletedAttachmentIds = [];
    if (Array.isArray(deleteAttachmentIds) && deleteAttachmentIds.length > 0) {
      const deleteResult = await client.query(
        `
          DELETE FROM message_attachments
          WHERE message_id = $1 AND id = ANY($2::uuid[])
          RETURNING id
        `,
        [messageId, deleteAttachmentIds]
      );

      deletedAttachmentIds = deleteResult.rows.map((row) => row.id);
    }

    await client.query("COMMIT");

    return {
      message: messageResult.rows[0],
      deletedAttachmentIds,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
