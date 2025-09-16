import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import ItemScreen, { ItemType } from "./item-screen";
import { LayoutContainer } from "@pixi/layout/components";
import { Sprite } from "pixi.js";
import { useExtend } from "@pixi/react";

export default function ItemsShop() {
  useExtend({ LayoutContainer, Sprite });
  const { cafeShopItems, cafeStocks } = CafeGameStore();
  return (
    <layoutContainer
      layout={{
        position: "absolute",
        width: "100%",
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

        const description = `$${currentReward} ${nextReward ? "→" : ""} ${
          "$" + nextReward
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
          />
        );
      })}
    </layoutContainer>
  );
}
