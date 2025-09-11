import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import RenderIf from "@/utils/condition-render";
import { Assets, Texture } from "pixi.js";

export default function RibonUpgrade({
  ribonUpgradeSpriteWidth = 100,
  ribonUpgradeSpriteHeight = 100
}) {
  const { toggleAbilitiShop } = CafeGameStore();
  const textureRibonUpgrade = !toggleAbilitiShop ? Assets.get("ribbon-upgrade") : Assets.get("ribbon-upgrade-abilities");

  return (
    <RenderIf condition={textureRibonUpgrade !== Texture.EMPTY}>
      <layoutContainer layout={{
        alignItems: 'center',
        width: ribonUpgradeSpriteWidth,
        height: ribonUpgradeSpriteHeight,
      }}>
        <pixiSprite
          texture={textureRibonUpgrade}
          layout={{
            width: '100%',
            height: '100%'
          }}
        />
        <pixiText
          layout={{
            position: "absolute",
            marginBottom: 30,
            marginLeft: 20
          }}
          text={!toggleAbilitiShop ? 'Upgrades' : 'Abilities'}
          style={{
            fontSize: 44,
            fontWeight: '900',
            fill: "white"
          }}
          resolution={2}
        />
      </layoutContainer>
    </RenderIf>
  )
}