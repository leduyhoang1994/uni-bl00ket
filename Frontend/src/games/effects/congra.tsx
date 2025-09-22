// FallingLeaves.tsx
import React, { useRef } from "react";
import { Container, Graphics, Sprite } from "pixi.js";
import { useApplication, useExtend, useTick } from "@pixi/react";
import { getRandomFloat, randomFromArray } from "@/games/cafe-game/helpers/random";
import { WithCustomAttributes } from "../cafe-game/helpers/types";
import { DESIGN_VIEWPORT } from "../application";

const colors = [
  0xff0000, // Đỏ tươi
  0x00ff00, // Xanh lá neon
  0x0000ff, // Xanh dương rực
  0xffff00, // Vàng chói
  0xff00ff, // Hồng fuchsia
];

export default function CongraEffect() {
  useExtend({ Container, Sprite });
  const { app } = useApplication();
  const effectContainer = useRef<Container>(new Container());
  const maggotRefs = useRef<Sprite[]>([]);
  const totalSprites = 150;
  const flipSpeed = 0.08;

  const addMaggotRefs = (el: Sprite) => {
    if (el && !maggotRefs.current.includes(el)) {
      maggotRefs.current.push(el);
    }
  };

  useTick({
    callback() {
      maggotRefs.current.forEach((maggot: WithCustomAttributes<Sprite>) => {
        if (maggot.fallSpeed === undefined) {
          Object.defineProperty(maggot, "fallSpeed", {
            writable: true,
            value: getRandomFloat(4, 9),
          });
        }

        maggot.y += maggot.fallSpeed;

        if (maggot.y > DESIGN_VIEWPORT.height) {
          maggot.y = -maggot.height;
        }

        maggot.anchor = {
          x: 0.5,
          y: 1,
        };

        if (maggot.direction === undefined) {
          Object.defineProperty(maggot, "direction", {
            writable: true,
            value: 1,
          });
        }

        maggot.scale.y += flipSpeed * maggot.direction;

        maggot.rotation += (flipSpeed * maggot.direction) * randomFromArray([-1, 1]);

        if (maggot.scale.y <= -1) {
          maggot.direction = 1;
        }

        if (maggot.scale.y >= 1) {
          maggot.direction = -1;
        }
      });
    },
    context: maggotRefs,
  });

  return (
    <pixiContainer ref={effectContainer} label="Congratulation Effect">
      {Array(totalSprites)
        .fill(0)
        .map((maggot, i) => {
          // Generate a texture from the graphics object

          const graphics = new Graphics()
            .circle(0, 0, 8)
            .fill(randomFromArray(colors));
          const circleTexture = app.renderer.generateTexture(graphics);
          const setting = {
            x: Math.random() * DESIGN_VIEWPORT.width,
            y: Math.random() * -DESIGN_VIEWPORT.height,
          };
          return (
            <pixiSprite
              label="Leaf"
              scale={{ y: getRandomFloat(-1, 1), x: 1 }}
              key={`maggot-${i}`}
              texture={circleTexture}
              {...setting}
              ref={addMaggotRefs}
            />
          );
        })}
    </pixiContainer>
  );
}
