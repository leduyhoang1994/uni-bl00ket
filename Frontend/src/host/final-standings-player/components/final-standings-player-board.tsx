export default function FinalStandingsPlayerBoard({
  userRank = { name: 'a', number: 1, text: 'st', score: 9, hasCurrentUser: false }
}) {

  return (
    <div className={`final-stadings-player-board ${userRank.hasCurrentUser && 'final-stadings-player-board__current'}`}>
      <div className="final-stadings-player-board__rank">{userRank.number}</div>
      <div className="final-stadings-player-board__rank-text">{userRank.text}</div>
      <div className="final-stadings-player-board__rank-avatar">
        <img src="/images/avatar/brown-dog.svg" alt="" />
      </div>
      <div className="final-stadings-player-board__rank-user-name">{userRank.name}</div>
      <div className="final-stadings-player-board__rank-user-score">{userRank.score}</div>
    </div>
  )
}