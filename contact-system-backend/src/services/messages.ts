import { pool } from "../utils/db";
import { MessageType } from "../types";

export const createMessage = async ({
  name,
  message,
  country_id,
  gender_id,
}) => {
  try {
    await pool.query("START TRANSACTION");

    await pool.query(
      `INSERT INTO messages (name, message, country_id, gender_id) VALUES (?, ?, ?, ?)`,
      [name, message, country_id, gender_id]
    );

    const [newMessage] = await pool.query(
      `SELECT m.*, c.country, g.gender 
      FROM messages m
      LEFT JOIN countries c ON m.country_id = c.id
      LEFT JOIN genders g ON m.gender_id = g.id
      WHERE m.id = LAST_INSERT_ID()`
    );

    await pool.query("COMMIT");

    return newMessage[0] as MessageType;
  } catch (err) {
    await pool.query("ROLLBACK");

    throw err;
  }
};

export const updateReadStatus = async (id: number) => {
  try {
    const [rows] = await pool.execute(
      "UPDATE messages SET `read` = 1 WHERE id = ?",
      [id]
    );
    return rows;
  } catch (err) {
    throw err;
  }
};

export const deleteMsg = async (id: number) => {
  try {
    const [rows] = await pool.execute(
      "UPDATE messages SET status = 0 WHERE id = ?;",
      [id]
    );
    return rows;
  } catch (err) {
    throw err;
  }
};

export const fetchUnreadMessages = async () => {
  try {
    const [messages] = await pool.query(
      `SELECT m.*, c.country
      FROM messages m
      LEFT JOIN countries c ON m.country_id = c.id
      WHERE m.read = 0 AND status = 1
      ORDER BY m.creationDate DESC
      `
    );
    return messages as MessageType[];
  } catch (err) {
    throw err;
  }
};

export const fetchAllReports = async () => {
  try {
    const [countries] = await pool.query(
      `SELECT COUNT(c.id) AS count, c.country AS label
       FROM messages m
       LEFT JOIN countries c ON c.id = m.country_id
       WHERE status = 1
       GROUP BY c.country
      `
    );

    const [genders] = await pool.query(`
      SELECT COUNT(g.id) AS count, g.gender AS label
      FROM messages m
      LEFT JOIN genders g ON g.id = m.gender_id
      WHERE status = 1
      GROUP BY g.gender
    `);

    return { countries, genders };
  } catch (err) {
    throw err;
  }
};

export const fetchAllMessages = async ({ skip, limit, sort }) => {
  try {
    await pool.execute("SET @sort = ?;", [sort]);

    const [messageCount] = await pool.query(
      "SELECT COUNT(*) AS count FROM messages WHERE status = 1;"
    );

    const [messages] = await pool.query(
      `SELECT m.*, c.country, g.gender
      FROM messages m
      LEFT JOIN countries c ON m.country_id = c.id
      LEFT JOIN genders g ON m.gender_id = g.id
      WHERE m.status = 1
      
      ORDER BY 
        CASE WHEN @sort = 'nameA' THEN m.name
          END ASC,
        CASE WHEN @sort = 'nameD' THEN m.name
          END DESC,
        CASE WHEN @sort = 'genderA' THEN g.gender
          END ASC,
        CASE WHEN @sort = 'genderD' THEN g.gender
          END DESC,
        CASE WHEN @sort = 'creationDateA' THEN m.creationDate
          END ASC,
        CASE WHEN @sort = 'creationDateD' THEN m.creationDate
          END DESC,
        CASE WHEN @sort = 'countryA' THEN c.country
          END ASC,
        CASE WHEN @sort = 'countryD' THEN c.country
          END DESC
          
        LIMIT ?, ?;
        `,

      [Number(skip), Number(limit)]
    );
    return { messages, count: messageCount[0].count };
  } catch (err) {
    throw err;
  }
};

export const fetchMessageById = async (id: number) => {
  try {
    const [message] = await pool.query(
      `SELECT m.*, c.country, g.gender
       FROM messages m
       LEFT JOIN countries c ON m.country_id = c.id
       LEFT JOIN genders g ON m.gender_id = g.id
       WHERE m.id = ? AND m.status = 1
       `,
      [id]
    );
    return message[0] as MessageType;
  } catch (err) {
    throw err;
  }
};
