import RenderIf from "@/game/common/utils/condition-render";
import ButtonHost from "../../../components/button/button-host";
import HostStore from "@/game/host/store";
import PlayerInfo from "../../../components/player-info/player-info";
import { Player } from "@common/types/host.type";
import { useEffect, useState } from "react";
import HostController from "../../../controller";
import { useNavigate, useParams } from "react-router";
import tokenRequire from "../../../components/token-require.hoc";
import { GenUrl, UrlGenerator } from "@/game/common/utils/utils";
import PopupCopyLink from "../../../components/popup/popup-copy-link";
import { HostState } from "@common/constants/host.constant";
import CountdownTimer from "@/game/common/components/countdown/CountdownTimer";

function HostLobby() {
  const { setLobbyPlayers, lobbyPlayers, hostInfo, setHostInfo } = HostStore();
  const hasPlayer = lobbyPlayers.length > 0;
  const textBtn = hasPlayer ? "Bắt đầu" : "Ít nhất 1";
  const { hostId } = useParams();
  const navigate = useNavigate();
  const [togglePopup, setTogglePopup] = useState(false);

  useEffect(() => {
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

      setHostInfo(hostInfo);

      if (hostInfo.state !== HostState.Lobby) {
        navigate(UrlGenerator.AdminHostUrl(hostId));
        return;
      }

      hostController.onLobbyUpdated = async (players: Player[] | Player) => {
        setLobbyPlayers(players);
      };
      hostController.onGameStarted = async () => {
        await navigate(UrlGenerator.AdminHostInGameUrl(hostId));
      };
      hostController.onStartTimeUpdated = async (startTime: number) => {
        console.log("Start time updated:", startTime);
      };
      await hostController.initSocket(hostId);
    })();
  }, []);

  const doClickStartGame = async () => {
    if (!hasPlayer) {
      return;
    }
    const hostController = await HostController.getInstance();
    await hostController.startGame();
  };

  const copyLink = async () => {
    const url = `/join/${hostId}`;
    await navigator.clipboard.writeText(GenUrl(url, true));
    // alert("URL Copied");
    setTogglePopup(true);
  };

  return (
    <div className="host-creator">
      <div className="host-creator__header">
        <div className="host-creator__header-QR"></div>
        <div className="host-creator__header-infor">
          <div>
            Tham gia và
            {/* <span>{GenUrl("/tham gia")}</span> */}
          </div>
          <div>nhập ID trò chơi:</div>
        </div>
        <div className="host-creator__header-id">{hostId}</div>
        <div className="host-creator__header-copy-link">
          <a href="#" onClick={copyLink}>
            Sao chép link tham gia
          </a>
        </div>
      </div>
      <div className="host-creator__body">
        <div className="body-background-wrapper">
          <div className="body-background"></div>
        </div>
        {hostInfo?.startTime && (
          <CountdownTimer targetTimestamp={hostInfo.startTime} />
        )}
        <div className="host-creator__body-content">
          <div className="host-creator__body-content-player">
            <div>
              {lobbyPlayers.length || 0}
              <div className="player-icon">☻</div>
            </div>
          </div>
          <ButtonHost
            textBtn={textBtn}
            hasPlayer={hasPlayer}
            doClickBtn={doClickStartGame}
          />
        </div>
        <RenderIf condition={hasPlayer}>
          <div className="host-creator__body-cover-player">
            {lobbyPlayers.map((player: Player, index: number) => {
              return <PlayerInfo key={index} player={player} />;
            })}
          </div>
        </RenderIf>
      </div>
      <RenderIf condition={togglePopup}>
        <PopupCopyLink setTogglePopup={setTogglePopup} />
      </RenderIf>
    </div>
  );
}

export default tokenRequire(HostLobby);
