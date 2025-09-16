import GameApplication from "./games/page";
import "./App.css";
import "./styles/styles.scss";
import HostCreator from "./host/host-creator/host-creator";
import HostPlayer from "./host/host-player/host-player";
import WaitingLobbyPlayer from "./host/waiting-lobby-player/waiting-lobby-player";
import { BrowserRouter, Route, Routes } from "react-router";
import CreateCafeHost from "./games/cafe-game/screens/host/host";
import { useLayoutEffect } from "react";
import HostController from "./host/controllers/host.controller";
import AccessDenied from "./host/components/access-denied";
import Leaderboard from "./games/cafe-game/screens/leaderboard/leaderboard";
import Host from "./host/host/host";
import FinalStandings from "./host/final-standings-creator/final-standings";
import FinalStandingsPlayer from "./host/final-standings-player/final-standings-player";

function App() {
  useLayoutEffect(() => {
    (async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const accessToken = searchParams.get("accessToken");
      if (!accessToken) {
        return;
      }

      await HostController.saveAccessToken(accessToken);
    })();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Player Lobby */}
        <Route path="join" element={<HostPlayer />} />
        <Route path="join/:hostId" element={<HostPlayer />} />
        <Route path="join/:hostId/lobby" element={<WaitingLobbyPlayer />} />
        {/* Creator Lobby */}
        <Route path="host-lobby/:hostId" element={<HostCreator />} />

        {/* In Game */}
        <Route path="player-play/:hostId" element={<GameApplication />} />
        <Route path="player-final/:hostId" element={<FinalStandingsPlayer />} />
        <Route path="host-play/:hostId" element={<Host />} />
        <Route path="host-final/:hostId" element={<FinalStandings />} />

        <Route path="/cafe">
          {/* Creator Lobby */}
          <Route path="create" element={<CreateCafeHost />} />
          <Route path=":hostId/leaderboard" element={<Leaderboard />} />
        </Route>

        <Route path="/access-denied" element={<AccessDenied />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
