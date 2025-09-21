import { LayoutContainer } from "@pixi/layout/components";
import { useApplication, useExtend } from "@pixi/react"
import { Assets } from "pixi.js";
import AudioMuteScreen from "../audio-screen/audio-mute-screen";
import SettingGameHeader from "./setting-game-header";

export default function SettingGameScreen() {
  useExtend({ LayoutContainer });
  const { app } = useApplication();

  return (
    <layoutContainer
      layout={{
        height: app.screen.height,
        width: app.screen.width,
        backgroundColor: "#0009",
      }}
    >
      <layoutContainer
        layout={{
          height: app.screen.height,
          width: 400,
          backgroundColor: '#f7f7f7',
          position: 'absolute',
          right: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <SettingGameHeader />
        <layoutContainer
          layout={{
            flex: 1,
            width: '100%',
            backgroundColor: "transparent",
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <pixiText
            text={'Volume'}
            style={{
              fontSize: 28,
              fontWeight: "700",
              fill: "#3a3a3a",
              fontFamily: "Nunito, sans-serif",
            }}
            resolution={2}
            layout={{
              marginTop: 10,
              marginLeft: 10,
              marginRight: 10,
            }}
          />
          <AudioMuteScreen />
        </layoutContainer>
      </layoutContainer>
    </layoutContainer>
  )
}