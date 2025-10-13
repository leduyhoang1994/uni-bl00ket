import HostStore from "@/stores/host-store/host-store";
import ButtonPlayer from "../components/button/button-player";
import ShowTotalMoney from "../components/show-total-money/show-total-money";
import { HostLeaderboardItem } from "@common/types/host.type";
import { useNavigate, useParams } from "react-router";
import { useCallback, useLayoutEffect } from "react";
import HostController from "../controllers/host.controller";
import { HostState } from "@common/constants/host.constant";
import { UrlGenerator } from "@/utils/utils";

export default function HostLeaderboardScreen() {
  const { leaderboard } = HostStore();
  const { hostId } = useParams();
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

      console.log("????");

      const hostController = await HostController.getInstance();
      await hostController.initHttp();
      const hostInfo = await hostController.getHostInfo(hostId, {
        activitiesBoard: true,
      });

      if (hostInfo?.state === HostState.Ended) {
        await navigate(UrlGenerator.HostFinalStandingUrl(hostId));
        return;
      }
      await hostController.initSocket(hostId);



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
            {/* <WatchPlayerBoard /> */}
          </div>
          <div>
            <ShowTotalMoney />
          </div>
        </div>
      </div>
    </div>
  );
}
