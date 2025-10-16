import { getCafeControllerInstance } from "./cafe-controller.singleton";
import { ABILITY_ID, Customer } from "@/game/modes/cafe/model";
import { Player } from "@common/types/host.type";
import { create } from "zustand";

type CafeGameState = {
  toggleVisitShop: boolean;
  toggleAbilitiShop: boolean;
  cafeBalance: number;
  cafeStocks: any[];
  cafeShopItems: any[];
  cafeAbilitiesItems: any[];
  tagMoneyWidth: number;
  toggleLeaderBoard: boolean;
  setToggleVisitShop: (value: boolean) => void;
  setToggleAbilitiShop: (value: boolean) => void;
  setCafeBalance: (value: number) => void;
  setCafeStocks: (value: any[]) => void;
  setCafeShopItems: (value: any[]) => void;
  setCafeAbilitiesItems: (value: any[]) => void;
  loadCafeBalance: () => void;
  loadCafeStocks: () => void;
  loadCafeShopItems: () => void;
  loadCafeAbilities: () => void;
  loadCafeData: () => void;
  customers: Array<Customer>;
  setCustomers: (customers: Array<Customer>) => void;
  loadCustomers: () => void;
  getCustomerByPosition: (position: number) => Customer | undefined;
  serveAnimates: any[];
  pushServeAnimates: (animates: any) => void;
  removeServeAnimatesByIndex: (index: number) => void;
  setTagMoneyWidth: (value: number) => void;
  setToggleLeaderBoard: (value: boolean) => void;
  players: Player[];
  setPlayers: (players: Player[]) => void;
  isChoosingAbilityTarget: ABILITY_ID | null;
  setIsChoosingAbilityTarget: (value: ABILITY_ID | null) => void;
};

const initialState: Omit<
  CafeGameState,
  | "setToggleVisitShop"
  | "setToggleAbilitiShop"
  | "setCafeBalance"
  | "setCafeStocks"
  | "setCafeShopItems"
  | "setCafeAbilitiesItems"
  | "loadCafeBalance"
  | "loadCafeStocks"
  | "loadCafeShopItems"
  | "loadCafeAbilities"
  | "loadCafeData"
  | "setCustomers"
  | "loadCustomers"
  | "getCustomerByPosition"
  | "pushServeAnimates"
  | "removeServeAnimatesByIndex"
  | "setTagMoneyWidth"
  | "setToggleLeaderBoard"
  | "setPlayers"
  | "setIsChoosingAbilityTarget"
> = {
  toggleVisitShop: false,
  toggleAbilitiShop: false,
  cafeBalance: 0,
  cafeStocks: [],
  cafeShopItems: [],
  cafeAbilitiesItems: [],
  customers: [],
  serveAnimates: [],
  tagMoneyWidth: 0,
  toggleLeaderBoard: false,
  players: [],
  isChoosingAbilityTarget: null,
};

const CafeGameStore = create<CafeGameState>((set, get) => {
  return {
    ...initialState,
    setToggleVisitShop: (value) => set({ toggleVisitShop: value }),
    setToggleAbilitiShop: (value) => set({ toggleAbilitiShop: value }),
    setCafeBalance: (value) => set({ cafeBalance: value }),
    setCafeStocks: (value) => set({ cafeStocks: value }),
    setCafeShopItems: (value) => set({ cafeShopItems: value }),
    setCafeAbilitiesItems: (value) => set({ cafeAbilitiesItems: value }),
    setTagMoneyWidth: (value) => set({ tagMoneyWidth: value }),
    setToggleLeaderBoard: (value) => set({ toggleLeaderBoard: value }),
    loadCafeBalance: () => {
      try {
        const cafeController = getCafeControllerInstance();
        get().setCafeBalance(cafeController.getBalance());
      } catch (error) { }
    },
    loadCafeShopItems: () => {
      try {
        const cafeController = getCafeControllerInstance();
        get().setCafeShopItems(cafeController.getShop());
      } catch (error) { }
    },
    loadCafeStocks: () => {
      try {
        const cafeController = getCafeControllerInstance();
        get().setCafeStocks(cafeController.getStocks());
      } catch (error) { }
    },
    loadCafeAbilities: () => {
      try {
        const cafeController = getCafeControllerInstance();
        get().setCafeAbilitiesItems(cafeController.getAbilities());
      } catch (error) { }
    },
    loadCafeData: () => {
      const store = get();
      store.loadCafeBalance();
      store.loadCafeStocks();
      store.loadCafeShopItems();
      store.loadCafeAbilities();
    },
    setCustomers: (customers) => set({ customers }),
    loadCustomers: () => {
      try {
        const cafeController = getCafeControllerInstance();
        const { setCustomers } = get();
        const cs = cafeController.getCustomers();
        setCustomers(cs);
      } catch (error) {
        console.log(error);
      }
    },
    getCustomerByPosition: (position) => {
      const { customers } = get();
      return customers.find((customer) => customer.position == position);
    },
    pushServeAnimates: (animates) => {
      const { serveAnimates } = get();
      set({ serveAnimates: [...serveAnimates, ...animates] });
    },
    removeServeAnimatesByIndex: (index) => {
      const { serveAnimates } = get();

      set({ serveAnimates: serveAnimates.filter((_, i) => i != index) });
    },
    setPlayers: (players) => set({ players }),
    setIsChoosingAbilityTarget: (value) =>
      set({ isChoosingAbilityTarget: value }),
  };
});

export default CafeGameStore;
