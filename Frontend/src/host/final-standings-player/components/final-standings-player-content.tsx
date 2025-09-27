import { Link, useParams } from "react-router";
import FinalStandingsPlayerBoard, {
  UserRank,
} from "./final-standings-player-board";
import { useLayoutEffect, useState } from "react";
import { HostLeaderboardItem, PersonalResult } from "@common/types/host.type";
import HostController from "@/host/controllers/host.controller";
import { numberToOrder } from "@/utils/utils";
import HostStore from "@/stores/host-store/host-store";

export default function FinalStandingsPlayerContent() {
  const { hostId } = useParams();
  const [finalStandings, setFinalStandings] = useState<HostLeaderboardItem[]>(
    []
  );
  const { userInfo } = HostStore();

  const [personalResult, setPersonalResult] = useState<PersonalResult | null>(
    null
  );

  useLayoutEffect(() => {
    (async () => {
      if (!hostId) {
        return;
      }

      const controller = await HostController.getInstance();

      controller.initHttp();

      const hostInfo = await controller.getHostInfo(hostId, {
        fullLeaderboard: true,
        personalResult: true,
      });

      setFinalStandings(hostInfo?.finalStandings || []);
      setPersonalResult(hostInfo?.personalResult || null);
    })();
  }, []);

  const order = numberToOrder(personalResult?.rank || 0);

  return (
    <div className="final-standings-player__body-content">
      <div className="final-standings-player__body-content-rank">
        <div>{order.numb}</div>
        <div>{order.text}</div>
        <div>Place</div>
      </div>
      <div className="final-standings-player__body-content-image">
        <img src={userInfo?.avatar || ""} alt="" />
      </div>
      <div className="final-standings-player__body-content-cheer">
        You Can Do It
      </div>
      <div className="final-standings-player__body-content-score">
        Score: {personalResult?.score || 0}
      </div>
      <div className="final-standings-player__body-content-score-details">
        {finalStandings.map((value: HostLeaderboardItem, index: number) => {
          const userRank: UserRank = {
            number: 0,
            text: "st",
            hasCurrentUser: false,
          };
          userRank.number = index + 1;
          if (index == 1) {
            userRank.text = "nd";
          }
          if (index == 2) {
            userRank.text = "rd";
          }
          if (index == 3) {
            userRank.text = "th";
          }

          if (personalResult?.rank === userRank.number) {
            userRank.hasCurrentUser = true;
          }

          return (
            <div key={index}>
              <FinalStandingsPlayerBoard
                userRank={userRank}
                leaderBoardItem={value}
              />
            </div>
          );
        })}
      </div>
      <div className="final-standings-player__body-content-accuracy">
        <div className="final-standings-player__body-content-accuracy-column">
          <div>Accuracy:</div>
          <div>
            {personalResult?.accuracy.corrects} /{" "}
            {personalResult?.accuracy.total}
          </div>
        </div>
        <div className="final-standings-player__body-content-accuracy-number">
          {personalResult?.accuracy.percent}%
        </div>
      </div>
      {/* <button className="final-standings-player__body-content-btn-detail">
        View Details
      </button>
      <div className="final-standings-player__body-content-btn-row">
        <Link
          to={{
            pathname: "/",
          }}
          className="final-standings-player__body-content-btn-row-detail"
        >
          <div></div>
          <div>
            <span>Go to Profile</span>
          </div>
        </Link>
        <Link
          to={{
            pathname: "/",
          }}
          className="final-standings-player__body-content-btn-row-detail"
        >
          <div></div>
          <div>
            <span>Go to Market</span>
          </div>
        </Link>
      </div> */}
    </div>
  );
}
