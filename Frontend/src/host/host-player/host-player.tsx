import RenderIf from "@/utils/condition-render";
import ButtonSubmit from "../components/button/button-submit";
import FormSubmit from "../components/form-submit/form-submit";
import { ChangeEvent } from "react";

export default function HostPlayer() {

  const hasIdGame = true;

  const gameIdValue = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);

  }

  const doClickSendValueGameId = () => {
    console.log('doClickSendValueGameId');

  }

  const nickNameValue = (e: ChangeEvent<HTMLInputElement>) => {

  }

  const doClickSendNickName = () => {
    console.log('doClickSendNickName');

  }

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
              btnOnclick={doClickSendValueGameId} />
          </RenderIf>
          <RenderIf condition={hasIdGame}>
            <FormSubmit
              textTitle="Enter Nickname"
              placeholderText="Nickname"
              inputClass='host-player__body-main-cover-input-nick-name'
              maxLength={15}
              onChangeInputValue={nickNameValue}
              btnOnclick={doClickSendNickName} />
          </RenderIf>
        </div>
      </div>
    </div>
  )
}