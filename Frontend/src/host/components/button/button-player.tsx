export default function ButtonPlayer({ userNumber = 1, score = 0, name = "" }) {
  let numberText = "st";
  if (userNumber == 2) {
    numberText = "nd";
  }
  if (userNumber == 3) {
    numberText = "rd";
  }
  if (userNumber > 3) {
    numberText = "th";
  }
  return (
    <div className="button-player__cover">
      <button className="button-player">
        <div className="button-player__user-number">
          <div>{userNumber}</div>
          <div>{numberText}</div>
        </div>
        <div className="button-player__user-avatar">
          <img src="/images/avatar/blook-penguin.svg" alt="" />
        </div>
        <div className="button-player__user-name">{name}</div>
        <div className="button-player__user-money">${score}</div>
      </button>
    </div>
  );
}
