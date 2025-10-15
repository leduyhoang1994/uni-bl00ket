import { Body, Controller, Path, Post, Route, Security, Tags } from "tsoa";
import HostRepository from "../host/host.repo";
import { GameMode } from "@Common/constants/host.constant";
import JsonResponse, { ResponseType } from "../utils/response";
import { ExternalHttpRoute } from "@Common/constants/http.constant";
import { GetHostInfoOpts, HostInfo } from "@Common/types/host.type";
import GameRepo from "../game/game.repo";
import { GameNotFoundError } from "../base/errors/game.error";
import { getJoinUrl } from "../utils/util";
import WorkerController from "../servers/worker.server";

/**
 * Unix timestamp theo giây, nếu không truyền lên thì mặc định thực hiện luôn
 * - Nếu là số thì áp dụng cho toàn bộ hosts gửi lên
 * - Nếu là mảng thì áp dụng cho host index tương ứng
 */
type Schedules = number | Array<number>;

type ECreateHostBody = {
  gameId: string;
  hostCount: number;
};

type ECreateHostByIdsBody = {
  gameId: string;
  hostIds: Array<string>;
};

type EHostIds = {
  hostIds: Array<string>;
  schedules?: Schedules;
};

type EGetHostInfo = Omit<GetHostInfoOpts, "personalResult" | "userInfo">;
type EHostInfo = Omit<HostInfo, "personalResult" | "userInfo">;

@Route("external")
@Tags("External API")
@Security("apiKey")
export class ExternalController extends Controller {
  /**
   * Tạo hosts hàng loạt
   */
  @Post(ExternalHttpRoute.CreateHosts)
  public async createHosts(
    @Body() body: ECreateHostBody
  ): Promise<ResponseType<{ joinUrls: string[] }>> {
    const hostIds = [];

    const gameData = await GameRepo.findGameById(body.gameId);

    if (!gameData) {
      throw new GameNotFoundError();
    }

    for (let i = 0; i < body.hostCount; i++) {
      const hostId = await HostRepository.create({
        gameId: body.gameId,
        gameMode: gameData.mode as GameMode,
      });

      hostIds.push(hostId);
    }

    const joinUrls = hostIds.map((hostId) => getJoinUrl(hostId, body.gameId));

    return JsonResponse({ joinUrls });
  }

  /**
   * Tạo hosts hàng loạt theo ID cho trước
   */
  @Post(ExternalHttpRoute.CreateHostsByIds)
  public async createHostsByIds(
    @Body() body: ECreateHostByIdsBody
  ): Promise<ResponseType<{ joinUrls: string[] }>> {
    const hostIds = [];

    const gameData = await GameRepo.findGameById(body.gameId);

    if (!gameData) {
      throw new GameNotFoundError();
    }

    for (let i = 0; i < body.hostIds.length; i++) {
      const hostId = body.hostIds[i];

      await HostRepository.create({
        gameId: body.gameId,
        gameMode: gameData.mode as GameMode,
        hostId: hostId,
      });

      hostIds.push(hostId);
    }

    const joinUrls = hostIds.map((hostId) => getJoinUrl(hostId, body.gameId));

    return JsonResponse({ joinUrls });
  }

  /**
   * Bắt đầu hosts hàng loạt
   */
  @Post(ExternalHttpRoute.StartHosts)
  public async startHosts(
    @Body() body: EHostIds
  ): Promise<ResponseType<{ hostIds: string[] }>> {
    const hostIds = body.hostIds;
    const workerController = await WorkerController.getInstance();
    const now = Date.now() / 1000;

    for (let i = 0; i < hostIds.length; i++) {
      const hostId = hostIds[i];
      let targetTime = now;

      if (Array.isArray(body.schedules)) {
        targetTime = body.schedules[i] || now;
      }

      if (typeof body.schedules === "number") {
        targetTime = body.schedules;
      }

      await HostRepository.setStartTime(hostId, targetTime);
      await workerController.scheduleStart(hostId, targetTime - now);
    }

    return JsonResponse({ hostIds });
  }

  /**
   * Kết thúc hosts hàng loạt
   */
  @Post(ExternalHttpRoute.StopHosts)
  public async stopHosts(
    @Body() body: EHostIds
  ): Promise<ResponseType<{ hostIds: string[] }>> {
    const hostIds = body.hostIds;
    const workerController = await WorkerController.getInstance();
    const now = Date.now() / 1000;

    for (let i = 0; i < hostIds.length; i++) {
      const hostId = hostIds[i];
      let targetTime = now;

      if (Array.isArray(body.schedules)) {
        targetTime = body.schedules[i] || now;
      }

      if (typeof body.schedules === "number") {
        targetTime = body.schedules;
      }

      await HostRepository.setStartTime(hostId, targetTime);
      await workerController.scheduleEnd(hostId, targetTime - now);
    }

    return JsonResponse({ hostIds });
  }

  /**
   * Lấy thông tin host
   */
  @Post(ExternalHttpRoute.GetHostInfo)
  public async getHostInfo(
    @Path() hostId: string,
    @Body() options: EGetHostInfo
  ): Promise<ResponseType<{ hostInfo: EHostInfo }>> {
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

    if (options.activitiesBoard) {
      hostInfo.activitiesBoard = await hostRepository.getActivitiesBoard(
        hostId
      );
    }

    return JsonResponse({ hostInfo });
  }
}
