import { GameMode, GameModePicture } from "@common/constants/host.constant";

export default function GameModePicker({
  gameMode,
  setGameMode,
}: {
  gameMode: GameMode;
  setGameMode: (gameMode: GameMode) => void;
}) {
  return (
    <div className="game-mode-picker">
      {Object.values(GameMode).map((mode) => (
        <div
          key={mode}
          className={`game-mode-picker__item ${
            gameMode === mode ? "selected" : ""
          }`}
          onClick={() => {
            setGameMode(mode);
          }}
        >
          <img width={"100%"} src={GameModePicture.get(mode)} alt="" />
        </div>
      ))}
    </div>
  );
}
