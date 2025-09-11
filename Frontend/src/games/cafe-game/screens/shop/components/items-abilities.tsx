import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import ItemScreen, { ItemType } from "./item-screen";
import { useExtend } from "@pixi/react";
import { LayoutContainer } from "@pixi/layout/components";
import { Sprite } from "pixi.js";

export default function ItemsAbilities() {
  useExtend({ LayoutContainer, Sprite });
  const { cafeAbilitiesItems } = CafeGameStore();
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
      {cafeAbilitiesItems.map((item, i) => {
        const enabled = item.enabled;
        const price = item.price;
        return (
          <ItemScreen
            key={i}
            {...item}
            itemWidth={300}
            itemHeight={130}
            rotation={true}
            disablePlate={true}
            enabled={enabled}
            priceSell={price}
            type={ItemType.ABILITIES}
          />
        );
      })}
    </layoutContainer>
  )
}