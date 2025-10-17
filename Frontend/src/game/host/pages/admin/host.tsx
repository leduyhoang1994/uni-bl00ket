import { useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import HostController from "../../controller";
import tokenRequire from "../../components/token-require.hoc";
import { HostState } from "@common/constants/host.constant";
import { UrlGenerator } from "@/game/common/utils/utils";

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
          navigate(UrlGenerator.AdminHostLobbyUrl(hostId));
          break;
        case HostState.InGame:
          navigate(UrlGenerator.AdminHostInGameUrl(hostId));
          break;
        case HostState.Ended:
          navigate(UrlGenerator.AdminHostFinalUrl(hostId));
          break;
      
        default:
          break;
      }
    })();
  }, []);
  return (
    <>
      Loading . . .
    </>
  );
}

export default tokenRequire(HostNavigator);
