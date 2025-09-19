import PopupLayout from "@/games/components/popup-layout.tsx/popup-layout";
import { LayoutContainer } from "@pixi/layout/components";
import { useApplication, useExtend } from "@pixi/react";
import { Assets } from "pixi.js";
import { useEffect, useState } from "react";

interface PopupAbilitiesHealthProps {
  toggleHealthPopupModal: {
    player: {
      username: string;
    };
  };
  setToggleHealthPopupModal: (value: any) => void;
}

export default function PopupAbilitiesHealth({
  toggleHealthPopupModal = { player: { username: '' } },
  setToggleHealthPopupModal = () => { },
}: PopupAbilitiesHealthProps) {
  useExtend({ LayoutContainer });
  const { app } = useApplication();
  const healthTexture = Assets.get(`abilites-background-health`);
  const [countdown, setCountdown] = useState<number>(8);

  useEffect(() => {
    if (countdown <= 0) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setToggleHealthPopupModal({})
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

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
            width: app.screen.width * 0.9,
            height: app.screen.height * 0.9,
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
              justifyContent: "center",
              alignItems: "center",
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
            />
            <pixiText
              text={`until you can resume.`}
              style={{
                fontSize: 35,
                fontWeight: "500",
                fill: "black",
              }}
              layout
              resolution={2}
            />
          </layoutContainer>
          <layoutContainer
            layout={{
              display: 'flex',
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            <pixiText
              text={`Targeted By`}
              style={{
                fontSize: 35,
                fontWeight: "500",
                fill: "black",
              }}
              layout
              resolution={2}
            />
            <pixiText
              text={`${toggleHealthPopupModal.player.username}`}
              style={{
                fontSize: 35,
                fontWeight: "700",
                fill: "black",
              }}
              layout
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