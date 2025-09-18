import RenderIf from "@/utils/condition-render";
import QuestionScreen from "../components/question-screen/question-screen";
import UpgradesScreen from "./screens/shop/upgrade-screen";
import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import { useEffect, useState } from "react";
import QuizStore from "@/stores/quiz-store/quiz-store";
import CustomerDesk from "./screens/customer-desk/customer-desk";
import { useParams } from "react-router";
import { getCafeControllerInstance } from "./cafe-controller.singleton";
import initSocketClient from "@/utils/socket-client.util";
import HostController from "@/host/controllers/host.controller";

export default function CafeGame() {
  const { toggleVisitShop, loadCafeData } = CafeGameStore();
  const { toggleQuizContainer } = QuizStore();
  const [controllerLoaded, setControllerLoaded] = useState(false);
  const { hostId } = useParams();

  useEffect(() => {
    (async () => {
      const token = await HostController.getAccessToken();

      if (!hostId || !token) {
        return;
      }

      const controller = getCafeControllerInstance(hostId);
      controller.onActivePayCheckBonus = (player) => {

      };

      controller.onActiveTrashTheFood = (player) => {

      };

      controller.onActiveTaxes = (player) => {

      };

      controller.onActiveHealthInspection = (player) => {

      };

      const socket = initSocketClient(hostId, token, controller);
      controller.setSocketClient(socket);
      await controller.initData();
      loadCafeData();
      setControllerLoaded(true);
    })();
  }, []);

  return (
    <RenderIf condition={controllerLoaded}>
      <RenderIf condition={!toggleQuizContainer}>
        <CustomerDesk />
      </RenderIf>
      <QuestionScreen />
      <RenderIf condition={toggleVisitShop}>
        <UpgradesScreen />
      </RenderIf>
    </RenderIf>
  );
}
