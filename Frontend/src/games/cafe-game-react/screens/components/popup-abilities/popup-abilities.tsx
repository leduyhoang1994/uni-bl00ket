import { ABILITIES, ABILITY_ID } from "@/model/model";

export default function PopupAbilities({
  abilitiesObj = {
    abilityId: ABILITY_ID.PAYCHECK_BONUS,
    player: {
      avatar: '',
      username: '',
    }
  },
  setAbilitiesObj = ({ }) => { },
}) {
  const currentData = ABILITIES.find(item => item.id === abilitiesObj.abilityId);
  const currentImg = currentData?.image;
  const currentDescriptionEnemy = currentData?.descriptionEnemy;
  const username = abilitiesObj.player.username;

  const doClickBtnAccept = () => {
    setAbilitiesObj({});
  }

  return (
    <div className="cafe-game__popup-abilities">
      <div className="cafe-game__popup-abilities-content">
        <div className="cafe-game__popup-abilities-content-detail">
          <img src={`/images/cafe-game/${currentImg}.svg`} alt="" />
          <div className="cafe-game__popup-abilities-content-text">
            <div>
              <img src={abilitiesObj.player.avatar} alt="" />
            </div>
            <b>{username}</b> {currentDescriptionEnemy}
          </div>
        </div>
        <button className="cafe-game__popup-abilities-btn" onPointerUp={doClickBtnAccept}>
          <div>Okay</div>
        </button>
      </div>
    </div>
  )
}