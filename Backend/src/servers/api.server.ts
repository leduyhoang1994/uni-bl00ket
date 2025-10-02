import express, { NextFunction, Request, Response } from "express";
import HostRepository from "../host/host.repo";
import JsonResponse from "../utils/response";
import { HttpRoute } from "@Common/constants/http.constant";
import helmet from "helmet";
import cors from "cors";
import { GetHostInfoOpts, HostInfo, Player } from "@Common/types/host.type";
import { AuthenticatedRequest } from "../types/http.type";
import { getPayloadFromAuth } from "../utils/token";
import { AuthenticatedUser } from "@Common/types/socket.type";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

const app = express();
export const JWT_SECRET = "secretKey";

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

app.post(
  HttpRoute.GetHostInfo,
  authenticateUser,
  async (req: AuthenticatedRequest, res) => {
    const hostId = req.body.hostId;
    const hostRepo = new HostRepository(hostId);

    const hostInfo = await hostRepo.getHostInfo(hostId);
    const options: GetHostInfoOpts = req.body.options || {};
    const userId = req.user?.id;

    const leaderboardCount = options.fullLeaderboard ? undefined : 3;

    let finalStadings = await hostRepo.getLeaderboard(hostId, leaderboardCount);

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

    if (options.personalResult && userId) {
      const personalResult = await hostRepo.getUserResult(hostId, userId);

      hostInfo.personalResult = personalResult;
    }

    if (options.activitiesBoard) {
      const activitiesBoard = await hostRepo.getActivitiesBoard(hostId);

      hostInfo.activitiesBoard = activitiesBoard;
    }

    if (options.userInfo) {
      const player = players.find((p) => p.id === userId);

      hostInfo.userInfo = player;
    }

    res.send(JsonResponse({ hostInfo }));
  }
);

app.post(HttpRoute.GenToken, async (req, res) => {
  const userId = randomUUID();
  const username = req.body.username;
  const hostId = req.body.hostId;
  const avatar = req.body.avatar;

  const controller = new HostRepository(hostId);

  if (await controller.checkPlayerNameExisted(hostId, username)) {
    res.status(400).send("Username already existed");
    return;
  }

  const token = jwt.sign(
    {
      id: userId,
      username,
      avatar,
    } as Player,
    JWT_SECRET
  );

  res.send(JsonResponse({ token }));
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

app.post(
  HttpRoute.GetPlayers,
  authenticateUser,
  async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      res.status(401).send("Unauthorized");
      return;
    }
    const hostId = req.body.hostId;

    const controller = new HostRepository(hostId);
    const players = await controller.getPlayers();
    const leaderBoard = await controller.getLeaderboard(hostId);
    players.forEach((player) => {
      const lbItem = leaderBoard.find((lb) => lb.playerId === player.id);
      player.score = lbItem?.score || 0;
    });

    res.send(JsonResponse({ players }));
  }
);

export default app;
