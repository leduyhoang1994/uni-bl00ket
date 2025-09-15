import CafeController from "@/bases/controllers/cafe.controller";
let instance: CafeController | null = null;
export const getCafeControllerInstance = (hostId?: string): CafeController => {
  if (!instance) {
    if (!hostId) {
      throw new Error("HostId is required");
    }
    
    instance = new CafeController(hostId);
  }

  return instance;
};
