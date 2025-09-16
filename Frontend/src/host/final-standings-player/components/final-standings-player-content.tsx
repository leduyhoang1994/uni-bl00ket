import { Link } from "react-router";
import FinalStandingsPlayerBoard from "./final-standings-player-board";

export default function FinalStandingsPlayerContent() {
  return (
    <div className="final-standings-player__body-content">
      <div className="final-standings-player__body-content-rank">
        <div>1</div>
        <div>st</div>
        <div>Place</div>
      </div>
      <div className="final-standings-player__body-content-image">
        <img src="/images/avatar/brown-dog.svg" alt="" />
      </div>
      <div className="final-standings-player__body-content-cheer">You Can Do It</div>
      <div className="final-standings-player__body-content-score">Score: 6</div>
      {[1, 2, 3, 4].map((value, index: number) => {
        const userRank = {
          name: 'a',
          number: 0,
          text: 'st',
          score: 9,
          hasCurrentUser: false,
        }
        userRank.number = index + 1;
        if (index == 1) {
          userRank.text = 'nd';
          userRank.hasCurrentUser = true;
        }
        if (index == 2) {
          userRank.text = 'rd';
        }
        if (index == 3) {
          userRank.text = 'th';
        }

        return (
          <div key={index}>
            <FinalStandingsPlayerBoard userRank={userRank} />
          </div>
        )
      })}
      <div className="final-standings-player__body-content-accuracy">
        <div className="final-standings-player__body-content-accuracy-column">
          <div>Accuracy:</div>
          <div>2 / 2</div>
        </div>
        <div className="final-standings-player__body-content-accuracy-number">100%</div>
      </div>
      <button className="final-standings-player__body-content-btn-detail">View Details</button>
      <div className="final-standings-player__body-content-btn-row">
        <Link to={{
          pathname: '/',
        }} className="final-standings-player__body-content-btn-row-detail">
          <div></div>
          <div>
            <span>Go to Profile</span>
          </div>
        </Link>
        <Link to={{
          pathname: '/',
        }} className="final-standings-player__body-content-btn-row-detail">
          <div></div>
          <div>
            <span>Go to Market</span>
          </div>
        </Link>
      </div>
    </div>
  )
}