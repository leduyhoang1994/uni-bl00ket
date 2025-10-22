import RenderIf from "@/game/common/utils/condition-render";
import FormSubmit from "../../../components/form-submit/form-submit";
import { ChangeEvent, useLayoutEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import HostController from "../../../controller";
import { UrlGenerator } from "@/game/common/utils/utils";
import ChooseAvatarHostPlayer from "../../../components/choose-avatar-host-player/choose-avatar-host-player";

export default function HostPlayer() {
  const { hostId } = useParams();
  const hasIdGame = hostId ? true : false;
  const [hostIdValue, setHostIdValue] = useState("");
  const [username, setUsername] = useState("");
  const [changeStateAvatar, setChangeStateAvatar] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useLayoutEffect(() => {
    (async () => {
      sessionStorage.clear();
    })();
  }, []);

  const handleWriteName = () => {
    if (username.length == 0) {
      alert("Vui lòng nhập biệt danh");
      return;
    }
    setChangeStateAvatar(true);
  };

  const gameIdValue = (e: ChangeEvent<HTMLInputElement>) => {
    setHostIdValue(e.target.value);
  };

  const chooseHost = async () => {
    navigate(UrlGenerator.PlayerJoinUrl(hostIdValue));
  };

  const nickNameValue = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const joinHost = async (avatar: string) => {
    if (!hostId) {
      navigate(UrlGenerator.PlayerJoinUrl());
      return;
    }

    const controller = await HostController.getInstance();
    await controller.initHttp();
    const meta = searchParams.get("meta") || undefined;
    
    const guestToken = await controller.createGuest(username, hostId, avatar, meta);

    if (!guestToken) {
      alert(
        "Biệt danh này đã có người khác chọn. Vui lòng chọn biệt danh khác"
      );
      return;
    }

    await HostController.saveAccessToken(guestToken);

    navigate(UrlGenerator.PlayerJoinLobbyUrl(hostId));
  };

  return (
    <div className="host-player">
      <div className="host-player__header">
        <div className="host-player__header-first">
          <a href="">UniClass</a>
        </div>
        <div className="host-player__header-second">
          {!changeStateAvatar ? "Tham gia trò chơi" : "Chọn nhân vật"}
        </div>
        <div className="host-player__header-third">
          <a href="">Tổng quan</a>
        </div>
      </div>
      <div className="host-player__body" style={{ overflowY: "auto" }}>
        <div className="body-background-wrapper">
          <div className="body-background"></div>
        </div>
        <RenderIf condition={!changeStateAvatar}>
          <div className="host-player__body-main">
            <RenderIf condition={!hasIdGame}>
              <FormSubmit
                onChangeInputValue={gameIdValue}
                btnOnclick={chooseHost}
              />
            </RenderIf>
            <RenderIf condition={hasIdGame}>
              <FormSubmit
                textTitle="NHẬP BIỆT DANH"
                placeholderText="Biệt danh"
                inputClass="host-player__body-main-cover-input-nick-name"
                maxLength={15}
                onChangeInputValue={nickNameValue}
                btnOnclick={() => handleWriteName()}
              />
            </RenderIf>
          </div>
        </RenderIf>
        <RenderIf condition={changeStateAvatar}>
          <ChooseAvatarHostPlayer
            username={username}
            nickNameValue={nickNameValue}
            joinHost={joinHost}
          />
        </RenderIf>
      </div>
    </div>
  );
}
