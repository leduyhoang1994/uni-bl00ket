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
import UserPlayerInfo from "../components/player-info/user-player-infor";

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

      console.log(await HostController.getAccessToken());

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
          <div className="waiting-lobby-player__header-second">Pre-Class</div>
          <div className="waiting-lobby-player__header-first">
            Đợi trò chơi bắt đầu
          </div>
          <div></div>
        </div>
        <div className="waiting-lobby-player__body">
          <div className="waiting-lobby-player__body-background"></div>
          <RenderIf condition={isJoined}>
            <div className="waiting-lobby-player__body-content m-auto">
              <div className="waiting-lobby-player__body-content-avatar">
                <img src={player?.avatar} alt="" />
                <div className="ribbon"></div>
              </div>
              <div className="waiting-lobby-player__body-content-footer">
                <div className="waiting-lobby-player__body-content-footer-text">
                  Đợi trò chơi bắt đầu
                </div>
              </div>
            </div>
          </RenderIf>
          {/* <div className="host-creator__body-cover-player">
            {[1, 2, 3, 4, 5, 6, 7].map((player, index: number) => {
              return (
                <div className="waiting-lobby-player__user-infor" key={index}>
                  <UserPlayerInfo
                    player={{
                      avatar: "/images/cafe-game/customers/chick.svg",
                      username: "abc",
                      id: "",
                      socketId: "",
                    }}
                  />
                </div>
              );
            })}
          </div> */}
        </div>
      </div>
    </>
  );
}

export default tokenRequire(WaitingLobbyPlayer);
