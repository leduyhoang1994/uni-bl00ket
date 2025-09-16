import GameApplication from "@/games/page";
import FinalStandings from "@/host/final-standings-creator/final-standings";
import FinalStandingsPlayer from "@/host/final-standings-player/final-standings-player";
import HostCreator from "@/host/host-creator/host-creator";
import WaitingActionCreator from "@/host/waiting-action-creator/waiting-action-creator";

export default function Leaderboard() {
  return (
    <>
      <FinalStandingsPlayer />
    </>
  );
}