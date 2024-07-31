import express from "express";
import cors from "cors";
import env from "dotenv";
import bodyParser from "body-parser";

env.config();

import routes from "./routes";
import { pool } from "./utils/db";

const app = express();

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 5166;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", routes);

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to the MySQL database pool!");
    connection.release();
  } catch (err) {
    console.error("Error connecting to the database pool", err);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log("Server is up on port " + port);
  });
})();
