import { LayoutContainer } from "@pixi/layout/components";
import { useExtend } from "@pixi/react"
import AudioMuteScreen from "../audio-screen/audio-mute-screen";
import SettingGameHeader from "./setting-game-header";
import { DESIGN_VIEWPORT } from "@/games/application";

export default function SettingGameScreen() {
  useExtend({ LayoutContainer });
  const settingWidth = DESIGN_VIEWPORT.width;
  const settingHeight = DESIGN_VIEWPORT.height;

  return (
    <layoutContainer
      layout={{
        width: settingWidth,
        height: settingHeight,
        backgroundColor: "#0009",
      }}
    >
      <layoutContainer
        layout={{
          height: settingHeight,
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