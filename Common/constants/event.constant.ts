export enum HostEvent {
  Created = "host:created",
  Kick = "host:kick",
  LobbyStarted = "host:lobby-started",
  LobbyUpdated = "host:lobby-updated",
  UserInfo = "host:user-info",
  LobbyStart = "host:lobby-start",
  SaveGame = "game:save",
  LeaderBoardUpdated = "host:leaderboard-updated",
  ScoreUpdated = "host:score-updated",
  EndGame  = "host:end-game",
  GameEnded = "host:game-ended",
  SaveActivity = "game:save-activity",
  ActivitySaved = "game:activity-saved",
}

export const HOST_COMMANDS = [HostEvent.LobbyStart, HostEvent.Kick, HostEvent.EndGame];
