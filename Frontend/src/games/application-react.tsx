"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import RenderIf from "@/utils/condition-render";
import { useNavigate, useParams } from "react-router";
import HostController from "@/host/controllers/host.controller";
import { GameMode, HostState } from "@common/constants/host.constant";
import { UrlGenerator } from "@/utils/utils";
import HostStore from "@/stores/host-store/host-store";
import { HostLeaderboard, Player } from "@common/types/host.type";
import CafeGameReact from "./cafe-game-react/cafe-game-react";

export default function GameContainerReact() {
  const [loaded, setLoaded] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const { hostId } = useParams();
  const navigate = useNavigate();
  const { setUserInfo, setLeaderboard } = HostStore();

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
        questions: true,
      });

      if (!hostInfo) {
        return;
      }

      hostController.setHostInfo(hostInfo);

      if (hostInfo.userInfo) {
        setUserInfo(hostInfo.userInfo);
      }

      if (hostInfo.finalStandings) {
        setLeaderboard(hostInfo.finalStandings);
      }
      
      hostController.setQuestions(hostInfo.questions);

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
          break;
      }

      setLoaded(true);
    };

    loadAssets();
  }, [gameMode]);

  return (
    <div className="game-container-react">
      <RenderIf condition={loaded && gameMode === GameMode.Cafe}>
        <CafeGameReact />
      </RenderIf>
    </div>
  );
}
