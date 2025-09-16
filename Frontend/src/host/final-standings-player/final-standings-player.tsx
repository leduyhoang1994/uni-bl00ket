import { Link } from "react-router";
import FinalStandingsPlayerContent from "./components/final-standings-player-content";

export default function FinalStandingsPlayer() {
  return (
    <div className="final-standings-player">
      <div className="final-standings-player__header">
        <Link to={{
          pathname: '/',
        }} className="final-standings-player__header-play-again">Play Again</Link>
      </div>
      <div className="final-standings-player__body">
        <div className="final-standings-player__body-background"></div>
        <FinalStandingsPlayerContent />
      </div>
    </div>
  )
}