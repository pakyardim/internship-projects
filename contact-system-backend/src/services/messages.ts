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
      "UPDATE messages SET read = 1 WHERE id = ?;",
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

export const fetchAllMessages = async ({ skip, limit, sort }) => {
  try {
    await pool.execute("SET @sort = ?;", [sort]);

    const [messages] = await pool.query(
      `SELECT m.*
      FROM messages m
      LEFT JOIN countries c ON m.country_id = c.id
      LEFT JOIN genders g ON m.gender_id = g.id
      
      ORDER BY 
        CASE WHEN @sort = 'name' THEN m.name
          END ASC,
        CASE WHEN @sort = 'gender' THEN g.gender
          END ASC,
        CASE WHEN @sort = 'creationDate' THEN m.creationDate
          END DESC,
        CASE WHEN @sort = 'country' THEN c.country
          END ASC

        LIMIT ?, ?`,

      [skip, limit]
    );
    return messages as MessageType[];
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
       WHERE m.id = ?
       `,
      [id]
    );
    return message[0] as MessageType;
  } catch (err) {
    throw err;
  }
};
