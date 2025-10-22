"use client";

import { useState, useEffect, useLayoutEffect, lazy, Suspense } from "react";
import RenderIf from "@/game/common/utils/condition-render";
import { useNavigate, useParams } from "react-router";
import HostController from "@/game/host/controller";
import { GameMode, HostState } from "@common/constants/host.constant";
import { UrlGenerator } from "@/game/common/utils/utils";
import HostStore from "@/game/host/store";
import { HostLeaderboard, Player } from "@common/types/host.type";
import "@styles/styles.scss";
import CountdownTimer from "@/game/common/components/countdown/CountdownTimer";

/**
 * Game Components
 */
const Cafe = lazy(() => import("@/game/modes/cafe/cafe"));
const GoldQuest = lazy(() => import("@/game/modes/gold-quest/gold-quest-game"));

export default function PlayerInGame() {
  const [loaded, setLoaded] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const { hostId } = useParams();
  const navigate = useNavigate();
  const { setUserInfo, setLeaderboard, setHostInfo, updateEndTime, hostInfo } =
    HostStore();

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

      setHostInfo(hostInfo);

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

      hostController.onEndTimeUpdated = async (endTime: number) => {
        updateEndTime(endTime);
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
      {hostInfo?.endTime && (
        <div className="game-tag">
          <CountdownTimer targetTimestamp={hostInfo.endTime} />
        </div>
      )}
      <Suspense fallback={<div>Loading . . .</div>}>
        <RenderIf condition={loaded && gameMode === GameMode.Cafe}>
          <Cafe />
        </RenderIf>
        <RenderIf condition={loaded && gameMode === GameMode.GoldQuest}>
          <GoldQuest />
        </RenderIf>
      </Suspense>
    </div>
  );
}
