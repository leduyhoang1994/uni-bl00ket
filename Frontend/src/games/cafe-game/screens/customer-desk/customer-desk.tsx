import CustomerContainer from "./components/customer-container";
import LeaderboardScreen from "../leader-board-screen/leader-board-screen";
import TableContainer from "./components/table-container";
import WallContainer from "./components/wall-container";
import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import RenderIf from "@/utils/condition-render";

export default function CustomerDesk() {
  const { toggleLeaderBoard } = CafeGameStore();
  return (
    <>
      <WallContainer />
      <CustomerContainer />
      <TableContainer />
      <RenderIf condition={toggleLeaderBoard}>
        <LeaderboardScreen />
      </RenderIf>
    </>
  )
}