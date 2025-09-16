import HostController from "@/host/controllers/host.controller";
import HostLeaderboardScreen from "@/host/host-leaderboard/host-leaderboard";
import HostStore from "@/stores/host-store/host-store";
import { HostLeaderboard } from "@common/types/host.type";
import { useLayoutEffect } from "react";
import { useParams } from "react-router";

export default function Leaderboard() {
  const { hostId } = useParams();
  const { setLeaderboard } = HostStore();

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

      hostController.onLeaderBoardUpdated = async (
        leaderboard: HostLeaderboard
      ) => {
        if (!leaderboard) {
          return;
        }

        setLeaderboard(leaderboard);
      };

      await hostController.initSocket(hostId);
    })();
  }, []);
  return (
    <>
      <HostLeaderboardScreen />
    </>
  );
}
