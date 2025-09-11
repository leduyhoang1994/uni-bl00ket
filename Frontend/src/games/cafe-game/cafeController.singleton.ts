import CafeController from "@/bases/controllers/cafe.controller";
let instance: CafeController | null = null;
export const getCafeControllerInstance = (): CafeController => {
  if (!instance) {
    instance = new CafeController();
  }

  return instance;
};