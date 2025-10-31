import crypto from "crypto";

export function getFrontendDomain() {
  return process.env.FRONTEND_DOMAIN || "https://game.uniclass.vn";
}

export function getJoinUrl(hostId: string, gameId?: string) {
  let url = `${getFrontendDomain()}/join/${hostId}?type=backend`;

  if (gameId) {
    url += `&game_id=${gameId}`;
  }

  return url;
}

export enum Environment {
  Local = "local",
  Development = "development",
  Staging = "staging",
  Production = "production",
}
export function getEnvironment(): Environment {
  const env = process.env.ENVIRONMENT || "production";
  return env as Environment;
}
export function isProductionEnvironment(): boolean {
  return getEnvironment() === Environment.Production;
}
export function isLocalEnvironment(): boolean {
  return getEnvironment() === Environment.Local;
}
export function hashUsername(username: string): string {
  return crypto.createHash("sha256").update(username).digest("hex");
}