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
      "state",
      HostState.InGame
    );
  }

  public async hasStarted() {
    const client = await RedisClient.getClient();
    const state = await client.hGet(
      RedisHostKey.getHostKey(this.hostId),
      "state"
    );
    return state === HostState.InGame;
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

  public async getPlayersByIds(ids: Array<string>) {
    const client = await RedisClient.getClient();
    const players = await client.hmGet(
      RedisHostKey.getPlayersKey(this.hostId),
      ids
    );

    return players.map((player) => JSON.parse(player as string) as Player);
  }

  public async join(user: AuthenticatedUser) {
    const client = await RedisClient.getClient();

    const existedUser = await this.getPlayerById(user.id);

    if (existedUser) {
      user.avatar = existedUser.avatar;
    }

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
      state: redisHostInfo["state"] as HostState,
      gameMode: redisHostInfo["gameMode"] as GameMode,
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

  public async updateLeaderboard(
    hostId: string,
    userId: string,
    score: number
  ) {
    const client = await RedisClient.getClient();

    await client.zAdd(RedisHostKey.getHostLeaderboardKey(hostId), {
      score: score,
      value: userId,
    });
  }

  public async getLeaderboard(
    hostId: string,
    max: number = 20
  ): Promise<HostLeaderboard> {
    const client = await RedisClient.getClient();

    const leaderboard = (await client.sendCommand([
      "zrevrange",
      RedisHostKey.getHostLeaderboardKey(hostId),
      "0",
      (max - 1).toString(),
      "WITHSCORES",
    ])) as Array<string>;

    const result = [];

    for (let i = 0; i < leaderboard.length; i += 2) {
      result.push({
        playerId: leaderboard[i],
        score: Number(leaderboard[i + 1]),
      });
    }

    return result;
  }

  public async endGame(hostId: string) {
    const client = await RedisClient.getClient();
    await client.hSet(
      RedisHostKey.getHostKey(hostId),
      "state",
      HostState.Ended
    );
  }

  public async getUserResult(
    hostId: string,
    playerId: string
  ): Promise<PersonalResult> {
    const result: PersonalResult = {
      score: 0,
      rank: 0,
      accuracy: {
        corrects: 0,
        percent: 0,
        total: 0,
      },
    };

    const client = await RedisClient.getClient();
    const userRank = await client.zRevRank(
      RedisHostKey.getHostLeaderboardKey(hostId),
      playerId
    );
    const userScore = await client.zScore(
      RedisHostKey.getHostLeaderboardKey(hostId),
      playerId
    );
    let gameDataJson = await client.hGet(
      RedisHostKey.getPlayerGameDataKey(hostId),
      playerId
    );

    const gameData = JSON.parse(gameDataJson || "{}");

    result.rank = (userRank || 0) + 1;
    result.score = userScore || 0;
    const total = gameData?.totalQuestions ?? 0;
    const corrects = gameData?.totalCorrectAnswers ?? 0;
    const percent = total > 0 ? +Math.round((corrects / total) * 100) : 0;

    result.accuracy = { total, corrects, percent };

    return result;
  }

  public async saveActivity(hostId: string, playerId: string, activity: any) {
    const client = await RedisClient.getClient();
    client.lPush(
      RedisHostKey.getPlayerActivitiesKey(hostId),
      JSON.stringify({
        playerId,
        activity,
      })
    );
  }

  public async getActivitiesBoard(hostId: string) {
    const client = await RedisClient.getClient();

    const activitiesBoard = await client.lRange(
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
    const client = await RedisClient.getClient();
    const playerData = await client.hGet(
      RedisHostKey.getPlayersKey(hostId),
      userId
    );
    const player = JSON.parse(playerData as string) as Player;
    player.avatar = avatar;

    await client.hSet(
      RedisHostKey.getPlayersKey(hostId),
      userId,
      JSON.stringify(player)
    );
  }

  public async checkPlayerNameExisted(hostId: string, username: string) {
    const players = await this.getPlayers();

    if (!players) {
      return false;
    }

    return Object.values(players).some((player) => {
      return player.username === username;
    });
  }

  public static async create(hostInfo: HostInfo) {
    const client = await RedisClient.getClient();
    const hostId = hostInfo.hostId || hexRnd.rnd();

    await client.hSet(
      RedisHostKey.getHostKey(hostId),
      "state",
      HostState.Lobby
    );
    await client.hSet(
      RedisHostKey.getHostKey(hostId),
      "gameMode",
      hostInfo.gameMode
    );

    if (hostInfo.groupId) {
      await client.hSet(
        RedisHostKey.getHostKey(hostId),
        "groupId",
        hostInfo.groupId
      );
      await client.lPush(
        RedisHostKey.getHostGroupKey(hostInfo.groupId),
        hostId
      );
    }

    return hostId;
  }
}
