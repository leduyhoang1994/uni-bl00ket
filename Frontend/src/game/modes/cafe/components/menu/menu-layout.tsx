import HostStore from "@/game/host/store";
import TagLayout from "../tag/tag-layout";
import CafeGameStore from "@/game/modes/cafe/store";

export default function MenuLayout() {
  const { userInfo } = HostStore();
  const { cafeBalance, setToggleLeaderBoard } = CafeGameStore();

  return (
    <div className="cafe-game__menu-layout">
      <TagLayout tag={userInfo?.username} />
      <div className="cafe-game__menu-layout-setting">
        <TagLayout tag={`$${cafeBalance}`} />
        <img
          onClick={() => setToggleLeaderBoard(true)}
          style={{ cursor: "pointer" }}
          src="/images/cafe-game/leader-board.svg"
          alt=""
        />
      </div>
    </div>
  );
}
