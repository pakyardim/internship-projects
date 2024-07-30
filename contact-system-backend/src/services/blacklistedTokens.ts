import { pool } from "../utils/db";

export const fetchBlacklistedTokens = async () => {
  try {
    const [blacklistedTokens] = await pool.query(
      "SELECT * FROM blacklistedtokens"
    );
    return blacklistedTokens as unknown as string[];
  } catch (err) {
    throw err;
  }
};

export const blacklistToken = async (token: string) => {
  try {
    await pool.query("INSERT INTO blacklistedtokens (token) VALUES (?)", [
      token,
    ]);
  } catch (err) {
    throw err;
  }
};
