import { GameMode } from "@common/constants/host.constant";

export type Player = {
  id: string;
  username: string;
  avatar: string;
  socketId: string;
};

export type HostInfo = {
  hostId?: string;
  settings?: any;
  started?: boolean;
  gameMode: GameMode;
};