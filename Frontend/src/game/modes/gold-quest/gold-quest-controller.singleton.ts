import { getGameController } from "@/game/common/game-controller.singleton";
import { GameMode } from "@common/constants/host.constant";
import { Question } from "@common/types/game.type";
import GoldQuestController from "./gold-quest.controller";

export const getGoldQuestControllerInstance = (
  hostId?: string,
  questions: Question[] = []
): GoldQuestController => {
  return getGameController<GameMode.GoldQuest>(GameMode.GoldQuest, hostId, questions);
};
