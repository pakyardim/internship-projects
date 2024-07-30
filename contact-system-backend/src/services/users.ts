import { pool } from "../utils/db";
import { UserType } from "../types";

export const createUser = async ({ username, password, base64Photo }) => {
  try {
    await pool.execute(
      `INSERT INTO users (username, password, base64Photo, role_id) VALUES (?, ?, ?, 2)`,
      [username, password, base64Photo]
    );
  } catch (err) {
    throw err;
  }
};

export const fetchAll = async () => {
  try {
    const [users] = await pool.execute(
      `SELECT u.*, r.role 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id`
    );
    return users as UserType[];
  } catch (err) {
    throw err;
  }
};

export const findByUsername = async (username: string) => {
  try {
    const [users] = await pool.execute(
      `SELECT u.*, r.role 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id 
      WHERE username = ?`,
      [username]
    );
    return users[0] as UserType;
  } catch (err) {
    throw err;
  }
};

export const updateUser = async (id: number, { password, base64Photo }) => {
  try {
    await pool.execute(
      `UPDATE users SET password = ?, base64Photo = ? WHERE id = ?`,
      [password, base64Photo, id]
    );
  } catch (err) {
    throw err;
  }
};

export const findById = async (id: number) => {
  try {
    const [users] = await pool.execute(
      `SELECT u.*, r.role 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id 
      WHERE u.id = ?`,
      [id]
    );
    return users[0] as UserType;
  } catch (err) {
    throw err;
  }
};
