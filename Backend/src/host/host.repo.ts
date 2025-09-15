import { HostInfo, Player } from "@Common/types/host.type";
import { AuthenticatedUser } from "../../../Common/types/socket.type";
import logger from "../utils/logger";
import RedisHostKey from "./model/host.key";
import RedisClient from "../utils/redis.client";
import { hexRnd } from "../utils/token";

export default class HostRepository {
  private hostId: string;

  constructor(hostId: string) {
    this.hostId = hostId;
  }

  public async start() {
    if (await this.hasStarted()) {
      logger.info("Game has already Started");
      return;
    }

    logger.info("Host Started");
    const redisClient = await RedisClient.getClient();
    await redisClient.hSet(
      RedisHostKey.getHostKey(this.hostId),
      "started",
      "true"
    );
  }

  public async hasStarted() {
    const client = await RedisClient.getClient();
    const started = await client.hGet(
      RedisHostKey.getHostKey(this.hostId),
      "started"
    );
    return started === "true";
  }

  public async getPlayerById(id: string) {
    const client = await RedisClient.getClient();
    const player = await client.hGet(
      RedisHostKey.getPlayersKey(this.hostId),
      id
    );

    if (!player) {
      return null;
    }

    return JSON.parse(player) as Player;
  }

  public async join(user: AuthenticatedUser) {
    const client = await RedisClient.getClient();

    await client.hSet(
      RedisHostKey.getPlayersKey(this.hostId),
      user.id,
      JSON.stringify(user)
    );

    console.debug(`Player ${user.id} joined`);
  }

  public async getPlayers() {
    const client = await RedisClient.getClient();
    const players = await client.hGetAll(
      RedisHostKey.getPlayersKey(this.hostId)
    );

    return Object.values(players).map((player) => JSON.parse(player) as Player);
  }

  public async leave(user: AuthenticatedUser) {
    const player = await this.getPlayerById(user.id);

    if (!player) {
      logger.debug("Player not found");
      return;
    }
    const client = await RedisClient.getClient();
    await client.hDel(RedisHostKey.getPlayersKey(this.hostId), user.id);
    await this.onLeaved(user);
  }
  private async onLeaved(user: Player) {
    logger.debug(`Player ${user.id} left`);
  }

  public async kickUser(user: Player) {
    const player = await this.getPlayerById(user.id);

    if (!player) {
      logger.debug("Player not found");
      return;
    }

    const client = await RedisClient.getClient();
    await client.hDel(RedisHostKey.getPlayersKey(this.hostId), user.id);
    await this.onLeaved(user);
  }

  public async getHostInfo(hostId: string): Promise<HostInfo> {
    const client = await RedisClient.getClient();
    const redisHostInfo = await client.hGetAll(RedisHostKey.getHostKey(hostId));

    return {
      started: redisHostInfo["started"] === "true",
      gameMode: redisHostInfo["gameMode"],
      hostId: hostId,
    };
  }

  public async getGameData(hostId: string, userId: string) {
    const client = await RedisClient.getClient();

    const gameData = await client.hGet(
      RedisHostKey.getPlayerGameDataKey(hostId),
      userId
    );

    return JSON.parse(gameData as string);
  }

  public async saveGameData(hostId: string, userId: string, gameData: any) {
    const client = await RedisClient.getClient();

    await client.hSet(
      RedisHostKey.getPlayerGameDataKey(hostId),
      userId,
      gameData
    );
  }

  public static async create(hostInfo: HostInfo) {
    const client = await RedisClient.getClient();
    const hostId = hostInfo.hostId || hexRnd.rnd();

    await client.hSet(RedisHostKey.getHostKey(hostId), "started", "false");
    await client.hSet(
      RedisHostKey.getHostKey(hostId),
      "gameMode",
      hostInfo.gameMode
    );

    return hostId;
  }
}
