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
  const defaultActive = {
    interactive: true,
    eventMode: "static",
    cursor: "pointer",
  };

  const activeObj = quantity > 0 ? defaultActive : {};
  const foodRef = useRef<Sprite>(null);
  return (
    <>
      <layoutContainer
        label="Plate active"
        layout={{
          position: "relative",
          width: plateWidth,
          height: plateHeight,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent"
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
            }}
          />
        </RenderIf>
        <layoutContainer
          layout={{
            width: 'auto',
            height: "auto",
            position: "absolute",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            right: 20,
            bottom: 0,
          }}
          zIndex={10}
        >
          <layoutContainer
            layout={{
              backgroundColor: "099faa",
              width: 'auto',
              height: 'auto',
              borderRadius: 5,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 2,
              paddingBottom: 2,
              paddingLeft: 5,
              paddingRight: 5
            }}
          >
            <pixiText
              text={text}
              style={{
                fontSize: 28,
                fontWeight: "700",
                fill: "white",
              }}
              resolution={2}
              layout
            />
          </layoutContainer>
        </layoutContainer>
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
