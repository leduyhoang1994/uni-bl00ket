export default class RedisHostKey {
  static fullKey(key: string) {
    return `educa:uni:bl00ket:${key}`;
  }

  static getHostKey(hostId: string, withFull: boolean = true): string {
    if (withFull) {
      return this.fullKey(`host:{${hostId}}`);
    }

    return `host:{${hostId}}`;
  }

  static getPlayersKey(hostId: string): string {
    return this.fullKey(`${RedisHostKey.getHostKey(hostId, false)}:players`);
  }

  static getPlayerGameDataKey(hostId: string): string {
    return this.fullKey(`${RedisHostKey.getHostKey(hostId, false)}:gameData`);
  }

  static getHostLeaderboardKey(hostId: string): string {
    return this.fullKey(
      `${RedisHostKey.getHostKey(hostId, false)}:leaderboard`
    );
  }

  static getPlayerActivitiesKey(hostId: string): string {
    return this.fullKey(`${RedisHostKey.getHostKey(hostId, false)}:activities`);
  }

  static getGameHostListKey(gameId: string): string {
    return this.fullKey(`game:${gameId}`);
  }
}
