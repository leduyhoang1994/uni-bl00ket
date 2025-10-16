import RenderIf from "@/game/common/utils/condition-render";
import CafeGameStore from "@/game/modes/cafe/store";
import { useEffect, useState } from "react";
import QuizStore from "@/game/common/components/quiz/store";
import CustomerDesk from "./screens/customer-desk/customer-desk";
import { useParams } from "react-router";
import { getCafeControllerInstance } from "./cafe-controller.singleton";
import initSocketClient from "@/game/common/utils/socket-client.util";
import HostController from "@/game/host/controller";
import { ABILITY_ID } from "@/game/modes/cafe/model";
import { Player } from "@common/types/host.type";
import ChoosePlayerTarget from "./screens/choose-player-target/choose-player-target";
import PopupAbilities from "./components/popup-abilities/popup-abilities";
import PopupAbilitiesHealth from "./components/popup-abilities/popup-abilities-health";
import ShopContainer from "./screens/shop/shop-container";
import AbilitiesContainer from "./screens/abilities/abilities-container";
import PlayerLeaderboard from "./components/player-leaderboard/player-leaderboard";
import "./styles/cafe.scss";
import Quiz from "@/game/common/components/quiz/quiz";

export default function Cafe() {
  const {
    toggleVisitShop,
    loadCafeData,
    loadCafeStocks,
    loadCafeBalance,
    isChoosingAbilityTarget,
    toggleAbilitiShop,
    toggleLeaderBoard,
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
    });
  }

  const timeBlockEnd = () => {
    setHealthPopupObj({
      player: {} as Player,
      isOpen: false,
    });
  };

  useEffect(() => {
    (async () => {
      const token = await HostController.getAccessToken();
      const hostController = await HostController.getInstance();

      if (!hostId || !token) {
        return;
      }

      const controller = getCafeControllerInstance(
        hostId,
        hostController.getQuestions()
      );
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
      <RenderIf
        condition={
          !toggleQuizContainer && !toggleVisitShop && !toggleAbilitiShop
        }
      >
        <CustomerDesk />
      </RenderIf>
      <Quiz />
      <RenderIf condition={toggleVisitShop}>
        <ShopContainer />
      </RenderIf>
      <RenderIf condition={toggleAbilitiShop}>
        <AbilitiesContainer />
      </RenderIf>
      <RenderIf condition={isChoosingAbilityTarget !== null}>
        <ChoosePlayerTarget abilityId={isChoosingAbilityTarget as ABILITY_ID} />
      </RenderIf>
      <RenderIf condition={abilitiesObj.isOpen}>
        <PopupAbilities
          abilitiesObj={abilitiesObj}
          setAbilitiesObj={setAbilitiesObj}
        />
      </RenderIf>
      <RenderIf condition={healthPopupObj.isOpen}>
        <PopupAbilitiesHealth
          timeBlockEnd={timeBlockEnd}
          healthPopupObj={healthPopupObj}
        />
      </RenderIf>
      <div className="cafe-game__serve-animations-container"></div>
      <RenderIf condition={toggleLeaderBoard}>
        <PlayerLeaderboard />
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
