import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import HostController from "@/host/controllers/host.controller";
import { ABILITY_ID } from "@/model/model";
import HostStore from "@/stores/host-store/host-store";
import { useLayoutEffect } from "react";
import { useParams } from "react-router";
import TagLayout from "../tag/tag-layout";
import SettingAudioReactIcon from "@/games/components/setting-audio-react/setting-audio-react-icon";
import TargetEnemy from "./components/target-enemy";
import { Player } from "@common/types/host.type";
import { getCafeControllerInstance } from "@/games/cafe-game/cafe-controller.singleton";

export default function ChoosePlayerTarget({ abilityId }: { abilityId: ABILITY_ID }) {
  const { hostId } = useParams();
  const { setPlayers, players, setIsChoosingAbilityTarget, loadCafeAbilities, loadCafeBalance } = CafeGameStore();
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
        <img src="/images/cafe-game/leader-board.svg" alt="" />
        <SettingAudioReactIcon />
      </div>
      <div className="choose-player-target__text">
        Choose a Player to Target
      </div>
      <div className="choose-player-target__cover-enemy">
        {
          players.map((player) => {
            return (
              <div key={player.id} onPointerUp={() => doClickBtn(player)}>
                <TargetEnemy {...player} />
              </div>
            )
          })
        }
      </div>
    </div>
  )
}