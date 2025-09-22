import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import ItemScreen, { ItemType } from "./item-screen";
import { LayoutContainer } from "@pixi/layout/components";
import { Sprite } from "pixi.js";
import { useExtend } from "@pixi/react";
import { DESIGN_VIEWPORT } from "@/games/application";

export default function ItemsShop() {
  useExtend({ LayoutContainer, Sprite });
  const { cafeShopItems, cafeStocks } = CafeGameStore();
  return (
    <layoutContainer
      label="Cover items shop"
      layout={{
        position: "absolute",
        width: DESIGN_VIEWPORT.width,
        height: "intrinsic",
        display: 'flex',
        justifyContent: "center"
      }}
    >
      <layoutContainer
        label="Items shop"
        layout={{
          width: 1090,
          display: 'flex',
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 30,
          paddingTop: 20,
        }}
      >
        {cafeStocks.map((dataStock, i) => {
          const enabled = cafeShopItems[i].enabled;

          const currentReward = dataStock.enabled
            ? dataStock.rewardPrices[dataStock.currentIndexLevel]
            : 0;
          const nextReward = dataStock.enabled
            ? dataStock.rewardPrices[dataStock.currentIndexLevel + 1]
            : dataStock.rewardPrices[dataStock.currentIndexLevel];

          const description = `$${currentReward} ${nextReward ? "→" : ""} ${"$" + nextReward
            }`;
          const max =
            dataStock.currentIndexLevel === dataStock.rewardPrices.length - 1;
          const price = dataStock.enabled
            ? dataStock.sellPrices[dataStock.currentIndexLevel + 1]
            : dataStock.sellPrices[dataStock.currentIndexLevel];

          return (
            <ItemScreen
              key={i}
              {...dataStock}
              priceSell={max ? "MAX" : price}
              enabled={enabled}
              type={ItemType.SHOP}
              description={max ? `$${currentReward}` : description}
            // itemWidth={DESIGN_VIEWPORT.width / 5}
            // itemHeight={DESIGN_VIEWPORT.height / 8.5}
            />
          );
        })}
      </layoutContainer>
    </layoutContainer>
  );
}
