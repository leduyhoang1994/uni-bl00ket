import express, { NextFunction, Request, Response } from "express";
import HostRepository from "../host/host.repo";
import JsonResponse from "../utils/response";
import { HttpRoute } from "@Common/constants/http.constant";
import helmet from "helmet";
import cors from "cors";
import { GameMode } from "@Common/constants/host.constant";
import { HostInfo } from "@Common/types/host.type";
import { AuthenticatedRequest } from "../types/http.type";
import { getPayloadFromAuth } from "../utils/token";
import { AuthenticatedUser } from "@Common/types/socket.type";

const app = express();

app.use(helmet());
// Configure CORS
const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions)); // Use the cors middleware
app.use(express.json());

// Middleware function for authentication
async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.headers.authorization?.startsWith("Bearer ")) {
    const token = req.headers.authorization.split(" ")[1];
    const hostId = req.body.hostId;

    if (!token || !hostId) {
      res.status(401).send("Unauthorized");
      return;
    }

    const userData = await getPayloadFromAuth({ token, hostId });
    (req as AuthenticatedRequest).user = userData as AuthenticatedUser;

    next(); // User authenticated, proceed to the next handler
  } else {
    res.status(401).send("Unauthorized");
  }
}

app.get("/", (req, res) => {
  res.send("MIIS");
});

app.post(HttpRoute.CreateHost, async (req, res) => {
  const hostInfo: HostInfo = req.body.hostInfo;
  const hostId = await HostRepository.create(hostInfo);

  res.send(JsonResponse({ hostId }));
});

app.post(HttpRoute.GetHostInfo, authenticateUser, async (req, res) => {
  const hostId = req.body.hostId;
  const hostRepo = new HostRepository(hostId);

  const hostInfo = await hostRepo.getHostInfo(hostId);
  let finalStadings = await hostRepo.getLeaderboard(hostId, 3);

  const players = await hostRepo.getPlayers();  

  finalStadings = finalStadings.map((item) => {
    const player = players.find((p) => p.id === item.playerId);
    return {
      ...item,
      username: player?.username,
      avatar: player?.avatar,
    };
  });

  hostInfo.finalStandings = finalStadings;

  res.send(JsonResponse({ hostInfo }));
});

app.post(
  HttpRoute.GetGameData,
  authenticateUser,
  async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      res.status(401).send("Unauthorized");
      return;
    }
    const hostId = req.user?.hostId;

    const controller = new HostRepository(hostId);
    const gameData = await controller.getGameData(hostId, req.user?.id);

    res.send(JsonResponse({ gameData }));
  }
);

export default app;
