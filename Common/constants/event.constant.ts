export enum HostEvent {
  Created = "host:created",
  Kick = "host:kick",
  LobbyStarted = "host:lobby-started",
  LobbyUpdated = "host:lobby-updated",
  UserInfo = "host:user-info",
  LobbyStart = "host:lobby-start",
  SaveGame = "game:save",
}

export const HOST_COMMANDS = [HostEvent.LobbyStart, HostEvent.Kick];
