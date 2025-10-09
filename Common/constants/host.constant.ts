/**
 * Thể loại game
 */
export enum GameMode {
  Cafe = "cafe",
}

/**
 * Trạng thái host
 */
export enum HostState {
  Lobby = "lobby",
  InGame = "in-game",
  Ended = "ended",
}

export enum GameEventType {
  Players = "players",
  All = "all",
}
