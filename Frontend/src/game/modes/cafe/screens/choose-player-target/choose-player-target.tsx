import CafeGameStore from "@/game/modes/cafe/store";
import HostController from "@/game/host/controller";
import { ABILITY_ID } from "@/game/modes/cafe/model";
import HostStore from "@/game/host/store";
import { useLayoutEffect } from "react";
import { useParams } from "react-router";
import TargetEnemy from "./components/target-enemy";
import { Player } from "@common/types/host.type";
import { getCafeControllerInstance } from "../../cafe-controller.singleton";
import "./choose-player-target.scss";
import RenderIf from "@/game/common/utils/condition-render";
import ButtonCafeGame from "../../components/button-cafe-game/button-cafe-game";

export default function ChoosePlayerTarget({
  abilityId,
}: {
  abilityId: ABILITY_ID;
}) {
  const { hostId } = useParams();
  const {
    setPlayers,
    players,
    setIsChoosingAbilityTarget,
    loadCafeAbilities,
    loadCafeBalance,
    setToggleLeaderBoard,
  } = CafeGameStore();
  const { userInfo } = HostStore();

  const doClickBtn = async (player: Player) => {
    if (!hostId) return;

    const controller = getCafeControllerInstance(hostId);

    controller.buyAbilityItem(abilityId, player.id);

    loadCafeAbilities();
    loadCafeBalance();

    setIsChoosingAbilityTarget(null);
  };

  useLayoutEffect(() => {
    (async () => {
      if (!hostId || !userInfo) return;

      const controller = await HostController.getInstance();
      await controller.initHttp();

      const playerData = (await controller.getPlayers(hostId)).filter(
        (player) => player.id !== userInfo.id
      );
      setPlayers(playerData);
    })();
  }, []);

  return (
    <div className="choose-player-target">
      <div className="choose-player-target__menu">
        <img
          src="/images/cafe-game/leader-board.svg"
          onClick={() => setToggleLeaderBoard(true)}
          alt=""
        />
      </div>
      <div className="choose-player-target__text">
        Choose a Player to Target
      </div>
      <div className="choose-player-target__cover-enemy">
        {players.map((player) => {
          return (
            <div key={player.id} onPointerUp={() => doClickBtn(player)}>
              <TargetEnemy {...player} />
            </div>
          );
        })}
        <RenderIf condition={!players.length}>
          <div style={{ marginTop: '2rem' }}>
            <ButtonCafeGame text="Go Back" doClickBtn={() => setIsChoosingAbilityTarget(null)} />
          </div>
        </RenderIf>
      </div>
    </div>
  );
}
