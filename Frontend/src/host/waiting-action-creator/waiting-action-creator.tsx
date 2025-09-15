import ButtonPlayer from "../components/button/button-player";
import ShowTotalMoney from "../components/show-total-money/show-total-money";
import WatchPlayerBoard from "../components/watch-player-board/watch-player-board";

export default function WaitingActionCreator() {
  return (
    <div className="waiting-action-creator">
      <div className="waiting-action-creator__header">
        <div className="waiting-action-creator__header-first">Blooket</div>
        <div className="waiting-action-creator__header-second">Goal: $100,000</div>
        <div className="waiting-action-creator__header-third">ID: 600138</div>
      </div>
      <div className="waiting-action-creator__body">
        <div className="waiting-action-creator__body-cover-btn">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((value: number, index: number) => {
            const userNumber = index + 1;
            const position = `translateY(${index * 11.5}vh)`;
            return (
              <div key={index} style={{ transform: `${position}`, position: 'absolute' }}>
                <ButtonPlayer userNumber={userNumber} />
              </div>
            )
          })}
        </div>
        <div>
          <div>
            <WatchPlayerBoard />
          </div>
          <div>
            <ShowTotalMoney />
          </div>
        </div>
      </div>
    </div>
  )
}