import { Link } from "react-router";
import FinalStandingsPlayerContent from "./components/final-standings-player-content";
import { UrlGenerator } from "@/utils/utils";

export default function FinalStandingsPlayer() {
  return (
    <div className="final-standings-player">
      <div className="final-standings-player__header">
        <Link to={{
          pathname: UrlGenerator.PlayerJoinUrl(),
        }} className="final-standings-player__header-play-again">Play Again</Link>
      </div>
      <div className="final-standings-player__body">
          <div className="body-background-wrapper">
            <div className="body-background"></div>
          </div>
        <FinalStandingsPlayerContent />
      </div>
    </div>
  )
}