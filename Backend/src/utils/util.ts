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
