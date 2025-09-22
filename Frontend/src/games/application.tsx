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

export const DESIGN_VIEWPORT = {
  width: 1920,
  height: 1080
}

export default function GameContainer() {
  useExtend({ Graphics });
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const { hostId } = useParams();
  const navigate = useNavigate();
  const { setUserInfo, setLeaderboard } = HostStore();
  const [transform, setTransform] = useState({
    x: 0,
    y: 0,
    scale: 1,
  });

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

  useEffect(() => {
    const DESIGN_RATIO = DESIGN_VIEWPORT.width / DESIGN_VIEWPORT.height;

    const handleResize = () => {
      const screenW = app.screen.width;
      const screenH = app.screen.height;
      const screenRatio = screenW / screenH;

      let targetW: number;
      let targetH: number;

      // Dựa trên yêu cầu của bạn
      if (screenRatio >= DESIGN_RATIO) {
        // Màn hình ngang hoặc vuông, fit theo chiều cao
        targetH = screenH;
        targetW = targetH * DESIGN_RATIO;
      } else {
        // Màn hình dọc, fit theo chiều ngang
        targetW = screenW;
        targetH = targetW / DESIGN_RATIO;
      }

      const scale = targetW / DESIGN_VIEWPORT.width;
      const offsetX = (screenW - targetW) / 2;
      const offsetY = (screenH - targetH) / 2;

      // Cập nhật state
      console.log('transform', transform);

      setTransform({ scale, x: offsetX, y: offsetY });
    };

    // Gọi lần đầu khi component mount
    handleResize();

    // Thêm listener để theo dõi sự kiện resize
    window.addEventListener('resize', handleResize);

    // Dọn dẹp listener khi component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [app.screen]); // Phụ thuộc vào app.screen để chạy lại khi kích thước canvas thay đổi

  return (
    <pixiContainer
      label="Game Container"
      x={transform.x}
      y={transform.y}
      scale={transform.scale}
    >
      <RenderIf condition={!loaded}>
        <pixiGraphics
          draw={(g: Graphics) => {
            g.roundRect(0, 0, DESIGN_VIEWPORT.width, DESIGN_VIEWPORT.height, 0).fill({
              color: "#118891",
            });
          }}
        />
        <pixiContainer
          x={DESIGN_VIEWPORT.width / 2}
          y={DESIGN_VIEWPORT.height / 2}
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
