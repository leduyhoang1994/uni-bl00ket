"use client";

import "@pixi/layout/react";
import "@pixi/layout";
import { useExtend } from "@pixi/react";
import Customer from "./customer";
import { Sprite } from "pixi.js";
import { LayoutContainer } from "@pixi/layout/components";
import { useEffect } from "react";
import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import { DESIGN_VIEWPORT } from "@/games/application";

export default function CustomerContainer() {
  useExtend({ LayoutContainer, Sprite });
  const { loadCustomers, customers } = CafeGameStore();

  const appWidth = DESIGN_VIEWPORT.width;
  const appHeight = DESIGN_VIEWPORT.height;

  const containerHeight = appHeight * 0.5;
  const custWidth = appWidth / 3;

  const cusPos1 = { x: custWidth * 1 - appWidth / 3 / 2, y: containerHeight };
  const cusPos2 = { x: custWidth * 2 - appWidth / 3 / 2, y: containerHeight };
  const cusPos3 = { x: custWidth * 3 - appWidth / 3 / 2, y: containerHeight };

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <pixiContainer label="Customer Container cafe-game" key={customers.length}>
      <Customer position={1} x={cusPos1.x} y={cusPos1.y} />
      <Customer position={2} x={cusPos2.x} y={cusPos2.y} />
      <Customer position={3} x={cusPos3.x} y={cusPos3.y} />
    </pixiContainer>
  );
}
