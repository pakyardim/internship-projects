import mysql from "mysql2/promise";

const config = {
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: +process.env.DB_PORT,
  waitForConnections: true,
  queueLimit: 0,
};

const pool = mysql.createPool(config);

export { pool };
