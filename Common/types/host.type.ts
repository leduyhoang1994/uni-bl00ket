import { GameEventType, GameMode, HostState } from "../constants/host.constant";
import { Question } from "./game.type";

export type Player = {
  id: string;
  username: string;
  avatar: string;
  socketId: string;
  score?: number;
};

export type HostInfo = {
  hostId?: string;
  gameId?: string;
  /** Cài đặt game */
  gameSettings?: {
    [key: string]: string;
  };
  state?: HostState;
  gameMode: GameMode;
  /** Bảng xếp hạng */
  finalStandings?: Array<HostLeaderboardItem>;
  personalResult?: PersonalResult;
  /** Lịch sử hoạt động */
  activitiesBoard?: Array<ActivityBoardItem>;
  userInfo?: Player;
  groupId?: string;
  questions?: Array<Question>;
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
  userInfo?: boolean;
  questions?: boolean;
};

export type HostLeaderboard = HostLeaderboardItem[];

export type GameEvent = {
  type: GameEventType;
  sourcePlayer?: Player | null;
  targetPlayerIds?: Array<string>;
  payload?: any;
};
