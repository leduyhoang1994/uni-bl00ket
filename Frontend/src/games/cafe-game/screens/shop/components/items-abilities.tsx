import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import ItemScreen, { ItemType } from "./item-screen";
import { useExtend } from "@pixi/react";
import { LayoutContainer } from "@pixi/layout/components";
import { Sprite } from "pixi.js";
import { DESIGN_VIEWPORT } from "@/games/application";

export default function ItemsAbilities() {
  useExtend({ LayoutContainer, Sprite });
  const { cafeAbilitiesItems } = CafeGameStore();
  return (
    <layoutContainer
      label="Cover abilities items"
      layout={{
        width: DESIGN_VIEWPORT.width,
        height: "intrinsic",
        display: 'flex',
        backgroundColor: 'transparent',
        position: "absolute",
        justifyContent: 'center'
      }}
    >
      <layoutContainer
        label="Abilities items"
        layout={{

          width: 960,
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
    </layoutContainer>
  )
}