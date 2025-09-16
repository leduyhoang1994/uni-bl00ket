import { Link, useParams } from "react-router";
import FinalStandingsPrize, {
  FinalStandingsPrizeRank,
} from "./components/final-standings-prize";
import { useLayoutEffect, useState } from "react";
import HostController from "../controllers/host.controller";
import { HostLeaderboardItem } from "@common/types/host.type";

export default function FinalStandings() {
  const { hostId } = useParams();
  const [finalStandings, setFinalStandings] = useState<HostLeaderboardItem[]>(
    []
  );

  useLayoutEffect(() => {
    (async () => {
      if (!hostId) {
        return;
      }

      const hostController = await HostController.getInstance();
      await hostController.initHttp();

      const hostInfo = await hostController.getHostInfo(hostId);

      setFinalStandings(hostInfo?.finalStandings || []);
    })();
  }, []);

  return (
    <div className="final-standings">
      <div className="final-standings__header">
        <div className="final-standings__header-first">Blooket</div>
        <div className="final-standings__header-second">Final Standings</div>
        <div></div>
        {/* <Link
          to={{
            pathname: "/",
          }}
          className="final-standings__header-third"
        >
          View Report
        </Link> */}
      </div>
      <div className="final-standings__body">
        <div className="final-standings__body-background"></div>
        <div className="final-standings__body-cover-prize">
          {finalStandings.map((item: HostLeaderboardItem, index: number) => {
            let prizeObj = {
              userRank: FinalStandingsPrizeRank.FIRST,
              bodyClass: "final-standings__body-prize-first",
            };
            if (index == 1) {
              prizeObj.userRank = FinalStandingsPrizeRank.SECOND;
              prizeObj.bodyClass = "final-standings__body-prize-second";
            }
            if (index == 2) {
              prizeObj.userRank = FinalStandingsPrizeRank.THIRD;
              prizeObj.bodyClass = "final-standings__body-prize-third";
            }

            return (
              <div
                className={`final-standings__body-prize ${prizeObj.bodyClass}`}
                key={index}
              >
                <FinalStandingsPrize useRank={prizeObj.userRank} leaderboardItem={item} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
