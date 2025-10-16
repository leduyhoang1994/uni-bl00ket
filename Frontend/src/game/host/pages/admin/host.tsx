import { useLayoutEffect } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router";
import HostController from "../../controller";
import tokenRequire from "../../components/token-require.hoc";
import { GameMode, HostState } from "@common/constants/host.constant";
import { UrlGenerator } from "@/game/common/utils/utils";
import "../../styles/host.scss";

function leaderboardNavigator(
  navigate: NavigateFunction,
  hostId: string,
  gameMode: GameMode
) {
  switch (gameMode) {
    case GameMode.Cafe:
      navigate(UrlGenerator.LeaderBoardUrl(gameMode, hostId));
      break;
    default:
      break;
  }
}

function HostNavigator() {
  const { hostId } = useParams();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    (async () => {
      if (!hostId) {
        return;
      }

      const hostController = await HostController.getInstance();
      await hostController.initHttp();
      const hostInfo = await hostController.getHostInfo(hostId);

      if (!hostInfo) {
        return;
      }

      switch (hostInfo.state) {
        case HostState.Lobby:
          navigate(UrlGenerator.HostLobbbyUrl(hostId));
          break;
        case HostState.InGame:
          leaderboardNavigator(navigate, hostId, hostInfo.gameMode);
          break;
        case HostState.Ended:
          break;
        default:
          break;
      }
    })();
  }, []);
  return <></>;
}

export default tokenRequire(HostNavigator);
