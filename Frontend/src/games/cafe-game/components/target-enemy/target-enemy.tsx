import { LayoutContainer } from "@pixi/layout/components";
import { useExtend } from "@pixi/react";
import ButtonLayout from "../button-screen/button-layout";
import { Assets } from "pixi.js";

export default function TargetEnemy({
  layoutWidth = 250,
  layoutHeight = 100,
}) {
  useExtend({ LayoutContainer });
  const userTexture = Assets.get(`cust-alpaca`);

  const doClickBtn = () => {
    console.log('doClickBtn');

  }

  const targetEnemyScreen = () => {
    return (
      <layoutContainer
        layout={{
          display: 'flex',
          gap: 10
        }}
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
            display: 'flex',
            flexDirection: 'column',
            gap: 4
          }}
        >
          <pixiText
            text={'aaa'}
            style={{
              fontSize: 24,
              fontWeight: "500",
              fill: 'white',
            }}
            layout
            resolution={2}
          />
          <pixiText
            text={`$${0}`}
            style={{
              fontSize: 24,
              fontWeight: "500",
              fill: 'white',
            }}
            layout
            resolution={2}
          />

        </layoutContainer>
      </layoutContainer>
    )
  }

  return (
    <>
      <ButtonLayout
        layoutWidth={layoutWidth}
        layoutHeight={layoutHeight}
        doClickBtn={doClickBtn}
        chilren={targetEnemyScreen()}
      />
    </>
  )
}