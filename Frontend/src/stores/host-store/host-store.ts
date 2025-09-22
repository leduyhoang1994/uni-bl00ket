import { HostLeaderboard, Player } from "@common/types/host.type";
import { create } from "zustand";

export enum StateType {
  HOST = "HOST",
  IN_GAME = "IN_GAME",
}

type HostState = {
  currentState: StateType;
  lobbyPlayers: Player[];
  setCurrentState: (currentState: StateType) => void;
  setLobbyPlayers: (lobbyPlayers: Player[]) => void;
  leaderboard: HostLeaderboard;
  setLeaderboard: (leaderboard: HostLeaderboard) => void;
  userInfo: Player | null;
  setUserInfo: (userInfo: Player | null) => void;
  toggleSetting: boolean;
  setToggleSetting: (toggleSetting: boolean) => void;
};

const initialDataHost = {
  currentState: StateType.HOST,
  lobbyPlayers: [],
  leaderboard: [],
  userInfo: null,
  toggleSetting: false,
};

const HostStore = create<HostState>((set, get) => ({
  ...initialDataHost,
  setCurrentState: (currentState) => set({ currentState }),
  setLobbyPlayers: (lobbyPlayers) => set({ lobbyPlayers }),
  setLeaderboard: (leaderboard) => set({ leaderboard }),
  setUserInfo: (userInfo) => set({ userInfo }),
  setToggleSetting: (toggleSetting) => set({ toggleSetting }),
}));

export default HostStore;
