import tokenRequire from "@/game/host/components/token-require.hoc";
import HostController from "@/game/host/controller";
import { UrlGenerator } from "@/game/common/utils/utils";
import { GameMode } from "@common/constants/host.constant";
import { useNavigate } from "react-router";
import { useState } from "react";
import GameModePicker from "./game-mode-picker";

function HostCreate() {
  let navigate = useNavigate();
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.Cafe);

  async function createHost() {
    const controller = await HostController.getInstance();
    await controller.initHttp();

    const createResult: any = await controller.createHost({
      gameMode: gameMode,
      gameSettings: {
        testing: true,
      },
    });
    const hostId = createResult?.data?.hostId;

    navigate(UrlGenerator.AdminHostUrl(hostId));
  }
  return (
    <>
      <div className="waiting-lobby-player">
        <div className="waiting-lobby-player__header">
          <div className="waiting-lobby-player__header-second">
            Tạo phòng Game
          </div>
          <div></div>
        </div>
        <div
          className="waiting-lobby-player__body"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <GameModePicker gameMode={gameMode} setGameMode={setGameMode} />
          <button className="button-host" onClick={createHost}>
            <span className="coiny-text">Tạo Phòng</span>
          </button>
        </div>
        <div className="body-background-wrapper">
          <div className="body-background"></div>
        </div>
      </div>
    </>
  );
}

export default tokenRequire(HostCreate);
