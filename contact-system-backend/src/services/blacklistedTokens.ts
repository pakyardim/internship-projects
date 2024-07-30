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
