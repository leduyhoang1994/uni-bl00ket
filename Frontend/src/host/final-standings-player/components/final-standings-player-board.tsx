import { HostLeaderboardItem } from "@common/types/host.type";

export type UserRank = {
  number: number;
  text: string;
  hasCurrentUser: boolean;
};

export default function FinalStandingsPlayerBoard({
  userRank = {
    number: 1,
    text: "st",
    hasCurrentUser: false,
  },
  leaderBoardItem,
}: {
  userRank: UserRank;
  leaderBoardItem: HostLeaderboardItem;
}) {
  return (
    <div
      className={`final-stadings-player-board ${
        userRank.hasCurrentUser && "final-stadings-player-board__current"
      }`}
    >
      <div className="final-stadings-player-board__rank">{userRank.number}</div>
      <div className="final-stadings-player-board__rank-text">
        {userRank.text}
      </div>
      <div className="final-stadings-player-board__rank-avatar">
        <img src="/images/avatar/brown-dog.svg" alt="" />
      </div>
      <div className="final-stadings-player-board__rank-user-name">
        {leaderBoardItem.username}
      </div>
      <div className="final-stadings-player-board__rank-user-score">
        {leaderBoardItem.score}
      </div>
    </div>
  );
}
