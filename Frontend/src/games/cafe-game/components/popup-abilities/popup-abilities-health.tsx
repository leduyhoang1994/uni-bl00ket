import { DESIGN_VIEWPORT } from "@/games/application";
import PopupLayout from "@/games/components/popup-layout/popup-layout";
import { LayoutContainer, LayoutHTMLText } from "@pixi/layout/components";
import { useExtend } from "@pixi/react";
import { Assets } from "pixi.js";
import { useEffect, useState } from "react";

interface PopupAbilitiesHealthProps {
  healthPopupObj: {
    player: {
      username: string;
    };
  };
  timeBlockEnd: () => void;
}

export default function PopupAbilitiesHealth({
  healthPopupObj = { player: { username: '' } },
  timeBlockEnd = () => { },
}: PopupAbilitiesHealthProps) {
  useExtend({ LayoutContainer, LayoutHTMLText });
  const popupWidth = DESIGN_VIEWPORT.width;
  const popupHeight = DESIGN_VIEWPORT.height;

  const healthTexture = Assets.get(`abilites-background-health`);
  const username = healthPopupObj.player.username;
  const [countdown, setCountdown] = useState<number>(8);

  useEffect(() => {
    if (countdown <= 0) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      timeBlockEnd();
    }
  }, [countdown, timeBlockEnd]);

  const renderPopupAbilitieHealth = () => {
    return (
      <layoutContainer
        layout={{
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <pixiSprite
          layout={{
            width: popupWidth * 0.9,
            height: popupHeight * 0.9,
            objectFit: "contain",
          }}
          texture={healthTexture}
        />
        <layoutContainer
          layout={{
            position: "absolute",
            display: 'flex',
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            marginTop: 150,
            marginLeft: 80,
          }}
        >
          <layoutContainer
            layout={{
              display: 'flex',
              gap: 10,
            }}
          >
            <pixiText
              text={`${countdown}s`}
              style={{
                fontSize: 35,
                fontWeight: "700",
                fill: "black",
              }}
              layout
              resolution={2}
              x={60}
              y={-3}
            />
            <layoutHTMLText
              text={`until you can resume. Targeted By <b>${username}</b>`}
              style={{
                fontSize: 32,
                fill: "black",
                wordWrap: true,
                align: "center",
                fontWeight: "500",
              }}
              layout={{
                width: 420,
                height: 'intrinsic',
              }}
              resolution={2}
            />
          </layoutContainer>
        </layoutContainer>
      </layoutContainer>
    )
  }
  return (
    <PopupLayout chilren={renderPopupAbilitieHealth()} />
  )
}