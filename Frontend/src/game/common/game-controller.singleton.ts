import { GameMode } from "@common/constants/host.constant";
import { Question } from "@common/types/game.type";
import CafeController from "../modes/cafe/cafe.controller";
import GoldQuestController from "../modes/gold-quest/gold-quest.controller";
import GameController from "./game.controller";

let instance: GameController | null = null;

type GameControllerMapType = {
  [GameMode.Cafe]: CafeController;
  [GameMode.GoldQuest]: GoldQuestController;
};

const GameControllerMap = new Map<GameMode, typeof GameController>([
  [GameMode.Cafe, CafeController],
  [GameMode.GoldQuest, GoldQuestController],
]);

export function getGameController<T extends GameMode>(
  gameMode?: GameMode,
  hostId?: string,
  questions: Question[] = []
): GameControllerMapType[T] {
  if (instance) {
    return instance as GameControllerMapType[T];
  }

  if (!gameMode) {
    throw new Error("gameMode is required");
  }

  if (!hostId) {
    throw new Error("HostId is required");
  }

  const gameClass = GameControllerMap.get(gameMode);

  if (!gameClass) {
    throw new Error("Game class not found");
  }

  instance = new gameClass(hostId, questions);

  return instance as GameControllerMapType[T];
}
