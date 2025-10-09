export enum InternalHttpRoute {
  CreateHost = "/host/create",
  GetHostInfo = "/host/info",
  GetGameData = "/game/data",
  GenToken = "/host/gen-token",
  GetPlayers = "/host/players",
}

export enum ExternalHttpRoute {
  CreateHosts = "/host/create",
  StartHosts = "/host/start",
  StopHosts = "/host/end",
  GetHostInfo = "/host/info/{hostId}",
}