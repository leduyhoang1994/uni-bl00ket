"use client";

import { useApplication, useExtend } from "@pixi/react";
import { Graphics, Sprite, Texture, TilingSprite, Text, Assets } from "pixi.js";
import TagScreen from "@/games/cafe-game/components/tag-screen/tag-screen";
import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import LeaderBoardScreenIcon from "@/games/cafe-game/components/leader-board-screen-icon/leader-board-screen-icon";
import HostStore from "@/stores/host-store/host-store";
import SettingGameIcon from "@/games/components/setting-game-screen/setting-game-icon";

export default function WallContainer() {
  useExtend({ Sprite, TilingSprite, Graphics, Text });
  const { app } = useApplication();
  const { cafeBalance } = CafeGameStore();
  const { userInfo } = HostStore();
  const appHeight = app.screen.height;
  const appWidth = app.screen.width;
  const currentWallHeight = appHeight / 2;
  const itemsContainerWidth = appWidth * 0.9;
  const itemsContainerHeight = appHeight * 0.8 * 0.5;
  const textureWall = Assets.get("back-ground-row");
  const textureClock = Assets.get("clock");
  const textureWindow = Assets.get("window");
  const textureMenu = Assets.get("menu");

  return (
    <pixiContainer label="Wall cafe-game">
      {textureWall !== Texture.EMPTY && (
        <pixiTilingSprite
          texture={textureWall}
          x={0}
          y={0}
          width={appWidth}
          height={currentWallHeight}
        />
      )}

      <pixiContainer
        label="Items Wall cafe-game"
        width={itemsContainerWidth}
        height={itemsContainerHeight}
        x={(appWidth - itemsContainerWidth) / 2}
        y={(currentWallHeight - itemsContainerHeight) / 2}
      >
        {textureClock !== Texture.EMPTY && (
          <pixiSprite
            texture={textureClock}
            x={0}
            y={(itemsContainerHeight - itemsContainerWidth / 6) / 2}
            width={itemsContainerWidth / 6}
            height={itemsContainerWidth / 6}
          />
        )}

        {textureWindow !== Texture.EMPTY && (
          <pixiSprite
            texture={textureWindow}
            x={(itemsContainerWidth - itemsContainerWidth / 1.8) / 2}
            y={0}
            width={itemsContainerWidth / 1.8}
            height={itemsContainerHeight}
          />
        )}

        {textureMenu !== Texture.EMPTY && (
          <pixiSprite
            texture={textureMenu}
            x={itemsContainerWidth - itemsContainerWidth / 6}
            y={(itemsContainerHeight - itemsContainerWidth / 5) / 2}
            width={itemsContainerWidth / 6}
            height={itemsContainerWidth / 5}
          />
        )}
      </pixiContainer>
      <pixiContainer label="Username cafe-game" x={10}>
        <TagScreen value={userInfo?.username || ""} hasUserName={true} />
      </pixiContainer>
      <pixiContainer label="Money cafe-game" x={appWidth / 1.3}>
        <TagScreen value={cafeBalance} />
        <LeaderBoardScreenIcon />
        {/* <SettingGameIcon /> */}
      </pixiContainer>
    </pixiContainer>
  );
}
