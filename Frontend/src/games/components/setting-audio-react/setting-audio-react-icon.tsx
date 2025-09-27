import SettingGameStore from "@/stores/setting-game-store/setting-game-store";

export default function SettingAudioReactIcon() {
  const { setToggleSettingGame } = SettingGameStore();
  return (
    <div className="setting-audio-react__icon" onClick={() => setToggleSettingGame(true)}>
      {/* <img src="/images/icons/setting.svg" alt="" /> */}
    </div>
  )
}