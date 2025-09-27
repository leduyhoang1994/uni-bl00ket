import { GameMode } from "@common/constants/host.constant";

export function getHost() {
  return window.location.origin;
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
    return GenUrl(`/join/${hostId}`).replace(/\/+$/, "");
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

export function numberToOrder(numb: number): { numb: number; text: string } {
  const suffixes: { [key: number]: string } = {
    1: "st",
    2: "nd",
    3: "rd",
  };

  const mod100 = numb % 100;
  let suffix = "th";
  if (mod100 < 11 || mod100 > 13) {
    suffix = suffixes[numb % 10] || "th";
  }

  return { numb, text: suffix };
}

export function getAvatarById(id: string) {
  return `/images/cafe-game/customers/${id}.svg`;
}

export enum SCREEN_SIZES_ENUM {
  MEDIUM_DESKTOP_W = 1440,
  SMALL_DESKTOP_W_SPECIAL = 1260,
  SMALL_DESKTOP_W = 1200,
  TABLET_W = 1024,
  MOBILE_W = 768,
  SMALL_MOBILE_W = 576,
  VERY_SMALL_MOBILE_W = 400,
}
