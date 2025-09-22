import { LayoutContainer, TilingSprite } from "@pixi/layout/components";
import { useExtend } from "@pixi/react";
import { Assets, Sprite, Texture } from "pixi.js";
import TargetEnemy from "../../components/target-enemy/target-enemy";
import { useLayoutEffect } from "react";
import HostController from "@/host/controllers/host.controller";
import { useParams } from "react-router";
import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import { ABILITY_ID } from "@/model/model";
import HostStore from "@/stores/host-store/host-store";
import { DESIGN_VIEWPORT } from "@/games/application";

export default function ChoosePlayerTarget({
  abilityId,
}: {
  abilityId: ABILITY_ID;
}) {
  useExtend({ LayoutContainer });
  const playerTargetWidth = DESIGN_VIEWPORT.width;
  const playerTargetHeight = DESIGN_VIEWPORT.height;
  const textureWall = Assets.get("back-ground-row");
  const { hostId } = useParams();
  const { setPlayers, players } = CafeGameStore();
  const { userInfo } = HostStore();

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
    <layoutContainer
      layout={{
        width: playerTargetWidth,
        height: playerTargetHeight,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
      background={
        textureWall !== Texture.EMPTY
          ? new TilingSprite({
            texture: textureWall,
            width: playerTargetWidth,
            height: playerTargetHeight,
          })
          : new Sprite(Texture.WHITE)
      }
    >
      <layoutContainer
        layout={{
          width: playerTargetWidth,
          height: playerTargetHeight,
          backgroundColor: "transparent",
          display: "flex",
          flexDirection: "column",
          gap: 50,
          paddingTop: "60",
        }}
      >
        <layoutContainer
          label="Cover target enemy"
          layout={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: playerTargetWidth,
            backgroundColor: "transparent",
          }}
        >
          <pixiText
            text={"Choose a Player To Target"}
            style={{
              fontSize: 60,
              fontWeight: "700",
              fill: "#118891",
              fontFamily: "Titan One, sans-serif",
            }}
            layout
            resolution={2}
          />
        </layoutContainer>
        <layoutContainer
          layout={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 15,
          }}
        >
          {
            players.map((player) => (
              <TargetEnemy
                key={player.id}
                player={player}
                abilityId={abilityId}
              />
            ))
          }
        </layoutContainer >
      </layoutContainer >
    </layoutContainer >
  );
}
