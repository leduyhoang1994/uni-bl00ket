import { Link } from "react-router";
import FinalStandingsPrize, { FinalStandingsPrizeRank } from "./components/final-standings-prize";

export default function FinalStandings() {
  return (
    <div className="final-standings">
      <div className="final-standings__header">
        <div className="final-standings__header-first">Blooket</div>
        <div className="final-standings__header-second">Final Standings</div>
        <Link to={{
          pathname: '/',
        }} className="final-standings__header-third">View Report</Link>
      </div>
      <div className="final-standings__body">
        <div className="final-standings__body-background"></div>
        <div className="final-standings__body-cover-prize">
          {[1, 2, 3].map((value: number, index: number) => {
            let prizeObj = {
              userRank: FinalStandingsPrizeRank.FIRST,
              bodyClass: 'final-standings__body-prize-first'
            };
            if (index == 1) {
              prizeObj.userRank = FinalStandingsPrizeRank.SECOND;
              prizeObj.bodyClass = 'final-standings__body-prize-second';
            }
            if (index == 2) {
              prizeObj.userRank = FinalStandingsPrizeRank.THIRD;
              prizeObj.bodyClass = 'final-standings__body-prize-third';
            }

            return (
              <div
                className={`final-standings__body-prize ${prizeObj.bodyClass}`}
                key={index}
              >
                <FinalStandingsPrize useRank={prizeObj.userRank} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}