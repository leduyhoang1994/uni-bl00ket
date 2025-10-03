import { useLayoutEffect, useState } from "react";
import HostController from "../controllers/host.controller";
import RenderIf from "@/utils/condition-render";
import { AuthenticatedUser } from "@common/types/socket.type";
import { useNavigate, useParams } from "react-router";
import tokenRequire from "../components/token-require.hoc";
import { GenUrl, SCREEN_SIZES_ENUM, UrlGenerator } from "@/utils/utils";
import { HostInfo } from "../../../../Common/types/host.type";
import { HostState } from "@common/constants/host.constant";
import AvatarPicker from "./avatar-picker";
import ButtonCafeGame from "@/games/cafe-game-react/components/button-cafe-game/button-cafe-game";
import UniButton from "@/games/components/buttons/uni-button";
import HostStore from "@/stores/host-store/host-store";

function WaitingLobbyPlayer() {
  const [isJoining, setIsJoining] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [player, setPlayer] = useState<AuthenticatedUser | null>(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(true);
  const { hostId } = useParams();
  const { setUserInfo } = HostStore();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    (async () => {
      if (!hostId) {
        navigate(UrlGenerator.AccessDeniedUrl());
        return;
      }

      const controller = await HostController.getInstance();
      const hostInfo = await controller.getHostInfo(hostId);

      if (!hostInfo) {
        navigate(UrlGenerator.AccessDeniedUrl());
        return;
      }

      if (hostInfo.state === HostState.InGame) {
        navigate(UrlGenerator.PlayerPlayUrl(hostId));
        return;
      }

      controller.onConnected = async () => {
        setIsJoined(true);
        setIsJoining(false);
      };
      controller.onUserInfo = async (player: AuthenticatedUser) => {
        setPlayer(player);
        setUserInfo(player);
      };
      controller.onGameStarted = async () => {
        navigate(UrlGenerator.PlayerPlayUrl(hostId));
      };
      await controller.initSocket(hostId);
    })();
  }, []);

  useLayoutEffect(() => {
    const maxMobile = SCREEN_SIZES_ENUM.MOBILE_W;

    const screenW = window.innerWidth;
    if (screenW <= maxMobile) {
      setShowAvatarPicker(false);
    }
  }, []);

  return (
    <>
      <div className="waiting-lobby-player">
        <div className="waiting-lobby-player__header">
          <div className="waiting-lobby-player__header-first">
            {player?.username}
          </div>
          <div className="waiting-lobby-player__header-second">
            <RenderIf condition={isJoining}>
              <div>Joining Game . . .</div>
            </RenderIf>
          </div>
          <div></div>
        </div>
        <div className="waiting-lobby-player__body">
          <div className="waiting-lobby-player__body-background"></div>
          <RenderIf condition={isJoined}>
            <RenderIf condition={showAvatarPicker}>
              <div
                className="dismiss-back"
                onClick={() => setShowAvatarPicker(false)}
              ></div>
              <AvatarPicker
                pickedCallback={(avatarId: string) => {
                  const maxMobile = SCREEN_SIZES_ENUM.MOBILE_W;

                  const screenW = window.innerWidth;
                  if (screenW <= maxMobile) {
                    setShowAvatarPicker(false);
                  }
                }}
              />
            </RenderIf>
            <div className="waiting-lobby-player__body-content">
              <UniButton
                text="Change Avatar"
                className="waiting-lobby-player__body-content-change-avatar"
                onClick={() => {
                  setShowAvatarPicker(true);
                }}
              />
              <div className="waiting-lobby-player__body-content-avatar">
                <img src={player?.avatar} alt="" />
                <div className="ribbon"></div>
              </div>
              <div className="waiting-lobby-player__body-content-footer">
                <button>
                  <div></div>
                  <div>
                    <span>
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="gamepad"
                        className="svg-inline--fa fa-gamepad fa-w-20 "
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 512"
                      >
                        <path
                          fill="currentColor"
                          d="M480.07 96H160a160 160 0 1 0 114.24 272h91.52A160 160 0 1 0 480.07 96zM248 268a12 12 0 0 1-12 12h-52v52a12 12 0 0 1-12 12h-24a12 12 0 0 1-12-12v-52H84a12 12 0 0 1-12-12v-24a12 12 0 0 1 12-12h52v-52a12 12 0 0 1 12-12h24a12 12 0 0 1 12 12v52h52a12 12 0 0 1 12 12zm216 76a40 40 0 1 1 40-40 40 40 0 0 1-40 40zm64-96a40 40 0 1 1 40-40 40 40 0 0 1-40 40z"
                        ></path>
                      </svg>
                    </span>
                  </div>
                </button>
                <div className="waiting-lobby-player__body-content-footer-text">
                  Waiting for Host
                </div>
              </div>
            </div>
          </RenderIf>
        </div>
      </div>
    </>
  );
}

export default tokenRequire(WaitingLobbyPlayer);
