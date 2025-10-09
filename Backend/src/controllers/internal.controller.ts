import {
  Body,
  Controller,
  Post,
  Route,
  Request,
  Security,
  Tags,
  Response,
  SuccessResponse,
  Hidden,
} from "tsoa";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";

import { InternalHttpRoute } from "@Common/constants/http.constant";
import { GetHostInfoOpts, HostInfo, Player } from "@Common/types/host.type";
import HostRepository from "../host/host.repo";
import { JWT_SECRET } from "../servers/api.server";
import { AuthenticatedRequest } from "../types/http.type";
import JsonResponse, { ResponseType } from "../utils/response";

interface CreateHostBody {
  hostInfo: HostInfo;
}

export interface GetHostInfoBody {
  hostId: string;
  options?: GetHostInfoOpts;
}

interface GenTokenBody {
  username: string;
  hostId: string;
  avatar?: string;
}

interface GetPlayersBody {
  hostId: string;
}

@Route()
@Tags("Internal API")
@Hidden()
export class InternalApiController extends Controller {
  /**
   * Tạo một host mới
   */
  @Post(InternalHttpRoute.CreateHost)
  @SuccessResponse("200", "Created") // Mô tả response khi thành công
  public async createHost(
    @Body() body: CreateHostBody
  ): Promise<ResponseType<{ hostId: string }>> {
    const { hostInfo } = body;
    const hostId = await HostRepository.create(hostInfo);
    return JsonResponse({ hostId });
  }

  /**
   * Lấy thông tin chi tiết của một host
   */
  @Security("bearerAuth") // Yêu cầu xác thực (sẽ được định nghĩa ở file authentication.ts)
  @Post(InternalHttpRoute.GetHostInfo)
  public async getHostInfo(
    @Request() req: AuthenticatedRequest,
    @Body() body: GetHostInfoBody
  ): Promise<ResponseType<{ hostInfo: HostInfo }>> {
    const { hostId, options = {} } = body;
    const userId = req.user?.id;
    const hostRepository = new HostRepository(hostId);

    const hostInfo = await hostRepository.getHostInfo(hostId);
    const leaderboardCount = options.fullLeaderboard ? undefined : 3;

    let finalStandings = await hostRepository.getLeaderboard(
      hostId,
      leaderboardCount
    );
    const players = await hostRepository.getPlayers();

    finalStandings = finalStandings.map((item) => {
      const player = players.find((p) => p.id === item.playerId);
      return { ...item, username: player?.username, avatar: player?.avatar };
    });

    hostInfo.finalStandings = finalStandings;

    if (options.personalResult && userId) {
      hostInfo.personalResult = await hostRepository.getUserResult(
        hostId,
        userId
      );
    }
    if (options.activitiesBoard) {
      hostInfo.activitiesBoard = await hostRepository.getActivitiesBoard(
        hostId
      );
    }
    if (options.userInfo) {
      hostInfo.userInfo = players.find((p) => p.id === userId);
    }

    return JsonResponse({ hostInfo });
  }

  /**
   * Tạo token cho người chơi mới
   */
  @Post(InternalHttpRoute.GenToken)
  @Response<string>(400, "Username already existed") // Mô tả response khi có lỗi
  public async generateToken(
    @Body() body: GenTokenBody
  ): Promise<ResponseType<{ token: string }>> {
    const { username, hostId, avatar } = body;
    const controller = new HostRepository(hostId);

    if (await controller.checkPlayerNameExisted(hostId, username)) {
      this.setStatus(400);
      // Khi throw một Error, tsoa middleware sẽ bắt và trả về response lỗi
      throw new Error("Username already existed");
    }

    const userId = randomUUID();
    const token = jwt.sign(
      { id: userId, username, avatar } as Player,
      JWT_SECRET
    );

    return JsonResponse({ token });
  }

  /**
   * Lấy dữ liệu game cho người dùng đã xác thực
   */
  @Security("bearerAuth")
  @Post(InternalHttpRoute.GetGameData)
  public async getGameData(
    @Request() req: AuthenticatedRequest
  ): Promise<ResponseType<{ gameData: any }>> {
    if (!req.user) {
      this.setStatus(401);
      throw new Error("Unauthorized");
    }
    const hostId = req.user.hostId;
    const userId = req.user.id;
    const hostRepository = new HostRepository(hostId);
    const gameData = await hostRepository.getGameData(hostId, userId);

    return JsonResponse({ gameData });
  }

  /**
   * Lấy danh sách người chơi trong một host
   */
  @Security("bearerAuth")
  @Post(InternalHttpRoute.GetPlayers)
  public async getPlayers(
    @Body() body: GetPlayersBody
  ): Promise<ResponseType<{ players: Player[] }>> {
    const { hostId } = body;
    const hostRepository = new HostRepository(hostId);
    const players = await hostRepository.getPlayers();
    const leaderBoard = await hostRepository.getLeaderboard(hostId);

    players.forEach((player) => {
      const lbItem = leaderBoard.find((lb) => lb.playerId === player.id);
      player.score = lbItem?.score || 0;
    });

    return JsonResponse({ players });
  }
}
