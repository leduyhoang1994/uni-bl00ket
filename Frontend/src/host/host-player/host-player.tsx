import RenderIf from "@/utils/condition-render";
import ButtonSubmit from "../components/button/button-submit";
import FormSubmit from "../components/form-submit/form-submit";
import { ChangeEvent, useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import HostController from "../controllers/host.controller";

export default function HostPlayer() {
  const { hostId } = useParams();
  const hasIdGame = hostId ? true : false;
  const [hostIdValue, setHostIdValue] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useLayoutEffect(() => {
    (async () => {
      if (!hostId) {
        return;
      }

      const accessToken = await HostController.getAccessToken();
      if (accessToken) {
        navigate(`/join/${hostId}/lobby`);
      }
    })();
  });

  const gameIdValue = (e: ChangeEvent<HTMLInputElement>) => {
    setHostIdValue(e.target.value);
  };

  const chooseHost = async () => {
    navigate(`/join/${hostIdValue}`);
  };

  const nickNameValue = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const joinHost = async () => {
    if (!hostId) {
      navigate(`/join`);
      return;
    }

    const controller = await HostController.getInstance();
    await controller.initHttp();
    const guestToken = await controller.createGuest(username, hostId);
    await HostController.saveAccessToken(guestToken);

    navigate(`/join/${hostId}/lobby`);
  };

  return (
    <div className="host-player">
      <div className="host-player__header">
        <div className="host-player__header-first">
          <a href="">Blooket</a>
        </div>
        <div className="host-player__header-second">Join a Game</div>
        <div className="host-player__header-third">
          <a href="">Dashboard</a>
        </div>
      </div>
      <div className="host-player__body">
        <div className="host-player__body-background"></div>
        <div className="host-player__body-main">
          <RenderIf condition={!hasIdGame}>
            <FormSubmit
              onChangeInputValue={gameIdValue}
              btnOnclick={chooseHost}
            />
          </RenderIf>
          <RenderIf condition={hasIdGame}>
            <FormSubmit
              textTitle="Enter Nickname"
              placeholderText="Nickname"
              inputClass="host-player__body-main-cover-input-nick-name"
              maxLength={15}
              onChangeInputValue={nickNameValue}
              btnOnclick={joinHost}
            />
          </RenderIf>
        </div>
      </div>
    </div>
  );
}
