"use client";

import "@pixi/layout/devtools";
import { extend, useApplication } from "@pixi/react";
import { Assets, Container, Text, TextStyle } from "pixi.js";
import CafeGame from "./cafe-game/cafe-game";
import CAFE_ASSET_BUNDLE from "@/games/cafe-game/helpers/bundle";
import { useState, useEffect, useLayoutEffect } from "react";
import RenderIf from "@/utils/condition-render";
import { useParams } from "react-router";
import HostController from "@/host/controllers/host.controller";
import { GameMode } from "@common/constants/host.constant";

extend({
  Container,
  Text,
});

export default function GameContainer() {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const { hostId } = useParams();

  const { app } = useApplication();
  (globalThis as any).__PIXI_APP__ = app;

  useLayoutEffect(() => {
    (async () => {
      if (!hostId) {
        return;
      }

      const hostController = await HostController.getInstance();
      await hostController.initHttp();

      const hostInfo = await hostController.getHostInfo(hostId);

      if (!hostInfo || !hostInfo.started) {
        return;
      }

      setGameMode(hostInfo.gameMode);
    })();
  }, []);

  useEffect(() => {
    const loadAssets = async () => {
      if (!gameMode) {
        return;
      }

      switch (gameMode) {
        case GameMode.Cafe:
          Assets.addBundle("game", CAFE_ASSET_BUNDLE);
          break;
      }

      // Lắng nghe tiến trình load
      Assets.backgroundLoadBundle("game");
      Assets.loadBundle("game", (progressValue: number) => {
        setProgress(Math.floor(progressValue * 100));
      }).then(() => {
        setLoaded(true);
      });
    };

    loadAssets();
  }, [gameMode]);

  return (
    <pixiContainer label="Game Container">
      <RenderIf condition={!loaded}>
        <pixiContainer x={400} y={300} anchor={0.5}>
          <pixiText
            text={`Loading... ${progress}%`}
            anchor={0.5}
            style={
              new TextStyle({
                fill: "#ffffff",
                fontSize: 28,
                fontWeight: "bold",
              })
            }
          />
        </pixiContainer>
      </RenderIf>
      <RenderIf condition={loaded && gameMode === GameMode.Cafe}>
        <CafeGame />
      </RenderIf>
    </pixiContainer>
  );
}
