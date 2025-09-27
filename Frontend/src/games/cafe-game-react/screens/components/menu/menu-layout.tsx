import HostStore from "@/stores/host-store/host-store";
import TagLayout from "../tag/tag-layout";
import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import SettingAudioReactIcon from "@/games/components/setting-audio-react/setting-audio-react-icon";

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
        {/* <SettingAudioReactIcon /> */}
      </div>
    </div>
  );
}
