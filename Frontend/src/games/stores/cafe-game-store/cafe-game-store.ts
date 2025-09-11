import { getCafeControllerInstance } from "@/games/cafe-game/cafeController.singleton";
import { Customer } from "@/model/model";
import { create } from "zustand";

type CafeGameState = {
  toggleVisitShop: boolean;
  toggleAbilitiShop: boolean;
  cafeBalance: number;
  cafeStocks: any[];
  cafeShopItems: any[];
  cafeAbilitiesItems: any[];
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
> = {
  toggleVisitShop: false,
  toggleAbilitiShop: false,
  cafeBalance: 0,
  cafeStocks: [],
  cafeShopItems: [],
  cafeAbilitiesItems: [],
  customers: [],
  serveAnimates: [],
};

const cafeController = getCafeControllerInstance();

const CafeGameStore = create<CafeGameState>((set, get) => ({
  ...initialState,
  setToggleVisitShop: (value) => set({ toggleVisitShop: value }),
  setToggleAbilitiShop: (value) => set({ toggleAbilitiShop: value }),
  setCafeBalance: (value) => set({ cafeBalance: value }),
  setCafeStocks: (value) => set({ cafeStocks: value }),
  setCafeShopItems: (value) => set({ cafeShopItems: value }),
  setCafeAbilitiesItems: (value) => set({ cafeAbilitiesItems: value }),
  loadCafeBalance: () => get().setCafeBalance(cafeController.getBalance()),
  loadCafeShopItems: () => get().setCafeShopItems(cafeController.getShop()),
  loadCafeStocks: () => get().setCafeStocks(cafeController.getStocks()),
  loadCafeAbilities: () =>
    get().setCafeAbilitiesItems(cafeController.getAbilities()),
  loadCafeData: () => {
    const store = get();
    store.loadCafeBalance();
    store.loadCafeStocks();
    store.loadCafeShopItems();
    store.loadCafeAbilities();
  },
  setCustomers: (customers) => set({ customers }),
  loadCustomers: () => {
    const { setCustomers } = get();
    const cs = cafeController.getCustomers();
    setCustomers(cs);
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
}));

export default CafeGameStore;
