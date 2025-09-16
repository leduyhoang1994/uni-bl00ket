"use client";

import "@pixi/layout/devtools";
import { extend, useApplication, useExtend } from "@pixi/react";
import { Assets, Container, Graphics, Text, TextStyle } from "pixi.js";
import CafeGame from "./cafe-game/cafe-game";
import CAFE_ASSET_BUNDLE from "@/games/cafe-game/helpers/bundle";
import { useState, useEffect, useLayoutEffect } from "react";
import RenderIf from "@/utils/condition-render";
import { useNavigate, useParams } from "react-router";
import HostController from "@/host/controllers/host.controller";
import { GameMode, HostState } from "@common/constants/host.constant";
import { UrlGenerator } from "@/utils/utils";

extend({
  Container,
  Text,
});

export default function GameContainer() {
  useExtend({ Graphics });
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const { hostId } = useParams();
  const navigate = useNavigate();

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

      if (!hostInfo) {
        return;
      }

      if (hostInfo.state === HostState.Ended) {
        navigate(UrlGenerator.PlayerFinalStandingUrl(hostId));
        return;
      }

      hostController.onGameEnded = async () => {
        navigate(UrlGenerator.PlayerFinalStandingUrl(hostId));
        return;
      };
      await hostController.initSocket(hostId);

      console.log(hostInfo.state);

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
    <pixiContainer label="Game Container" width={app.screen.width} height={app.screen.height}>
      <RenderIf condition={!loaded}>
        <pixiGraphics draw={(g: Graphics) => {
          g.roundRect(0, 0, app.screen.width, app.screen.height, 0).fill({
            color: '#118891',
          });
        }} />
        <pixiContainer x={app.screen.width / 2} y={app.screen.height / 2} anchor={0.5}>
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
