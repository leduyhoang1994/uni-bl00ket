import { Player } from "@common/types/host.type";

export default function PlayerInfo({ player }: { player: Player }) {
  return (
    <button className="player-infor">
      <div className="player-infor__image">
        {
          player.avatar && <img src={player.avatar} alt="" />
        }
      </div>
      <div className="player-infor__content">{player.id}</div>
    </button>
  );
}
