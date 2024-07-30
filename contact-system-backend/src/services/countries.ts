import { pool } from "../utils/db";

export const fetchAllCountries = async () => {
  try {
    const [countries] = await pool.execute("SELECT * FROM countries");
    return countries;
  } catch (err) {
    throw err;
  }
};
