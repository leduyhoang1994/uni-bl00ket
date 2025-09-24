import RenderIf from "@/utils/condition-render";
import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import { useEffect, useState } from "react";
import QuizStore from "@/stores/quiz-store/quiz-store";
import CustomerDesk from "./screens/customer-desk/customer-desk";
import { useParams } from "react-router";
import { getCafeControllerInstance } from "../cafe-game/cafe-controller.singleton";
import initSocketClient from "@/utils/socket-client.util";
import HostController from "@/host/controllers/host.controller";
import { ABILITY_ID } from "@/model/model";
import { Player } from "@common/types/host.type";
import ChoosePlayerTarget from "../cafe-game/screens/choose-player-target/choose-player-target";
import PopupAbilities from "../cafe-game/components/popup-abilities/popup-abilities";
import PopupAbilitiesHealth from "../cafe-game/components/popup-abilities/popup-abilities-health";

export default function CafeGameReact() {
  const {
    toggleVisitShop,
    loadCafeData,
    loadCafeStocks,
    loadCafeBalance,
    isChoosingAbilityTarget,
  } = CafeGameStore();
  const { toggleQuizContainer } = QuizStore();
  const [controllerLoaded, setControllerLoaded] = useState(false);
  const { hostId } = useParams();
  const [abilitiesObj, setAbilitiesObj] = useState<any>({
    abilityId: ABILITY_ID.PAYCHECK_BONUS,
    player: {} as Player,
    isOpen: false,
  });
  const [healthPopupObj, setHealthPopupObj] = useState({
    player: {} as Player,
    isOpen: false,
  });

  function toggleAbilityPopup(abilityId: ABILITY_ID, player: Player) {
    setAbilitiesObj({
      abilityId: abilityId,
      player: player,
      isOpen: true,
    });
  }

  function toggleBlockingScreen(player: Player) {
    setHealthPopupObj({
      player: player,
      isOpen: true,
    })
  }

  const timeBlockEnd = () => {
    setHealthPopupObj({
      player: {} as Player,
      isOpen: false
    });
  }

  useEffect(() => {
    (async () => {
      const token = await HostController.getAccessToken();

      if (!hostId || !token) {
        return;
      }

      const controller = getCafeControllerInstance(hostId);
      controller.onActivePayCheckBonus = (player) => {
        loadCafeBalance();
        toggleAbilityPopup(ABILITY_ID.PAYCHECK_BONUS, player);
      };

      controller.onActiveTrashTheFood = (player) => {
        loadCafeStocks();
        toggleAbilityPopup(ABILITY_ID.TRASH_THE_FOOD, player);
      };

      controller.onActiveTaxes = (player) => {
        loadCafeBalance();
        toggleAbilityPopup(ABILITY_ID.TAXES, player);
      };

      controller.onActiveHealthInspection = (player) => {
        toggleBlockingScreen(player);
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
      {/* <RenderIf condition={!toggleQuizContainer}>
        <CustomerDesk />
      </RenderIf>
      <QuestionScreen />
      <RenderIf condition={toggleVisitShop}>
        <UpgradesScreen />
      </RenderIf>
      <RenderIf condition={isChoosingAbilityTarget !== null}>
        <ChoosePlayerTarget abilityId={isChoosingAbilityTarget as ABILITY_ID} />
      </RenderIf>
      <RenderIf condition={abilitiesObj.isOpen}>
        <PopupAbilities abilitiesObj={abilitiesObj} setAbilitiesObj={setAbilitiesObj} />
      </RenderIf>
      <RenderIf condition={healthPopupObj.isOpen}>
        <PopupAbilitiesHealth timeBlockEnd={timeBlockEnd} healthPopupObj={healthPopupObj} />
      </RenderIf> */}
    </RenderIf>
  );
}
