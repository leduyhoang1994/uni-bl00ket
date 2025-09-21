import { LayoutContainer } from "@pixi/layout/components";
import { useExtend } from "@pixi/react";
import { Assets, Graphics } from "pixi.js";
import { useState } from "react";

export default function AudioMuteScreen() {
  useExtend({ LayoutContainer });
  const settingAudioMuteTexture = Assets.get("audio-mute");
  const [isOn, setIsOn] = useState(false);
  return (
    <layoutContainer
      layout={{
        width: '100%',
        height: 60,
        backgroundColor: "transparent",
        borderColor: "#dcdcdc",
        borderRadius: 10,
        borderWidth: 2,
        marginTop: 5,
        marginBottom: 5,
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <pixiSprite
        texture={settingAudioMuteTexture}
        width={60}
        height={60}
        layout
      />
      <pixiText
        text={'Mute'}
        style={{
          fontSize: 22,
          fontWeight: "500",
          fill: "#3a3a3a",
          fontFamily: "Nunito, sans-serif",
        }}
        resolution={2}
        layout={{
          marginBottom: 3
        }}
      />
      <layoutContainer>
        <pixiGraphics
          draw={(g: Graphics) => {
            g.clear();
            g.roundRect(0, 0, 60, 30, 15).fill({
              color: isOn ? 0x00c8d4 : 0xd3d3d3,
            });
          }}
        />

        {/* Thumb */}
        <pixiGraphics
          draw={(g: Graphics) => {
            g.clear();
            g.roundRect(isOn ? 32 : 2, 2, 26, 26, 13).fill({
              color: 0xffffff,
            });
          }}
        />
      </layoutContainer>
    </layoutContainer>
  )
}