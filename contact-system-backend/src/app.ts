import express from "express";
import cors from "cors";
import env from "dotenv";
import bodyParser from "body-parser";
import { WebSocketServer, WebSocket } from "ws";

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

const server = app.listen(port, async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to the MySQL database pool!");
    connection.release();
  } catch (err) {
    console.error("Error connecting to the database pool", err);
    process.exit(1);
  }
  console.log("Server is up on port " + port);
});

const wss = new WebSocketServer({ server });

const clients: Set<WebSocket> = new Set();

wss.on("connection", (ws) => {
  console.log("New WebSocket connection");
  clients.add(ws);

  ws.on("close", () => {
    console.log("WebSocket connection closed");
    clients.delete(ws);
  });
});

const broadcast = (data: any) => {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

export { broadcast };
