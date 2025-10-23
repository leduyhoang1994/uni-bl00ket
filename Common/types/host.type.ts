import { GameEventType, GameMode, HostState } from "../constants/host.constant";
import { Question } from "./game.type";

export type Player = {
  id: string;
  username: string;
  avatar: string;
  socketId: string;
  meta?: string;
  score?: number;
};

export type HostInfo = {
  hostId?: string;
  gameId?: string;
  /** Cài đặt game */
  gameSettings?: {
    [key: string]: any;
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
  startTime?: number;
  endTime?: number;
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
  userInfo?: Player;
};

export type HostLeaderboardItem = {
  playerId: string;
  score: number;
  username?: string;
  avatar?: string;
  meta?: string;
};

export type HostLeaderboard = HostLeaderboardItem[];

export type GetHostInfoOpts = {
  fullLeaderboard?: boolean;
  personalResult?: boolean;
  activitiesBoard?: boolean;
  userInfo?: boolean;
  questions?: boolean;
};

export type GameEvent = {
  type: GameEventType;
  sourcePlayer?: Player | null;
  targetPlayerIds?: Array<string>;
  payload?: any;
};
