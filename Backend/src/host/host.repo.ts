import {
  HostInfo,
  HostLeaderboard,
  PersonalResult,
  Player,
} from "@Common/types/host.type";
import { AuthenticatedUser } from "../../../Common/types/socket.type";
import logger from "../utils/logger";
import RedisHostKey from "./model/host.key";
import RedisClient from "../utils/redis.client";
import { hexRnd } from "../utils/token";
import { GameMode, HostState } from "@Common/constants/host.constant";
import { GameEventPublisherPublisher } from "../publishers/game-event.publisher";

export default class HostRepository {
  private hostId: string;

  constructor(hostId: string) {
    this.hostId = hostId;
  }

  public async start(hostId?: string) {
    if (await this.hasStarted()) {
      logger.info("Game has already Started");
      return;
    }

    logger.info("Host Started");
    const redisClient = RedisClient.getClient();
    await redisClient.hset(
      // hSet -> hset
      RedisHostKey.getHostKey(hostId || this.hostId),
      "state",
      HostState.InGame
    );
  }

  public async hasStarted() {
    const client = RedisClient.getClient();
    const state = await client.hget(
      // hGet -> hget
      RedisHostKey.getHostKey(this.hostId),
      "state"
    );
    return state === HostState.InGame;
  }

  public async getPlayerById(id: string) {
    const client = RedisClient.getClient();
    const player = await client.hget(
      RedisHostKey.getPlayersKey(this.hostId),
      id
    );

    if (!player) {
      return null;
    }

    return JSON.parse(player) as Player;
  }

  public async getPlayersByIds(ids: Array<string>) {
    if (ids.length === 0) {
      return [];
    }

    const client = RedisClient.getClient();
    const players = await client.hmget(
      RedisHostKey.getPlayersKey(this.hostId),
      ...ids
    );

    return players
      .map((player) => (player ? (JSON.parse(player) as Player) : null))
      .filter((p) => p !== null) as Player[];
  }

  public async join(user: AuthenticatedUser) {
    const client = RedisClient.getClient();
    const existedUser = await this.getPlayerById(user.id);

    if (existedUser) {
      user.avatar = existedUser.avatar;
    }

    await client.hset(
      RedisHostKey.getPlayersKey(this.hostId),
      user.id,
      JSON.stringify(user)
    );

    console.debug(`Player ${user.id} joined`);
  }

  public async getPlayers(hostId?: string): Promise<Player[]> {
    hostId = hostId || this.hostId;

    const client = RedisClient.getClient();
    const players = await client.hgetall(RedisHostKey.getPlayersKey(hostId));

    return Object.values(players).map((player) => JSON.parse(player) as Player);
  }

  public async leave(user: AuthenticatedUser) {
    const player = await this.getPlayerById(user.id);

    if (!player) {
      logger.debug("Player not found");
      return;
    }
    const client = RedisClient.getClient();
    await client.hdel(RedisHostKey.getPlayersKey(this.hostId), user.id);
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

    const client = RedisClient.getClient();
    await client.hdel(RedisHostKey.getPlayersKey(this.hostId), user.id);
    await this.onLeaved(user);
  }

  public async getHostInfo(hostId: string): Promise<HostInfo> {
    const client = RedisClient.getClient();
    const redisHostInfo = await client.hgetall(RedisHostKey.getHostKey(hostId));

    return {
      state: redisHostInfo["state"] as HostState,
      gameMode: redisHostInfo["gameMode"] as GameMode,
      gameId: redisHostInfo["gameId"],
      groupId: redisHostInfo["groupId"],
      hostId: hostId,
      gameSettings: JSON.parse(redisHostInfo["gameSettings"] || "{}"),
      startTime: parseInt(redisHostInfo["startTime"]) || undefined,
      endTime: parseInt(redisHostInfo["endTime"]) || undefined,
    };
  }

  public async getHostState(hostId: string) {
    const client = RedisClient.getClient();
    const state = await client.hget(
      RedisHostKey.getHostKey(hostId),
      "state"
    );

    return state as HostState;
  }

  public async isInGame(hostId: string) {
    return await this.getHostState(hostId) === HostState.InGame;
  }

  public async getGameData(hostId: string, userId: string) {
    const client = RedisClient.getClient();
    const gameData = await client.hget(
      // hGet -> hget
      RedisHostKey.getPlayerGameDataKey(hostId),
      userId
    );

    return gameData ? JSON.parse(gameData) : null;
  }

  public async saveGameData(hostId: string, userId: string, gameData: any) {
    const client = RedisClient.getClient();
    await client.hset(
      RedisHostKey.getPlayerGameDataKey(hostId),
      userId,
      gameData
    );
  }

  public async updateLeaderboard(
    hostId: string,
    userId: string,
    score: number
  ) {
    const client = RedisClient.getClient();
    await client.zadd(
      RedisHostKey.getHostLeaderboardKey(hostId),
      score,
      userId
    );
  }

  public async getLeaderboard(
    hostId: string,
    max: number = 20
  ): Promise<HostLeaderboard> {
    const client = RedisClient.getClient();

    const leaderboard = await client.zrevrange(
      RedisHostKey.getHostLeaderboardKey(hostId),
      0,
      max - 1,
      "WITHSCORES"
    );

    const result: HostLeaderboard = [];

    for (let i = 0; i < leaderboard.length; i += 2) {
      result.push({
        playerId: leaderboard[i],
        score: Number(leaderboard[i + 1]),
      });
    }

    return result;
  }

  public async end(hostId?: string) {
    const client = RedisClient.getClient();
    hostId = hostId || this.hostId;
    logger.info(`[Host - end] hostId: ${hostId}`);

    await client.hset(
      RedisHostKey.getHostKey(hostId),
      "state",
      HostState.Ended
    );
    try {
      logger.info(`[Host - end - getLeaderboard] hostId: ${hostId}`);
      const rawLeaderboard = await this.getLeaderboard(hostId);
      const players = await this.getPlayers(hostId);
      const leaderBoard = rawLeaderboard.map((item) => {
        const player = players.find((p) => p.id === item.playerId);
        return { ...item, meta: player?.meta };
      });

      GameEventPublisherPublisher.getInstance().publishLeaderboard(
        hostId,
        leaderBoard
      );
    } catch (error) {
      logger.debug("Publish leaderboard error:", error);
    }
  }

  public async getUserResult(
    hostId: string,
    playerId: string
  ): Promise<PersonalResult> {
    const result: PersonalResult = {
      score: 0,
      rank: 0,
      accuracy: { corrects: 0, percent: 0, total: 0 },
    };

    const client = RedisClient.getClient();
    const userRank = await client.zrevrank(
      RedisHostKey.getHostLeaderboardKey(hostId),
      playerId
    );
    const userScore = await client.zscore(
      RedisHostKey.getHostLeaderboardKey(hostId),
      playerId
    );
    let gameDataJson = await client.hget(
      RedisHostKey.getPlayerGameDataKey(hostId),
      playerId
    );

    const gameData = JSON.parse(gameDataJson || "{}");

    result.rank = userRank !== null ? userRank + 1 : 0;
    result.score = userScore ? Number(userScore) : 0;
    const total = gameData?.totalQuestions ?? 0;
    const corrects = gameData?.totalCorrectAnswers ?? 0;
    const percent = total > 0 ? +Math.round((corrects / total) * 100) : 0;

    result.accuracy = { total, corrects, percent };

    return result;
  }

  public async saveActivity(hostId: string, playerId: string, activity: any) {
    const client = RedisClient.getClient();
    await client.lpush(
      RedisHostKey.getPlayerActivitiesKey(hostId),
      JSON.stringify({
        playerId,
        activity,
      })
    );
  }

  public async getActivitiesBoard(hostId: string) {
    const client = RedisClient.getClient();
    const activitiesBoard = await client.lrange(
      RedisHostKey.getPlayerActivitiesKey(hostId),
      0,
      -1
    );
    const players = await this.getPlayers();
    return activitiesBoard.map((item) => {
      const activity = JSON.parse(item);
      const player = players.find((p) => p.id === activity.playerId);
      return {
        username: player?.username,
        avatar: player?.avatar,
        ...JSON.parse(item),
      };
    });
  }

  public async updatePlayerAvatar(
    hostId: string,
    userId: string,
    avatar: string
  ) {
    const client = RedisClient.getClient();
    const playerData = await client.hget(
      RedisHostKey.getPlayersKey(hostId),
      userId
    );
    if (!playerData) return;
    const player = JSON.parse(playerData) as Player;
    player.avatar = avatar;

    await client.hset(
      RedisHostKey.getPlayersKey(hostId),
      userId,
      JSON.stringify(player)
    );
  }

  public async checkPlayerNameExisted(hostId: string, userId: string) {
    const players = await this.getPlayersByIds([userId]);
    return players.some((player) => player.id === userId);
  }

  public async setStartTime(time: number) {
    await HostRepository.setStartTime(this.hostId, time);
  }

  public async setEndTime(time: number) {
    await HostRepository.setEndTime(this.hostId, time);
  }

  public static async setStartTime(hostId: string, time: number) {
    const client = RedisClient.getClient();
    await client.hset(RedisHostKey.getHostKey(hostId), "startTime", time);
  }

  public static async setEndTime(hostId: string, time: number) {
    const client = RedisClient.getClient();
    await client.hset(RedisHostKey.getHostKey(hostId), "endTime", time);
  }

  public static async create(hostInfo: HostInfo) {
    const client = RedisClient.getClient();
    const hostId = hostInfo.hostId || hexRnd.rnd();

    const hostKey = RedisHostKey.getHostKey(hostId);

    const pipeline = client.pipeline();
    pipeline.hset(hostKey, "state", HostState.Lobby);
    pipeline.hset(hostKey, "gameMode", hostInfo.gameMode);

    if (hostInfo.gameId) {
      pipeline.hset(hostKey, "gameId", hostInfo.gameId);
    }

    if (hostInfo.gameSettings) {
      pipeline.hset(
        hostKey,
        "gameSettings",
        JSON.stringify(hostInfo.gameSettings)
      );
    }

    if (hostInfo.startTime) {
      pipeline.hset(hostKey, "startTime", hostInfo.startTime);
    }

    if (hostInfo.endTime) {
      pipeline.hset(hostKey, "endTime", hostInfo.endTime);
    }

    await pipeline.exec();

    if (hostInfo.gameId) {
      await client.lpush(
        RedisHostKey.getGameHostListKey(hostInfo.gameId),
        hostId
      );
    }

    return hostId;
  }
}
