import Board from "./Board";
import Player from "./Player";
import Settings from "./Settings";
import { Server, Socket } from "socket.io";
import Cell from "./Cell";

interface playersPositions {
  position: {
    x: number;
    y: number;
  };
  direction: number;
}

export default class Game {
  socketServer: Server;
  gameSettings: Settings;
  gameBoard: Board;
  players: Player[];
  isJoinable: boolean;
  gameID: string;
  constructor(socketServer: Server, settings: Settings) {
    this.socketServer = socketServer;
    this.gameSettings = settings;
    this.gameBoard = new Board(this.boardSize);
    this.players = [];
    this.isJoinable = true;
    this.gameID = Math.random().toString(36).substring(7);
    setInterval(() => {
      this.movePlayers();
    }, 1000);
  }

  get boardSize(): number {
    return this.gameSettings.boardSize;
  }

  get boardCells(): Cell[][] {
    return this.gameBoard.boardCells;
  }

  join(playerSocket: Socket): void {
    if (!this.isJoinable)
      return this.log(`Player tried to join the game: ${playerSocket.id}`);
    this.log(`New player joined the game: ${playerSocket.id}`);

    // on fait rejoindre la room socket io
    playerSocket.join(this.gameID);

    // Création du joueur
    const player = new Player(playerSocket);
    this.players.push(player);

    // On met le detecteur d'évènement sur le joueur
    this.handlePlayersEvent(playerSocket);

    // On fait spawn le joueur
    this.spawnPlayer(player);
  }

  spawnPlayer(player: Player): void {
    player.isAlive = true;
    player.position = {
      x: Math.max(Math.floor(Math.random() * this.boardSize) - 10, 10),
      y: Math.max(Math.floor(Math.random() * this.boardSize) - 10, 10),
    };
    this.sendPlayersPositions();
  }

  get playersPositions(): playersPositions[] {
    return this.alivePlayers.map((player) => ({
      position: player.position,
      direction: player.direction,
    }));
  }

  get alivePlayers(): Player[] {
    return this.players.filter((player) => player.isAlive);
  }

  log(...text: string[]): void {
    console.log(`[Game:${this.gameID}] ${text.join(" ")}`);
  }

  private handlePlayersEvent(player: Socket): void {
    // Quand le joueur se déconnecte
    player.on("disconnect", () => {
      this.log(`Player disconnected: ${player.id}`);
      this.players = this.players.filter((p) => p.socketID !== player.id);
    });

    // Quand le joueur change de direction
    player.on("directionChange", (direction: number) => {
      const playerObject = this.players.find((p) => p.socketID === player.id);
      if (!playerObject) return;
      playerObject.ChangeDirection(direction);
      this.sendPlayersPositions();
    });
  }

  private sendPlayersPositions(): void {
    this.alivePlayers.forEach((player) => {
      player.socket.emit("playersPositions", this.playersPositions);
    });
  }

  private movePlayers(): void {
    this.alivePlayers.forEach((player) => {
      player.Move();

      // Check if player is out of bounds
      const { x, y } = player.position;
      if (x < 0 || x > this.boardSize || y < 0 || y > this.boardSize) {
        player.isAlive = false;
        player.socket.emit("gameOver");
        this.sendPlayersPositions();
        this.spawnPlayer(player);
      }
    });
    console.log(this.playersPositions);
  }
}
