import { create } from "zustand";

type SettingState = {
  toggleSettingGame: boolean;
  setToggleSettingGame: (toggleSettingGame: boolean) => void;
};

const initialDataSettingGame = {
  toggleSettingGame: false,
};

const SettingGameStore = create<SettingState>((set, get) => ({
  ...initialDataSettingGame,
  setToggleSettingGame: (toggleSettingGame) => set({ toggleSettingGame }),
}));

export default SettingGameStore;
