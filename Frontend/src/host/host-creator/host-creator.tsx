import RenderIf from "@/utils/condition-render";
import ButtonHost from "../components/button/button-host";
import HostStore, { StateType } from "@/stores/host-store/host-store";
import PlayerInfo from "../components/player-info/player-info";
import { HostInfo, Player } from "@common/types/host.type";
import { useEffect, useState } from "react";
import HostController from "../controllers/host.controller";
import { useNavigate, useParams, useSearchParams } from "react-router";
import tokenRequire from "../components/token-require.hoc";
import { GenUrl, UrlGenerator } from "@/utils/utils";
import PopupCopyLink from "../components/popup/popup-copy-link";

function HostCreator() {
  const { setCurrentState, setLobbyPlayers, lobbyPlayers } = HostStore();
  const hasPlayer = lobbyPlayers.length > 0;
  const textBtn = hasPlayer ? "Start" : "1 More";
  const { hostId } = useParams();
  const navigate = useNavigate();
  const [togglePopup, setTogglePopup] = useState(false);

  useEffect(() => {
    (async () => {
      if (!hostId) {
        return;
      }

      const hostController = await HostController.getInstance();
      hostController.onLobbyUpdated = async (players: Player[]) => {
        setLobbyPlayers(players);
      };
      hostController.onGameStarted = async () => {
        navigate(UrlGenerator.HostPlayUrl(hostId));
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
            Go to <span>{GenUrl("/join")}</span>
          </div>
          <div>and enter Game ID:</div>
        </div>
        <div className="host-creator__header-id">{hostId}</div>
        <div className="host-creator__header-copy-link">
          <a href="#" onClick={copyLink}>
            Copy Join Link
          </a>
        </div>
      </div>
      <div className="host-creator__body">
        <div className="host-creator__body-background"></div>
        <div className="host-creator__body-content">
          <div className="host-creator__body-content-player">
            <div>{lobbyPlayers.length || 0}</div>
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="user"
              className="svg-inline--fa fa-user fa-w-14 _playerIcon_1wmvs_69"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path
                fill="currentColor"
                d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"
              ></path>
            </svg>
          </div>
          <div className="host-creator__body-content-text">Blooket</div>
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

export default tokenRequire(HostCreator);
