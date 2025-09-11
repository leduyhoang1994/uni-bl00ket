"use client";

import "@pixi/layout/react";
import "@pixi/layout";
import { useApplication, useExtend } from "@pixi/react";
import { Assets, Container, Sprite, Texture, TilingSprite } from "pixi.js";
import { LayoutContainer } from "@pixi/layout/components";
import Plate from "./plate";

export default function TableContainer2() {
  useExtend({ Container, Sprite, TilingSprite, LayoutContainer });
  const { app } = useApplication();
  const appHeight = app.screen.height;
  const appWidth = app.screen.width;
  const currentTableHeight = appHeight / 2;
  const textureTable = Assets.get("back-ground-table");

  return (
    <layoutContainer
      key={textureTable !== Texture.EMPTY ? "table-bg" : "table-bg-white"}
      background={
        textureTable !== Texture.EMPTY
          ? new Sprite({ texture: textureTable })
          : new Sprite(Texture.WHITE)
      }
      y={currentTableHeight}
      layout={{
        alignSelf: "center",
        flexDirection: "row",
        width: appWidth,
        height: currentTableHeight,
        justifyContent: "center",
        alignItems: "center",
        columnGap: 80,
        flexWrap: "wrap",
        paddingLeft: 100,
        paddingRight: 100,
        paddingBottom: 50,
      }}
    >
      {[...Array(9)].map((_, i) => {
        return (
          <Plate key={`plate-${i}`} i={i} />
        );
      })}
    </layoutContainer>
  );
}
