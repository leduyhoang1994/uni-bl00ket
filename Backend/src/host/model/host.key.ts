export default class RedisHostKey {
  static fullKey(key: string) {
    return `educa:uni:bl00ket:${key}`;
  }

  static getHostKey(hostId: string): string {
    return this.fullKey(`host:${hostId}`);
  }

  static getPlayersKey(hostId: string): string {
    return this.fullKey(`host:${hostId}:players`);
  }

  static getPlayerGameDataKey(hostId: string): string {
    return this.fullKey(`host:${hostId}:gameData`);
  }

  static getHostLeaderboardKey(hostId: string): string {
    return this.fullKey(`host:${hostId}:leaderboard`);
  }
}
