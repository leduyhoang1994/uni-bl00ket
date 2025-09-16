import ButtonPlayer from "@/host/components/button/button-player";
import ShowTotalMoney from "@/host/components/show-total-money/show-total-money";
import PlayerActivitiesBoard from "@/host/components/player-activities-board/player-activites-board";
import HostController from "@/host/controllers/host.controller";
import HostStore from "@/stores/host-store/host-store";
import { UrlGenerator } from "@/utils/utils";
import {
  ActivityBoardItem,
  HostLeaderboard,
  HostLeaderboardItem,
} from "@common/types/host.type";
import { useCallback, useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function Leaderboard() {
  const { hostId } = useParams();
  const { setLeaderboard } = HostStore();
  const { leaderboard } = HostStore();
  const [activitiesBoard, setActivitiesBoard] = useState<ActivityBoardItem[]>(
    []
  );
  const navigate = useNavigate();

  const endGame = useCallback(async () => {
    if (!hostId) {
      return;
    }

    const hostController = await HostController.getInstance();
    await hostController.initSocket(hostId);
    await hostController.endGame();
  }, [hostId]);

  useLayoutEffect(() => {
    (async () => {
      if (!hostId) {
        return;
      }

      const hostController = await HostController.getInstance();

      hostController.onGameEnded = async () => {
        await navigate(UrlGenerator.HostFinalStandingUrl(hostId));
      };

      hostController.onLeaderBoardUpdated = async (
        leaderboard: HostLeaderboard
      ) => {
        if (!leaderboard) {
          return;
        }

        setLeaderboard(leaderboard);
      };

      hostController.onActivitySaved = async (activity: ActivityBoardItem) => {
        if (!activity) {
          return;
        }

        setActivitiesBoard((prev) => {
          return [...prev, activity];
        });
      };

      await hostController.initSocket(hostId);
      await hostController.initHttp();

      const hostInfo = await hostController.getHostInfo(hostId, {
        activitiesBoard: true,
      });

      setActivitiesBoard(hostInfo?.activitiesBoard || []);
    })();
  }, []);
  return (
    <div className="waiting-action-creator">
      <div className="waiting-action-creator__header">
        <div className="waiting-action-creator__header-first">Uni</div>
        <div className="waiting-action-creator__header-second">
          Goal: $100,000
        </div>
        <div className="waiting-action-creator__header-third">
          <div>ID: {hostId}</div>
          <img
            src="/images/host/end_now.svg"
            className="end-now-btn"
            alt="End game"
            onClick={endGame}
          />
        </div>
      </div>
      <div className="waiting-action-creator__body">
        <div className="waiting-action-creator__body-cover-btn">
          {leaderboard.map((value: HostLeaderboardItem, index: number) => {
            const userNumber = index + 1;
            const position = `translateY(${index * 11.5}vh)`;
            return (
              <div
                key={index}
                style={{ transform: `${position}`, position: "absolute" }}
              >
                <ButtonPlayer
                  userNumber={userNumber}
                  score={value.score}
                  name={value.username}
                />
              </div>
            );
          })}
        </div>
        <div>
          <div>
            <PlayerActivitiesBoard activitiesBoard={activitiesBoard} />
          </div>
          <div>
            <ShowTotalMoney />
          </div>
        </div>
      </div>
    </div>
  );
}
