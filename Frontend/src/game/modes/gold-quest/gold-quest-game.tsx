import Quiz from "@/game/common/components/quiz/quiz";
import { useCallback, useLayoutEffect, useState } from "react";
import GoldQuestController, { Chests } from "./gold-quest.controller";
import QuizStore from "@/game/common/components/quiz/store";
import { useParams } from "react-router";
import HostController from "@/game/host/controller";
import { getGoldQuestControllerInstance } from "./gold-quest-controller.singleton";
import initSocketClient from "@/game/common/utils/socket-client.util";
import UniButton from "@/game/common/components/buttons/uni-button";
import GoldQuestStore from "./store";
import HostStore from "@/game/host/store";

export default function GoldQuest() {
  const [goldQuestController, setGoldQuestController] =
    useState<GoldQuestController | null>(null);
  const [chestsToChoose, setChestsToChoose] = useState<Array<Chests>>([]);

  const { setGold, gold } = GoldQuestStore();
  const { setToggleQuizContainer, setCurrentQuestion, reloadStore } =
    QuizStore();
  const { hostId } = useParams();
  const { userInfo } = HostStore();

  const loadNewQuestion = useCallback(async () => {
    const controller = getGoldQuestControllerInstance();
    const newQuestion = controller.getQuestion();
    setCurrentQuestion(newQuestion);
    setToggleQuizContainer(true);
  }, []);

  const openChest = useCallback(async (chestIndex: number) => {
    if (!hostId || !userInfo) {
      return;
    }

    // TODO: Đoạn này cần làm lại cho giống flow trong game
    const controller = getGoldQuestControllerInstance();
    const hostController = await HostController.getInstance();
    const chest = controller.getChestByIndex(chestIndex);

    if (!chest) {
      return;
    }

    const requireChoosePlayer = controller.requireChooseTarget(chest);

    if (requireChoosePlayer) {
      // TODO: Hiển thị màn chọn player, sau khi chọn player mới gọi hàm này
      let players = await hostController.getPlayers(hostId);
      players = players.filter((player) => player.id !== userInfo.id); // Loại player đang chơi ra khỏi danh sách chọn

      // Lấy user ngẫu nhiên để test
      players = players.sort(() => Math.random() - 0.5);
      controller.openChest(chest, players[0]);
    }

    if (!requireChoosePlayer) {
      controller.openChest(chest);
    }
    loadNewQuestion();
  }, []);

  useLayoutEffect(() => {
    (async () => {
      const token = await HostController.getAccessToken();
      const hostController = await HostController.getInstance();

      if (!hostId || !token) {
        return;
      }

      const controller = getGoldQuestControllerInstance(
        hostId,
        hostController.getQuestions()
      );

      setGoldQuestController(controller);

      controller.onGoldUpdate = (gold) => setGold(gold);
      controller.onGoldStealActive = (player, gold) => {
        alert(`Player ${player.username} has stolen ${gold} gold from you.`);
      };

      const socket = initSocketClient(hostId, token, controller);
      controller.setSocketClient(socket);
      await controller.initData();

      loadNewQuestion();
    })();
  }, []);

  const onQuizzDissmiss = useCallback((correct: boolean) => {
    const controller = getGoldQuestControllerInstance();

    if (correct) {
      setChestsToChoose(controller.loadRandomChests());
    } else {
      reloadStore();
      setTimeout(() => {
        loadNewQuestion();
      }, 10);
    }
  }, []);
  return (
    <div>
      {goldQuestController && (
        <Quiz
          gameController={goldQuestController}
          onQuizDissmiss={onQuizzDissmiss}
        />
      )}
      User's Gold: {gold}
      <br />
      {chestsToChoose.map((chest, i) => {
        return (
          <UniButton
            onClick={() => {
              openChest(i);
            }}
            text={`Chest ${i + 1}`}
            key={chest}
          />
        );
      })}
    </div>
  );
}
