import { create } from "zustand";

export enum StateType {
  HOST = 'HOST',
  IN_GAME = 'IN_GAME'
}

type HostState = {
  currentState: StateType;
  setCurrentState: (currentState: StateType) => void;
};

const initialDataHost = {
  currentState: StateType.HOST
};

const HostStore = create<HostState>((set, get) => ({
  ...initialDataHost,
  setCurrentState: (currentState) => set({ currentState }),

}));

export default HostStore;
