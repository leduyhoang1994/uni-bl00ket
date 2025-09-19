import { LayoutContainer } from "@pixi/layout/components";
import { useExtend } from "@pixi/react";
import ButtonLayout from "../button-screen/button-layout";
import { Assets } from "pixi.js";
import { Player } from "@common/types/host.type";
import { ABILITY_ID } from "@/model/model";
import { getCafeControllerInstance } from "../../cafe-controller.singleton";
import { useParams } from "react-router";
import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";

export default function TargetEnemy({
  layoutWidth = 250,
  layoutHeight = 100,
  player,
  abilityId,
}: {
  layoutWidth?: number;
  layoutHeight?: number;
  player: Player;
  abilityId: ABILITY_ID;
}) {
  useExtend({ LayoutContainer });
  const userTexture = Assets.get(`cust-alpaca`);
  const { hostId } = useParams();
  const { setIsChoosingAbilityTarget, loadCafeAbilities, loadCafeBalance } = CafeGameStore();

  const doClickBtn = async () => {
    if (!hostId) return;

    const controller = getCafeControllerInstance(hostId);

    controller.buyAbilityItem(abilityId, player.id);

    loadCafeAbilities();
    loadCafeBalance();

    setIsChoosingAbilityTarget(null);
  };

  const targetEnemyScreen = () => {
    return (
      <layoutContainer
        layout={{
          display: "flex",
          gap: 10,
        }}
        interactive={false}
        eventMode="none"
      >
        <pixiSprite
          layout={{
            width: 60,
            height: 60,
            objectFit: "contain",
          }}
          texture={userTexture}
        />
        <layoutContainer
          layout={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
          eventMode="passive"
        >
          <pixiText
            text={player.username}
            style={{
              fontSize: 24,
              fontWeight: "500",
              fill: "white",
            }}
            layout
            resolution={2}
          />
          <pixiText
            text={`$${player.score || 0}`}
            style={{
              fontSize: 24,
              fontWeight: "500",
              fill: "white",
            }}
            layout
            resolution={2}
          />
        </layoutContainer>
      </layoutContainer>
    );
  };

  return (
    <>
      <ButtonLayout
        layoutWidth={layoutWidth}
        layoutHeight={layoutHeight}
        doClickBtn={doClickBtn}
        chilren={targetEnemyScreen()}
      />
    </>
  );
}
