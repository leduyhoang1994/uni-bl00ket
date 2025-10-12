import { Player } from "@common/types/host.type";

export default function UserPlayerInfo({ player }: { player: Player }) {
  return (
    <div className="user-player-infor__cover">
      <div className="user-player-infor__image">
        {
          player.avatar && <img src={player.avatar} alt="" />
        }
      </div>
      <button className="user-player-infor">
        <div className="user-player-infor__content change-to-period">{player.username}</div>
      </button>
    </div>
  );
}
