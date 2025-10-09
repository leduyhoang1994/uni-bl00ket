import { NextFunction, Request, Response, Express } from "express";
import HostRepository from "../../host/host.repo";
import JsonResponse from "../../utils/response";
import { InternalHttpRoute } from "@Common/constants/http.constant";
import { GetHostInfoOpts, HostInfo, Player } from "@Common/types/host.type";
import { AuthenticatedRequest } from "../../types/http.type";
import { getPayloadFromAuth } from "../../utils/token";
import { AuthenticatedUser } from "@Common/types/socket.type";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { JWT_SECRET } from "../api.server";

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

export default function initInternalApi(app: Express) {
  app.post(InternalHttpRoute.CreateHost, async (req, res) => {
    const hostInfo: HostInfo = req.body.hostInfo;
    const hostId = await HostRepository.create(hostInfo);

    res.send(JsonResponse({ hostId }));
  });

  app.post(
    InternalHttpRoute.GetHostInfo,
    authenticateUser,
    async (req: AuthenticatedRequest, res) => {
      const hostId = req.body.hostId;
      const hostRepository = new HostRepository(hostId);

      const hostInfo = await hostRepository.getHostInfo(hostId);
      const options: GetHostInfoOpts = req.body.options || {};
      const userId = req.user?.id;

      const leaderboardCount = options.fullLeaderboard ? undefined : 3;

      let finalStadings = await hostRepository.getLeaderboard(
        hostId,
        leaderboardCount
      );

      const players = await hostRepository.getPlayers();

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
        const personalResult = await hostRepository.getUserResult(hostId, userId);

        hostInfo.personalResult = personalResult;
      }

      if (options.activitiesBoard) {
        const activitiesBoard = await hostRepository.getActivitiesBoard(hostId);

        hostInfo.activitiesBoard = activitiesBoard;
      }

      if (options.userInfo) {
        const player = players.find((p) => p.id === userId);

        hostInfo.userInfo = player;
      }

      res.send(JsonResponse({ hostInfo }));
    }
  );

  app.post(InternalHttpRoute.GenToken, async (req, res) => {
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
    InternalHttpRoute.GetGameData,
    authenticateUser,
    async (req: AuthenticatedRequest, res) => {
      if (!req.user) {
        res.status(401).send("Unauthorized");
        return;
      }
      const hostId = req.user?.hostId;

      const hostRepository = new HostRepository(hostId);
      const gameData = await hostRepository.getGameData(hostId, req.user?.id);

      res.send(JsonResponse({ gameData }));
    }
  );

  app.post(
    InternalHttpRoute.GetPlayers,
    authenticateUser,
    async (req: AuthenticatedRequest, res) => {
      if (!req.user) {
        res.status(401).send("Unauthorized");
        return;
      }
      const hostId = req.body.hostId;

      const hostRepository = new HostRepository(hostId);
      const players = await hostRepository.getPlayers();
      const leaderBoard = await hostRepository.getLeaderboard(hostId);
      players.forEach((player) => {
        const lbItem = leaderBoard.find((lb) => lb.playerId === player.id);
        player.score = lbItem?.score || 0;
      });

      res.send(JsonResponse({ players }));
    }
  );
}
