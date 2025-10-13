import CafeController from "@/bases/controllers/cafe.controller";
import { Question } from "@common/types/game.type";
let instance: CafeController | null = null;
export const getCafeControllerInstance = (hostId?: string, questions: Question[] = []): CafeController => {
  if (!instance) {
    if (!hostId) {
      throw new Error("HostId is required");
    }
    
    instance = new CafeController(hostId, questions);
  }

  return instance;
};
