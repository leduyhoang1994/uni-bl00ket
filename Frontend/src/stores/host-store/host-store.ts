import { Player } from "@common/types/host.type";
import { create } from "zustand";

export enum StateType {
  HOST = 'HOST',
  IN_GAME = 'IN_GAME'
}

type HostState = {
  currentState: StateType;
  lobbyPlayers: Player[];
  setCurrentState: (currentState: StateType) => void;
  setLobbyPlayers: (lobbyPlayers: Player[]) => void;
};

const initialDataHost = {
  currentState: StateType.HOST,
  lobbyPlayers: [],
};

const HostStore = create<HostState>((set, get) => ({
  ...initialDataHost,
  setCurrentState: (currentState) => set({ currentState }),
  setLobbyPlayers: (lobbyPlayers) => set({ lobbyPlayers }),
}));

export default HostStore;
