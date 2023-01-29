import express, { Express } from "express";
import cors from "cors";
import * as http from "http";
import * as socketio from "socket.io";
import dotenv from "dotenv";
import Game from "./Game";

const log = (...text: string[]) => console.log(`[Server] ${text.join(" ")}`);

dotenv.config({ path: "config_var.env" });
const port: number | undefined = process.env.PORT
  ? Number(process.env.PORT)
  : undefined;

const app: Express = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.send({ uptime: process.uptime() });
});

const server: http.Server = http.createServer(app);
const io: socketio.Server = new socketio.Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const game = new Game(io, {
  boardSize: 100,
  nbPlayersMax: 0,
  isPrivate: false,
  invitationCode: null,
});

io.on("connection", (socket) => {
  // Join the game
  game.join(socket);
});

server.listen(port, () => {
  log(`⚡️ Server is running at http://localhost:${port}`);
});
