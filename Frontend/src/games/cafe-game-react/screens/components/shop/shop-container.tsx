import SettingAudioReactIcon from "@/games/components/setting-audio-react/setting-audio-react-icon";

export default function ShopContainer() {
  return (
    <div className="cafe-game__shop">
      <div className="cafe-game__shop-header">
        <div className="cafe-game__shop-header-setting">
          <img src="/images/cafe-game/leader-board.svg" alt="" />
          <SettingAudioReactIcon />
        </div>
        <div className="cafe-game__shop-header-curtain">
          <div className="cafe-game__shop-header-curtain-upgrades">
            <p>Upgrades</p>
          </div>
          <div className="cafe-game__shop-header-curtain-money">
            <p>$0</p>
          </div>
        </div>
      </div>
    </div>
  )
}