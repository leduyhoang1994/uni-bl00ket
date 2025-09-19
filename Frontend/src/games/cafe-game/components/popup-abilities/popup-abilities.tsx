import PopupLayout from "@/games/components/popup-layout.tsx/popup-layout";
import { LayoutContainer } from "@pixi/layout/components";
import { useExtend } from "@pixi/react"
import { Assets } from "pixi.js";
import ButtonLayout from "../button-screen/button-layout";

export default function PopupAbilities({
  abilitiesObj = {
    abilitiesImg: '',
    player: {
      avatar: '',
      username: '',
    }
  },
  setToggleAbilityPopupModal = (value: boolean) => { },
}) {
  useExtend({ LayoutContainer });
  const abilitiesTexture = Assets.get(`${abilitiesObj.abilitiesImg}`);
  // const userAvatar = Assets.get(`${abilitiesObj.player.avatar}`);
  const userTexture = Assets.get(`cust-alpaca`);
  const doClickBtnAccept = () => {
    console.log('doClickBtnAccept');
    setToggleAbilityPopupModal(false);
  }

  const renderTextBtn = () => {
    return (
      <layoutContainer
        layout={{
          width: '100%',
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        eventMode="passive"
      >
        <pixiText
          text={'Okay'}
          style={{
            fontSize: 24,
            fontWeight: "700",
            fill: "white",
          }}
          layout
          resolution={2}
        />
      </layoutContainer>
    )
  }

  const renderPopupAbilities = () => {
    return (
      <layoutContainer
        layout={{
          backgroundColor: "#fff",
          width: 500,
          borderRadius: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          paddingLeft: 10,
          paddingRight: 10,
          gap: 10,
        }}
      >
        <layoutContainer>
          <pixiSprite
            layout={{
              width: 100,
              height: 100,
              objectFit: "contain",
            }}
            texture={abilitiesTexture}
          />
        </layoutContainer>
        <layoutContainer
          layout={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
            maxWidth: 480,
          }}
        >
          <pixiSprite
            layout={{
              width: 35,
              height: 35,
              objectFit: "contain",
            }}
            texture={userTexture}
          />
          <pixiText
            text={`${abilitiesObj.player.username}`}
            style={{
              fontSize: 24,
              fontWeight: "700",
              fill: "black",
            }}
            layout
            resolution={2}
          />
          <pixiText
            text={'just increased your balance by 25%'}
            style={{
              fontSize: 24,
              fontWeight: "400",
              fill: "black",
            }}
            layout={{
              display: "flex",
              flexWrap: "wrap",

            }}

            resolution={2}
          />
        </layoutContainer>
        <ButtonLayout
          layoutHeight={60}
          layoutWidth={100}
          chilren={renderTextBtn()}
          backgroundColor="rgb(11, 194, 207)"
          backgroundColorShadow="rgb(11, 194, 207)"
          doClickBtn={doClickBtnAccept}
        />
      </layoutContainer >
    )
  }
  return (
    <PopupLayout chilren={renderPopupAbilities()} />
  )
}