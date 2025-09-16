import { GameMode } from "@common/constants/host.constant";

export function getHost() {
  return "http://localhost:5173";
}

export function GenUrl(path: string, withHost?: boolean) {
  return `${withHost ? getHost() : ""}${path}`;
}

export class UrlGenerator {
  public static PlayerFinalStandingUrl(hostId: string) {
    return GenUrl(`/player-final/${hostId}`);
  }
  
  public static HostFinalStandingUrl(hostId: string) {
    return GenUrl(`/host-final/${hostId}`);
  }

  public static PlayerJoinLobbyUrl(hostId: string) {
    return GenUrl(`/join/${hostId}/lobby`);
  }

  public static PlayerJoinUrl(hostId: string = "") {
    return GenUrl(`/join/${hostId}`).replace(/\/+$/, '');
  }

  public static PlayerPlayUrl(hostId: string) {
    return GenUrl(`/player-play/${hostId}`);
  }

  public static HostLobbbyUrl(hostId: string) {
    return GenUrl(`/host-lobby/${hostId}`);
  }

  public static HostPlayUrl(hostId: string) {
    return GenUrl(`/host-play/${hostId}`);
  }

  public static AccessDeniedUrl() {
    return GenUrl("/access-denied");
  }

  public static LeaderBoardUrl(gameMode: GameMode, hostId: string) {
    return GenUrl(`/${gameMode}/${hostId}/leaderboard`);
  }
}
