"use client";

import "@pixi/layout/react";
import "@pixi/layout";
import { Assets, Container } from "pixi.js";
import { useRef } from "react";

const PLATE_SIZE = 120;

export default function Plate({ i }: { i: number }) {
  const texturePlate = Assets.get("plate");
  const plateContainer = useRef<Container>(null);
  return (
    <pixiContainer
      ref={plateContainer}
      y={i > 4 ? PLATE_SIZE * -0.25 : 0}
      layout={{
        isLeaf: true,
        maxHeight: PLATE_SIZE,
        maxWidth: PLATE_SIZE,
      }}
    >
      <pixiSprite texture={texturePlate} />
    </pixiContainer>
  );
}
