import '@pixi/layout/react';
import '@pixi/layout';
import { LayoutContainer } from '@pixi/layout/components';
import { fitRepeatTexture } from "@/utils/fit-repeat-texture";
import { useApplication, useExtend } from "@pixi/react"
import { Assets, Container, Graphics, Sprite, Text, Texture, TilingSprite } from "pixi.js";
import RenderIf from '@/utils/condition-render';
import CafeGameStore from '@/games/stores/cafe-game-store/cafe-game-store';
import RibonUpgrade from './ribon-upgrade';
import RibonMoney from './ribon-money';

export default function HeaderUpgradeScreen() {
  useExtend({ Sprite, Graphics, Text, TilingSprite, LayoutContainer, Container });
  const { app } = useApplication();
  const { toggleAbilitiShop } = CafeGameStore();
  const textureCurtain = !toggleAbilitiShop ? Assets.get("curtain") : Assets.get("curtain-abilities");
  const curtainSpriteWidth = app.screen.width;
  const curtainSpriteHeight = app.screen.height / 5;
  const ribonUpgradeSpriteWidth = app.screen.width / 3.1;
  const ribonUpgradeSpriteHeight = curtainSpriteHeight / 1.3;
  const tilingProps = fitRepeatTexture(textureCurtain, curtainSpriteWidth, curtainSpriteHeight);
  return (
    <>
      <layoutContainer
        key={textureCurtain !== Texture.EMPTY ? "curtain-bg" : "curtain-bg-white"}
        layout={{
          width: curtainSpriteWidth,
          height: curtainSpriteHeight,
          justifyContent: 'space-between'
        }}
      >
        <RenderIf condition={textureCurtain !== Texture.EMPTY}>
          <pixiContainer layout={{}}>
            <pixiTilingSprite
              texture={textureCurtain}
              {...tilingProps}
            />
          </pixiContainer>
        </RenderIf>

        <layoutContainer
          layout={{
            width: curtainSpriteWidth,
            height: curtainSpriteHeight,
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <RibonUpgrade
            ribonUpgradeSpriteWidth={ribonUpgradeSpriteWidth}
            ribonUpgradeSpriteHeight={ribonUpgradeSpriteHeight} />
          <RibonMoney
            ribonUpgradeSpriteHeight={ribonUpgradeSpriteHeight}
            ribonUpgradeSpriteWidth={ribonUpgradeSpriteWidth} />
        </layoutContainer>
      </layoutContainer >
    </>
  );
}
