import { GameMode, HostState } from "../constants/host.constant";

export type Player = {
  id: string;
  username: string;
  avatar: string;
  socketId: string;
};

export type HostInfo = {
  hostId?: string;
  settings?: any;
  state?: HostState;
  gameMode: GameMode;
  finalStandings?: Array<HostLeaderboardItem>;
};

export type HostLeaderboardItem = {
  playerId: string;
  score: number;
  username?: string;
  avatar?: string;
};

export type HostLeaderboard = HostLeaderboardItem[];
