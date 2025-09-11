import RenderIf from "@/utils/condition-render";
import { useExtend } from "@pixi/react";
import { Assets, Graphics, Sprite, Texture } from "pixi.js";
import { useRef } from "react";

export default function StockComponent({
  plateWidth = 100,
  plateHeight = 100,
  itemHeight = 120,
  textureItem = Assets.get("blook-toast") as Texture,
  quantity = 0,
  plateLevel = 0
}) {
  useExtend({ Graphics });

  const plateLevelArr = [
    Assets.get("plate-active"),
    Assets.get("plate-level-2"),
    Assets.get("plate-level-3"),
    Assets.get("plate-level-4"),
    Assets.get("plate-level-5"),
    Assets.get("plate-level-5"),
  ]
  const text = `${quantity}`;
  const fontSize = 14;
  const paddingX = 3;
  const textWidth = text.length * (fontSize * 0.6);
  const boxWidth = textWidth + paddingX * 2;
  const boxHeight = 20;

  const defaultActive = {
    interactive: true,
    eventMode: "static",
    cursor: "pointer",
  };

  const activeObj = quantity > 0 ? defaultActive : {};
  const foodRef = useRef<Sprite>(null);

  const draw = (g: Graphics) => {
    g.clear();
    g.roundRect(0, 0, boxWidth, boxHeight, 5).fill({
      color: "#099faa",
    });
  };

  return (
    <>
      <layoutContainer
        layout={{
          position: "absolute",
          width: plateWidth,
          height: plateHeight,
          left: -20,
          top: (itemHeight - plateHeight) / 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <pixiSprite
          ref={foodRef}
          texture={plateLevelArr[plateLevel]}
          layout={{
            width: "100%",
            height: "100%",
          }}
        />
        <RenderIf condition={quantity > 0}>
          <pixiSprite
            texture={textureItem}
            rotation={0}
            layout={{
              width: "65%",
              height: "70%",
              position: "absolute",
              marginBottom: 5,
              marginLeft: 0,
            }}
          />
        </RenderIf>
        <pixiContainer x={100} y={90}>
          <pixiGraphics draw={draw} />
          <pixiText
            text={text}
            style={{
              fontSize: 14,
              fontWeight: "700",
              fill: "white",
            }}
            anchor={0.5}
            resolution={2}
            x={boxWidth / 2}
            y={boxHeight / 2}
          />
        </pixiContainer>
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.roundRect(0, 0, plateWidth, plateHeight).fill({
              color: "0x000000",
              alpha: 0,
            });
          }}
          {...activeObj}
        />
      </layoutContainer>
    </>
  );
}
