/**
 * Thể loại game
 */
export enum GameMode {
  Cafe = "cafe",
  GoldQuest = "gold-quest",
}

export const GameModePicture = new Map<GameMode, string>([
  [GameMode.Cafe, "/images/host/modes/Cafe.png"],
  [GameMode.GoldQuest, "/images/host/modes/GoldQuest.png"],
])

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
