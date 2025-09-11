import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import { Assets } from "pixi.js";

export default function RibonMoney({
  ribonUpgradeSpriteWidth = 100,
  ribonUpgradeSpriteHeight = 100
}) {
  const { toggleAbilitiShop, cafeBalance } = CafeGameStore();
  const textureRibonMoney = !toggleAbilitiShop ? Assets.get("ribbon-money") : Assets.get("ribbon-money-abilities");

  return (
    <layoutContainer layout={{
      alignItems: 'center',
      width: ribonUpgradeSpriteWidth,
      height: ribonUpgradeSpriteHeight,
    }}>
      <pixiSprite
        texture={textureRibonMoney}
        layout={{
          width: '100%',
          height: '100%'
        }}
      />
      <pixiText
        layout={{
          position: "absolute",
          right: 0,
          marginRight: 20
        }}
        text={`$${cafeBalance}`}
        style={{
          fontSize: 44,
          fontWeight: '900',
          fill: "white"
        }}
        resolution={2}
      />
    </layoutContainer>
  )
}