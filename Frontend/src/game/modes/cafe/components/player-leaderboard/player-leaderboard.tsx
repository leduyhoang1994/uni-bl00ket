import CafeGameStore from "@/game/modes/cafe/store";
import HostStore from "@/game/host/store";

export default function PlayerLeaderboard() {
  const { leaderboard, userInfo } = HostStore();
  const { setToggleLeaderBoard } = CafeGameStore();

  function dismissLeaderboard() {
    setToggleLeaderBoard(false);
  }

  return (
    <button
      className="cafe-game__player-leaderboard-dismissible"
      onClick={dismissLeaderboard}
    >
      <div className="cafe-game__player-leaderboard">
        <div className="cafe-game__player-leaderboard-header">
          <div className="cafe-game__player-leaderboard-header-left">
            Bảng xếp hạng
          </div>
          <div className="cafe-game__player-leaderboard-header-right">
            Điểm
          </div>
        </div>

        {leaderboard.map((player, index) => {
          const self = player.playerId === userInfo?.id;
          return (
            <div
              key={index}
              className={`cafe-game__player-leaderboard-row ${
                self ? "self" : ""
              }`}
            >
              <div className="cafe-game__player-leaderboard-row-image">
                <div className="cafe-game__player-leaderboard-row-image-wrapper">
                  <img src={player.avatar} alt="" />
                </div>
              </div>
              <div className="cafe-game__player-leaderboard-row-name">
                {player.username}
              </div>
              <div className="cafe-game__player-leaderboard-row-score">
                {player.score}
              </div>
            </div>
          );
        })}
      </div>
    </button>
  );
}
