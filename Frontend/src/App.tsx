import GameApplication from "./games/page";
import "./App.css"
import "./styles/styles.scss"
import HostCreator from "./host/host-creator/host-creator";
import HostPlayer from "./host/host-player/host-player";
import WaitingLobbyPlayer from "./host/waiting-lobby-player/waiting-lobby-player";

function App() {

  return (
    <>
      <WaitingLobbyPlayer />
    </>
  )
}

export default App
