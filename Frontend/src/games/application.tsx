"use client";

import "@pixi/layout/devtools";
import { extend, useApplication, useExtend } from "@pixi/react";
import { Assets, Container, Graphics, Text, TextStyle } from "pixi.js";
import CafeGame from "./cafe-game/cafe-game";
import CAFE_ASSET_BUNDLE from "@/games/cafe-game/helpers/bundle";
import SETTING_GAME_ASSET_BUNDLE from "./helper/bundle";
import { useState, useEffect, useLayoutEffect } from "react";
import RenderIf from "@/utils/condition-render";
import { useNavigate, useParams } from "react-router";
import HostController from "@/host/controllers/host.controller";
import { GameMode, HostState } from "@common/constants/host.constant";
import { UrlGenerator } from "@/utils/utils";
import HostStore from "@/stores/host-store/host-store";
import { HostLeaderboard, Player } from "@common/types/host.type";

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
  const { setUserInfo, setLeaderboard } = HostStore();

  const { app } = useApplication();
  (globalThis as any).__PIXI_APP__ = app;

  useLayoutEffect(() => {
    (async () => {
      if (!hostId) {
        return;
      }

      const hostController = await HostController.getInstance();
      await hostController.initHttp();

      const hostInfo = await hostController.getHostInfo(hostId, {
        userInfo: true,
        fullLeaderboard: true,
      });

      if (!hostInfo) {
        return;
      }

      if (hostInfo.userInfo) {
        setUserInfo(hostInfo.userInfo);
      }

      if (hostInfo.finalStandings) {
        setLeaderboard(hostInfo.finalStandings);
      }

      if (hostInfo.state === HostState.Ended) {
        navigate(UrlGenerator.PlayerFinalStandingUrl(hostId));
        return;
      }

      hostController.onGameEnded = async () => {
        navigate(UrlGenerator.PlayerFinalStandingUrl(hostId));
        return;
      };

      hostController.onUserInfo = async (user: Player) => {
        setUserInfo(user);
      };

      hostController.onLeaderBoardUpdated = async (
        leaderboard: HostLeaderboard
      ) => {
        setLeaderboard(leaderboard);
      };

      await hostController.initSocket(hostId);

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
          Assets.addBundle("game", { ...SETTING_GAME_ASSET_BUNDLE, ...CAFE_ASSET_BUNDLE });
          break;
      }
      // Lắng nghe tiến trình load
      Assets.backgroundLoadBundle("game");
      await Assets.loadBundle("game", (progressValue: number) => {
        setProgress(Math.floor(progressValue * 100));
      }).then(() => {
        setLoaded(true);
      });
    };

    loadAssets();
  }, [gameMode]);

  return (
    <pixiContainer
      label="Game Container"
      width={app.screen.width}
      height={app.screen.height}
    >
      <RenderIf condition={!loaded}>
        <pixiGraphics
          draw={(g: Graphics) => {
            g.roundRect(0, 0, app.screen.width, app.screen.height, 0).fill({
              color: "#118891",
            });
          }}
        />
        <pixiContainer
          x={app.screen.width / 2}
          y={app.screen.height / 2}
          anchor={0.5}
        >
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
