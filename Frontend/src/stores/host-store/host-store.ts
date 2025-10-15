import { HostInfo, HostLeaderboard, Player } from "@common/types/host.type";
import { create } from "zustand";

export enum StateType {
  HOST = "HOST",
  IN_GAME = "IN_GAME",
}

type HostState = {
  hostInfo?: HostInfo,
  currentState: StateType;
  lobbyPlayers: Player[];
  setCurrentState: (currentState: StateType) => void;
  setLobbyPlayers: (lobbyPlayers: Player[] | Player) => void;
  leaderboard: HostLeaderboard;
  setLeaderboard: (leaderboard: HostLeaderboard) => void;
  userInfo: Player | null;
  setUserInfo: (userInfo: Player | null) => void;
  toggleSetting: boolean;
  setToggleSetting: (toggleSetting: boolean) => void;
  setHostInfo: (hostInfo: HostInfo) => void;
};

const initialDataHost = {
  hostInfo: undefined,
  currentState: StateType.HOST,
  lobbyPlayers: [],
  leaderboard: [],
  userInfo: null,
  toggleSetting: false,
};

const updatePlayers = (prevPlayers: Player[], player: Player): Player[] => {
  const existingIndex = prevPlayers.findIndex((p) => p.id === player.id);

  if (existingIndex > -1) {
    const updated = [...prevPlayers];
    updated[existingIndex] = player;
    return updated;
  }

  return [...prevPlayers, player];
};

const HostStore = create<HostState>((set, get) => ({
  ...initialDataHost,
  setCurrentState: (currentState) => set({ currentState }),
  setLobbyPlayers: (newPlayers) => {
    const lobbyPlayers = get().lobbyPlayers;

    if (Array.isArray(newPlayers)) {
      set({ lobbyPlayers: newPlayers });
    } else {
      set({
        lobbyPlayers: updatePlayers(lobbyPlayers, newPlayers),
      });
    }
  },
  setLeaderboard: (leaderboard) => set({ leaderboard }),
  setUserInfo: (userInfo) => set({ userInfo }),
  setToggleSetting: (toggleSetting) => set({ toggleSetting }),
  setHostInfo: (hostInfo) => set({ hostInfo }),
}));

export default HostStore;
