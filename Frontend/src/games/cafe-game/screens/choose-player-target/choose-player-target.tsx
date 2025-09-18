import { LayoutContainer, TilingSprite } from "@pixi/layout/components";
import { useApplication, useExtend } from "@pixi/react";
import { Assets, Sprite, Texture } from "pixi.js";
import TargetEnemy from "../../components/target-enemy/target-enemy";

export default function ChoosePlayerTarget() {
  useExtend({ LayoutContainer });
  const { app } = useApplication();
  const textureWall = Assets.get("back-ground-row");

  const doClickToEnemy = () => {

  }

  return (
    <layoutContainer
      layout={{
        width: app.screen.width,
        height: app.screen.height,
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
            width: app.screen.width,
            height: app.screen.height,
          })
          : new Sprite(Texture.WHITE)
      }
    >
      <layoutContainer
        layout={{
          width: app.screen.width,
          height: app.screen.height,
          backgroundColor: "transparent",
          display: 'flex',
          flexDirection: 'column',
          gap: 50,
          paddingTop: "60"
        }}
      >
        <layoutContainer
          label="Cover target enemy"
          layout={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: "center",
            width: app.screen.width,
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
            gap: 15
          }}
        >
          <TargetEnemy />
          <TargetEnemy />
          <TargetEnemy />
          <TargetEnemy />
          <TargetEnemy />
          <TargetEnemy />
          <TargetEnemy />
        </layoutContainer>
      </layoutContainer>
    </layoutContainer>
  )
}