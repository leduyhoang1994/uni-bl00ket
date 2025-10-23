import FinalStandingsPlayerContent from "./components/final-standings-player-content";

export default function FinalStandingsPlayer() {
  return (
    <div className="final-standings-player">
      <div className="final-standings-player__header"></div>
      <div className="final-standings-player__body">
        <div className="body-background-wrapper">
          <div className="body-background"></div>
        </div>
        <FinalStandingsPlayerContent />
      </div>
    </div>
  );
}
