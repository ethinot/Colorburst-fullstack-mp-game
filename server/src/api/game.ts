import { Router } from "express";
const gameRouteur = Router();

interface Room {
  roomId: number;
  roomName: string;
  nbPlayers: number;
  playersMax: number;
  isPrivate: boolean;
  password?: number;
}

// get the rooms list
gameRouteur.get("/", (req: any, res: any) => {
  res.json([
    {
      roomId: 6001,
      roomName: "Barthelimi",
      nbPlayers: 10,
      playersMax: 20,
      isPrivate: true,
      password: 69,
    },
    {
      roomId: 6002,
      roomName: "alloooo",
      nbPlayers: 1,
      playersMax: 15,
      isPrivate: false,
    },
    {
      roomId: 6003,
      roomName: "La J",
      nbPlayers: 1,
      playersMax: 5,
      isPrivate: false,
      password: null,
    },
    {
      roomId: 6004,
      roomName: "C'est troop le S",
      nbPlayers: 100,
      playersMax: 200,
      isPrivate: false,
      password: null,
    },
    {
      roomId: 6005,
      roomName: "Lagavame",
      nbPlayers: 50,
      playersMax: 50,
      isPrivate: true,
      password: 69200,
    },
  ]);
});

gameRouteur.param("/", (req, res, next) => {
  console.log("okokkok");
  next();
});

// post methode to create a new room
gameRouteur.post("/", (req: any, res: any) => {
  console.log(req.body);
});

gameRouteur
  .route("/:id")
  .get((req: any, res: any) => {
    res.send(`Get room with id ${req.params.id} \n`); // get a single room
  })
  .put((req: any, res: any) => {
    res.send(`Update room with id ${req.params.id} \n`); // update a single room
  })
  .delete((req: any, res: any) => {
    res.send(`Delete room with id ${req.params.id} \n`); // delete a single room
  });

export default gameRouteur;
