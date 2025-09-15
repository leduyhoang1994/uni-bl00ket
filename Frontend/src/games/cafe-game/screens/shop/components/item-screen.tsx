import "@pixi/layout/react";
import "@pixi/layout";
import { LayoutContainer } from "@pixi/layout/components";
import { useExtend } from "@pixi/react";
import { Assets, Graphics, Sprite, Texture } from "pixi.js";
import RenderIf from "@/utils/condition-render";
import React, { useCallback } from "react";
import { getCafeControllerInstance } from "@/games/cafe-game/cafe-controller.singleton";
import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";

export enum ItemType {
  SHOP = "SHOP",
  ABILITIES = "ABILITIES",
}

const ItemScreen = ({
  name = "Toast",
  priceSell = 0,
  description = "",
  image = "",
  disablePlate = false,
  itemWidth = 250,
  itemHeight = 120,
  rotation = false,
  enabled = false,
  id = 0,
  type = ItemType.SHOP,
  currentIndexLevel = 0,
}) => {
  useExtend({ LayoutContainer, Sprite, Graphics });
  const {
    loadCafeBalance,
    loadCafeAbilities,
    loadCafeShopItems,
    loadCafeStocks,
  } = CafeGameStore();

  const plateLevelArr = [
    Assets.get("plate-active"),
    Assets.get("plate-level-2"),
    Assets.get("plate-level-3"),
    Assets.get("plate-level-4"),
    Assets.get("plate-level-5"),
    Assets.get("plate-level-5"),
  ];
  const textureItem = Assets.get(image);
  const borderColor = enabled ? "#0e6b71" : "#4d4d4d";
  const shadowColor = enabled ? "#118891" : "#5a5a5a";
  const mainColor = enabled ? "#099faa" : "#757575";
  const textColor = enabled ? "white" : "#3a3a3a";
  const borderWidth = 4;

  const itemRadius = 10;
  const shadowHeight = 5;
  const widthPlate = 100;
  const heightPlate = 100;
  const defaultActive = {
    interactive: true,
    eventMode: "static",
    cursor: "pointer",
    onClick: () => doClickBuyItem(),
  };

  const activeObj = enabled ? defaultActive : {};

  const drawItem = useCallback(
    (g: Graphics) => {
      g.clear();
      g.roundRect(0, 0, itemWidth, itemHeight, itemRadius).fill({
        color: borderColor,
      });
      g.roundRect(
        borderWidth,
        borderWidth,
        itemWidth - borderWidth * 2,
        itemHeight - borderWidth * 2,
        itemRadius - borderWidth
      ).fill({ color: shadowColor });
      g.roundRect(
        borderWidth,
        borderWidth,
        itemWidth - borderWidth * 2,
        itemHeight - borderWidth * 2 - shadowHeight,
        itemRadius - borderWidth
      ).fill({ color: mainColor });
    },
    [
      itemWidth,
      itemHeight,
      itemRadius,
      mainColor,
      borderColor,
      shadowColor,
      shadowHeight,
      borderWidth,
    ]
  );

  const doClickBuyItem = () => {
    const cafeController = getCafeControllerInstance();
    if (type == ItemType.SHOP) {
      cafeController.buyShopItem(String(id));
      loadCafeShopItems();
    }
    if (type == ItemType.ABILITIES) {
      cafeController.buyAbilityItem(id);
      loadCafeAbilities();
    }
    loadCafeStocks();
    loadCafeBalance();
  };

  return (
    <>
      <RenderIf
        condition={
          plateLevelArr[currentIndexLevel] != Texture.EMPTY &&
          textureItem != Texture.EMPTY
        }
      >
        <layoutContainer
          layout={{
            width: itemWidth,
            height: itemHeight,
            flexDirection: "row",
          }}
        >
          <layoutContainer
            layout={{
              width: "100%",
              height: "100%",
            }}
          >
            <pixiGraphics draw={drawItem} />
          </layoutContainer>
          <layoutContainer
            layout={{
              flexDirection: "column",
              alignItems: "flex-end",
              justifyContent: "flex-start",
              width: itemWidth / 2,
              paddingRight: 10,
              paddingTop: 15,
            }}
          >
            <pixiText
              text={name}
              layout={{}}
              style={{
                fontSize: 18,
                fontWeight: "700",
                fill: textColor,
              }}
              anchor={0.5}
              resolution={2}
            />
            <pixiText
              text={description}
              layout={{
                marginTop: 0,
                objectFit: "contain",
                objectPosition: "right",
                width: 200,
              }}
              style={{
                fontSize: 14,
                fontWeight: "700",
                fill: textColor,
                wordWrap: true,
                wordWrapWidth: 200,
                align: "right",
              }}
              anchor={0.5}
              resolution={2}
            />
            <pixiText
              text={`$${priceSell}`}
              layout={{
                marginTop: 10,
              }}
              style={{
                fontSize: 30,
                fontWeight: "700",
                fill: textColor,
              }}
              anchor={0.5}
              resolution={2}
            />
          </layoutContainer>
          <layoutContainer
            layout={{
              position: "absolute",
              width: widthPlate,
              height: heightPlate,
              left: -20,
              top: (itemHeight - heightPlate) / 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <RenderIf condition={!disablePlate}>
              <pixiSprite
                texture={plateLevelArr[currentIndexLevel]}
                layout={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </RenderIf>
            <pixiSprite
              texture={textureItem}
              rotation={rotation ? -0.25 : 0}
              layout={{
                width: !disablePlate ? "65%" : "90%",
                height: !disablePlate ? "70%" : "90%",
                position: "absolute",
                marginBottom: 5,
                marginLeft: rotation ? 10 : 0,
              }}
            />
          </layoutContainer>
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.roundRect(0, 0, itemWidth, itemHeight).fill({
                color: "0x000000",
                alpha: 0,
              });
            }}
            {...activeObj}
          />
        </layoutContainer>
      </RenderIf>
    </>
  );
};

export default React.memo(ItemScreen);
