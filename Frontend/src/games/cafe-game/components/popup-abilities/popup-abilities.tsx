import PopupLayout from "@/games/components/popup-layout/popup-layout";
import { LayoutContainer, LayoutHTMLText, LayoutSprite } from "@pixi/layout/components";
import { useExtend } from "@pixi/react"
import { Assets } from "pixi.js";
import ButtonLayout from "../button-screen/button-layout";
import { usePixiTexture } from "@/games/hooks/use-pixi-texture";
import { ABILITIES, ABILITY_ID } from "@/model/model";

export default function PopupAbilities({
  abilitiesObj = {
    abilityId: ABILITY_ID.PAYCHECK_BONUS,
    player: {
      avatar: '',
      username: '',
    }
  },
  setAbilitiesObj = ({ }) => { },
}) {
  useExtend({ LayoutContainer, LayoutHTMLText, LayoutSprite });
  const currentData = ABILITIES.find(item => item.id === abilitiesObj.abilityId);
  const currentImg = currentData?.image;
  const currentDescriptionEnemy = currentData?.descriptionEnemy;
  const abilitiesTexture = Assets.get(`${currentImg}`);
  const avatarTexture = usePixiTexture(`${abilitiesObj.player.avatar}`);
  const username = abilitiesObj.player.username;

  const doClickBtnAccept = () => {
    setAbilitiesObj({});
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
          <layoutSprite
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
            maxWidth: 480,
          }}
        >
          <pixiSprite
            layout={{
              width: 35,
              height: 35,
              objectFit: "contain",
            }}
            texture={avatarTexture}
          />
          <layoutHTMLText
            text={`<b>${username}</b> ${currentDescriptionEnemy}`}
            style={{
              fontSize: 32,
              fill: "black",
              wordWrap: true,
              align: "center",
            }}
            layout={{
              width: 420,
              height: 'intrinsic',
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