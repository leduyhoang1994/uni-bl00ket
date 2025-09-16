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
};

const initialDataHost = {
  currentState: StateType.HOST,
  lobbyPlayers: [],
  leaderboard: [],
};

const HostStore = create<HostState>((set, get) => ({
  ...initialDataHost,
  setCurrentState: (currentState) => set({ currentState }),
  setLobbyPlayers: (lobbyPlayers) => set({ lobbyPlayers }),
  setLeaderboard: (leaderboard) => set({ leaderboard }),
}));

export default HostStore;
