import HostStore from "@/stores/host-store/host-store";

export default function SettingLobbyIcon() {
  const { setToggleSetting } = HostStore();
  return (
    <div className="setting-lobby" onClick={() => setToggleSetting(true)}>
      <img src="/images/host/setting.svg" alt="" />
    </div>
  )
}