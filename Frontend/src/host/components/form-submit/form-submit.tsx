import { ChangeEvent } from "react";
import ButtonSubmit from "../button/button-submit";

export default function FormSubmit({
  textTitle = 'Blooket',
  placeholderText = 'Game ID',
  maxLength = 7,
  inputClass = '',
  onChangeInputValue = (e: ChangeEvent<HTMLInputElement>) => { },
  btnOnclick = () => { }
}) {
  return (
    <div>
      <h1>{textTitle}</h1>
      <div className="host-player__body-main-content" >
        <div className={`host-player__body-main-cover-input ${inputClass}`}>
          <input type="text" placeholder={placeholderText} aria-label="Enter Game ID" maxLength={maxLength}
            autoFocus defaultValue="" id="game-id" name="gameId" onChange={onChangeInputValue} />
        </div>
        <div>
          <ButtonSubmit btnOnclick={btnOnclick} />
        </div>
      </div>
    </div>
  )
}