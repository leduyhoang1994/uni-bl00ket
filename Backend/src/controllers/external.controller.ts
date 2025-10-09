import { Body, Controller, Path, Post, Route, Security, Tags } from "tsoa";
import HostRepository from "../host/host.repo";
import { GameMode } from "@Common/constants/host.constant";
import JsonResponse, { ResponseType } from "../utils/response";
import { ExternalHttpRoute } from "@Common/constants/http.constant";
import { GetHostInfoOpts, HostInfo } from "@Common/types/host.type";
import RedisClient from "../utils/redis.client";
import HostSocket from "../host/host.socket";
import { Emitter } from "@socket.io/redis-emitter";

type ECreateHostBody = {
  groupId: string;
  gameId: string;
  hostCount: number;
};

type EHostIds = {
  hostIds: string[];
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
  public async getTest(
    @Body() body: ECreateHostBody
  ): Promise<ResponseType<{ hostIds: string[] }>> {
    const hostIds = [];

    for (let i = 0; i < body.hostCount; i++) {
      const hostId = await HostRepository.create({
        gameMode: GameMode.Cafe,
        groupId: body.groupId,
      });

      hostIds.push(hostId);
    }

    return JsonResponse({ hostIds });
  }

  /**
   * Bắt đầu hosts hàng loạt
   */
  @Post(ExternalHttpRoute.StartHosts)
  public async startHosts(
    @Body() body: EHostIds
  ): Promise<ResponseType<{ hostIds: string[] }>> {
    const hostIds = body.hostIds;
    const redisClient = await RedisClient.getClient();
    const emitter = new Emitter(redisClient);

    for (let i = 0; i < hostIds.length; i++) {
      const hostRepository = new HostRepository(hostIds[i]);
      const socketEmmiter = new HostSocket(hostIds[i], emitter);
      await hostRepository.start();
      await socketEmmiter.emitStarted();
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
    const redisClient = await RedisClient.getClient();
    const emitter = new Emitter(redisClient);

    for (let i = 0; i < hostIds.length; i++) {
      const hostId = hostIds[i];
      const hostRepository = new HostRepository(hostId);
      const socketEmmiter = new HostSocket(hostId, emitter);
      await hostRepository.endGame(hostId);
      await socketEmmiter.emitGameEnded();
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
