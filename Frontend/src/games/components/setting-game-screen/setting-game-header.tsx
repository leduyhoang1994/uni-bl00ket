import { LayoutContainer } from "@pixi/layout/components"
import { useExtend } from "@pixi/react"
import { Assets } from "pixi.js";

export default function SettingGameHeader() {
  useExtend({ LayoutContainer });
  const settingGameTexture = Assets.get("setting-game");
  const settingCloseIconTexture = Assets.get("setting-close-icon");
  return (
    <layoutContainer
      layout={{
        width: '100%',
        height: 65,
        backgroundColor: "#8c8c8c",
        position: 'relative',
      }}
    >
      <layoutContainer
        layout={{
          width: '100%',
          height: 6,
          position: 'absolute',
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        }}
      />

      <layoutContainer
        layout={{
          width: '100%',
          height: "100%",
          backgroundColor: "transparent",
          display: 'flex',
          alignItems: 'center',
          paddingTop: 5,
          paddingRight: 20,
          paddingBottom: 11,
          paddingLeft: 20,
          gap: 15,
        }}
      >
        <pixiSprite
          texture={settingGameTexture}
          width={40}
          height={40}
          layout
        />
        <pixiText
          text={'Settings'}
          style={{
            fontSize: 32,
            fontWeight: "500",
            fill: "white",
            fontFamily: "Titan One, sans-serif",
          }}
          resolution={2}
          layout
        />
        <pixiSprite
          texture={settingCloseIconTexture}
          width={40}
          height={60}
          layout={{
            width: 40,
            height: 60,
            justifyContent: 'flex-end',
            marginLeft: 'auto',
          }}
        />
      </layoutContainer>
    </layoutContainer>
  )
}