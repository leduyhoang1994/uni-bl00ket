import { create } from "zustand";
import { getGoldQuestControllerInstance } from "./gold-quest-controller.singleton";

type GoldChestState = {
  gold: number;
  setGold: (gold: number) => void;
};

export const initialStateQuiz = {
  gold: 0,
};

const GoldQuestStore = create<GoldChestState>((set, get) => ({
  ...initialStateQuiz,
  setGold: (gold) => set({ gold }),
}));

export default GoldQuestStore;
