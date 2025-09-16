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
  personalResult?: PersonalResult;
  activitiesBoard?: Array<ActivityBoardItem>;
};

export type ActivityBoardItem = {
  playerId: string;
  username: string;
  avatar: string;
  activity: any;
};

export type PersonalResult = {
  score: number;
  rank: number;
  accuracy: {
    corrects: number;
    total: number;
    percent: number;
  };
};

export type HostLeaderboardItem = {
  playerId: string;
  score: number;
  username?: string;
  avatar?: string;
};

export type GetHostInfoOpts = {
  fullLeaderboard?: boolean;
  personalResult?: boolean;
  activitiesBoard?: boolean;
};

export type HostLeaderboard = HostLeaderboardItem[];
