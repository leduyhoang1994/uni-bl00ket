export default function TargetEnemy({
  avatar = '/images/avatar/brown-dog.svg',
  username = 'username',
  score = 0
}) {
  return (
    <button className="choose-player-target__enemy">
      <img src={avatar} alt="" />
      <div className="choose-player-target__enemy-content">
        <div>{username}</div>
        <div>${score}</div>
      </div>
    </button>
  )
}