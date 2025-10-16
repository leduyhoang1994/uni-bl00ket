import GameApplication from "./game/page";
import "./App.css";
import "./styles/styles.scss";
import HostLobby from "@/game/host/pages/admin/lobby/lobby";
import HostPlayer from "@/game/host/pages/player/lobby/host-player";
import WaitingLobbyPlayer from "@/game/host/pages/player/lobby/waiting-lobby-player";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { useLayoutEffect } from "react";
import HostController from "@/game/host/controller";
import AccessDenied from "@/game/host/components/access-denied";
import HostNavigator from "@/game/host/pages/admin/host";
import FinalStandings from "@/game/host/pages/admin/final/final-standings";
import GameList from "./cms/game/list";
import CmsLayout from "./cms/layout/cms.layout";
import CmsLogin from "./cms/auth/login";
import AdminLayout from "./cms/layout/admin.layout";
import GameCreate from "./cms/game/create";
import GameEdit from "./cms/game/edit";
import HostCreate from "./game/host/pages/admin/host-create/host-create";
import InGame from "./game/host/pages/admin/in-game/in-game";
import FinalStandingsPlayer from "./game/host/pages/player/final/final-standings-player";
import GoldQuest from "./game/modes/gold-quest/gold-quest";

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
        {/* Admin Lobby */}
        <Route path="admin-lobby/:hostId" element={<HostLobby />} />

        {/* In Game */}
        <Route path="player-play/:hostId" element={<GameApplication />} />
        <Route path="player-final/:hostId" element={<FinalStandingsPlayer />} />
        <Route path="admin-play/:hostId" element={<HostNavigator />} />
        <Route path="admin-final/:hostId" element={<FinalStandings />} />

        <Route path="/cafe">
          {/* Creator Lobby */}
          <Route path="create" element={<HostCreate />} />
          <Route path=":hostId/leaderboard" element={<InGame />} />
        </Route>

        <Route path="/gold-quest" element={<GoldQuest />} />

        <Route path="cms" element={<CmsLayout />}>
          <Route index element={<Navigate to="admin" replace />} />
          <Route path="auth">
            <Route path="login" element={<CmsLogin />} />
          </Route>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="game/list" replace />} />

            <Route path="game">
              <Route index element={<Navigate to="list" replace />} />
              <Route path="list" element={<GameList />} />
              <Route path="create" element={<GameCreate />} />
              <Route path="edit/:game_id" element={<GameEdit />} />
            </Route>
          </Route>
        </Route>

        <Route path="/access-denied" element={<AccessDenied />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
