import tokenRequire from "@/host/components/token-require.hoc";
import HostController from "@/host/controllers/host.controller";
import { GameMode } from "@common/constants/host.constant";
import { useNavigate } from "react-router";

function CreateCafeHost() {
  let navigate = useNavigate();

  async function createHost() {
    const controller = await HostController.getInstance();
    await controller.initHttp();

    const createResult: any = await controller.createHost({
      gameMode: GameMode.Cafe,
    });
    const hostId = createResult?.data?.hostId;

    navigate(`/lobby/${hostId}`);
  }
  return (
    <>
      <div className="waiting-lobby-player">
        <div className="waiting-lobby-player__header">
          <div className="waiting-lobby-player__header-second">
            Create Cafe Host
          </div>
          <div></div>
        </div>
        <div
          className="waiting-lobby-player__body"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            className="button-host"
            style={{ width: "400px" }}
            onClick={createHost}
          >
            Create Host
          </button>
          <div className="waiting-lobby-player__body-background"></div>
        </div>
      </div>
    </>
  );
}

export default tokenRequire(CreateCafeHost);
