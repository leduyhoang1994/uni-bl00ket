import "@pixi/layout/react";
import "@pixi/layout";
import { LayoutContainer } from "@pixi/layout/components";
import { useExtend } from "@pixi/react";
import { Assets, Sprite, Texture } from "pixi.js";
import RenderIf from "@/utils/condition-render";
import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import React from "react";
import ItemsAbilities from "./items-abilities";
import ItemsShop from "./items-shop";

const BodyUpgradeScreen = () => {
  useExtend({ LayoutContainer, Sprite });
  const { toggleAbilitiShop } = CafeGameStore();

  const textureWallShop = Assets.get("wall-shop");

  return (
    <layoutContainer
      layout={{
        flex: 1,
        gap: 200,
        position: "relative",
      }}
    >
      <RenderIf condition={textureWallShop !== Texture.EMPTY}>
        <layoutContainer
          layout={{
            width: "50%",
          }}
        >
          <pixiSprite
            texture={textureWallShop}
            layout={{
              width: "100%",
              height: "100%",
            }}
          />
        </layoutContainer>
        <layoutContainer
          layout={{
            width: "50%",
          }}
        >
          <pixiSprite
            texture={textureWallShop}
            layout={{
              width: "100%",
              height: "100%",
            }}
            scale={{ x: -1, y: 1 }}
          />
        </layoutContainer>
      </RenderIf>
      <RenderIf condition={!toggleAbilitiShop}>
        <ItemsShop />
      </RenderIf>
      <RenderIf condition={toggleAbilitiShop}>
        <ItemsAbilities />
      </RenderIf>
    </layoutContainer>
  );
};

export default React.memo(BodyUpgradeScreen);
