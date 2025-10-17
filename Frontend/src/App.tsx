import "./App.css";
import "./styles/styles.scss";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { lazy, Suspense, useLayoutEffect } from "react";
import HostController from "@/game/host/controller";
import FullPageLoader from "./loader";
import HostPlayerLayout from "./game/host/pages/player/player.layout";

// --- Player Components ---
const HostPlayer = lazy(
  () => import("@/game/host/pages/player/lobby/host-player")
);
const WaitingLobbyPlayer = lazy(
  () => import("@/game/host/pages/player/lobby/waiting-lobby-player")
);
const PlayerInGame = lazy(() => import("./game/host/pages/player/in-game/in-game"));
const FinalStandingsPlayer = lazy(
  () => import("@/game/host/pages/player/final/final-standings-player")
);

// --- Admin/Host Components ---
const HostAdminLayout = lazy(
  () => import("./game/host/pages/admin/admin.layout")
);
const HostCreate = lazy(
  () => import("./game/host/pages/admin/host-create/host-create")
);
const HostNavigator = lazy(() => import("@/game/host/pages/admin/host"));
const HostLobby = lazy(() => import("@/game/host/pages/admin/lobby/lobby"));
const InGame = lazy(() => import("./game/host/pages/admin/in-game/in-game"));
const FinalStandings = lazy(
  () => import("@/game/host/pages/admin/final/final-standings")
);

// --- CMS Components ---
const CmsLayout = lazy(() => import("./cms/layout/cms.layout"));
const CmsLogin = lazy(() => import("./cms/auth/login"));
const AdminLayout = lazy(() => import("./cms/layout/admin.layout"));
const GameList = lazy(() => import("./cms/game/list"));
const GameCreate = lazy(() => import("./cms/game/create"));
const GameEdit = lazy(() => import("./cms/game/edit"));

// --- Other Components ---
const AccessDenied = lazy(() => import("@/game/host/components/access-denied"));
const GoldQuest = lazy(() => import("./game/modes/gold-quest/gold-quest"));

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
      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          {/* Player */}
          <Route element={<HostPlayerLayout />}>
            <Route path="join" element={<HostPlayer />} />
            <Route path="join/:hostId" element={<HostPlayer />} />
            <Route path="join/:hostId/lobby" element={<WaitingLobbyPlayer />} />
            <Route path="player-play/:hostId" element={<PlayerInGame />} />
            <Route
              path="player-final/:hostId"
              element={<FinalStandingsPlayer />}
            />
          </Route>

          <Route path="admin" element={<HostAdminLayout />}>
            <Route path="game/create" element={<HostCreate />} />

            <Route path="host/:hostId">
              <Route index element={<HostNavigator />} />
              <Route path="lobby" element={<HostLobby />} />
              <Route path="in-game" element={<InGame />} />
              <Route path="final" element={<FinalStandings />} />
            </Route>
          </Route>

          <Route path="/gold-quest" element={<GoldQuest />} />

          <Route path="/cafe/create" element={<Navigate to="/admin/game/create" replace />} />

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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
