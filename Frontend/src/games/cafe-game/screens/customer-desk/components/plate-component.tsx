import { Assets, Sprite, Texture } from "pixi.js";
import StockComponent from "./stock-component";
import RenderIf from "@/utils/condition-render";
import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import { useApplication } from "@pixi/react";
import { useEffect } from "react";
import gsap from "gsap";

export default function PlateComponent({
  i = 0,
  x = 0,
  y = 0,
  plateWidth = 100,
  plateHeight = 100,
  enabled = false,
  quantity = 0,
  textureItem = Assets.get("blook-toast") as Texture,
  plateData = {} as any,
  plateLevel = 0,
  globPos = { x: 0, y: 0 },
}) {
  const texturePlate = Assets.get("plate");
  const { serveAnimates, removeServeAnimatesByIndex } = CafeGameStore();

  const { app } = useApplication();

  useEffect(() => {
    const foundStock = serveAnimates.find((a) => a.stockId == plateData.id);

    if (!foundStock) {
      return;
    }

    const foundStockIdx = serveAnimates.findIndex(
      (a) => a.stockId == plateData.id
    );
    removeServeAnimatesByIndex(foundStockIdx);

    for (let i = 0; i < foundStock.quantity; i++) {
      setTimeout(() => {
        const food = new Sprite({ texture: textureItem });
        food.anchor.set(0.5);
        food.scale.set(0.6, 0.57);
        food.alpha = 1;
        app.stage.addChild(food);

        food.position = {
          x: globPos.x + plateWidth / 2,
          y: globPos.y + plateHeight / 2,
        };
        const duration = 0.5;

        gsap.to(food, {
          duration: duration,
          x: foundStock.position.x,
          y: foundStock.position.y,
          alpha: 0.5,
          onComplete: () => {
            app.stage.removeChild(food);
          },
        });

        gsap.to(food.scale, {
          duration: duration,
          x: 0.1,
          y: 0.1,
          onComplete: () => {
            app.stage.removeChild(food);
          },
        });
      }, i * 100);
    }
  }, [serveAnimates.length]);

  return (
    <>
      <RenderIf condition={!enabled}>
        <pixiSprite
          key={i}
          texture={texturePlate}
          x={x}
          y={y}
          width={plateWidth}
          height={plateHeight}
        />
      </RenderIf>
      <RenderIf condition={enabled}>
        <pixiContainer label="Plate active" x={x} y={y}>
          <StockComponent
            quantity={quantity}
            plateWidth={plateWidth}
            plateHeight={plateHeight}
            textureItem={textureItem}
            plateLevel={plateLevel}
          />
        </pixiContainer>
      </RenderIf>
    </>
  );
}
