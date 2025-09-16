import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import { useExtend } from "@pixi/react";
import { Assets, Sprite, Texture } from "pixi.js";

const LEADER_BOARD_SIZE = 45;

export default function LeaderBoardScreenIcon() {
  useExtend({ Sprite });
  const { tagMoneyWidth, toggleLeaderBoard, setToggleLeaderBoard } = CafeGameStore();
  const textureLeaderBoard = Assets.get("leader-board");

  const doClickLeaderBoard = () => {
    setToggleLeaderBoard(!toggleLeaderBoard);
  }

  return (
    <pixiContainer
      interactive={true}
      eventMode="static"
      cursor="pointer"
      onPointerDown={doClickLeaderBoard}
    >
      {textureLeaderBoard !== Texture.EMPTY && (
        <pixiTilingSprite
          texture={textureLeaderBoard}
          x={tagMoneyWidth + 10}
          y={0}
          width={LEADER_BOARD_SIZE}
          height={LEADER_BOARD_SIZE}
        />
      )}
    </pixiContainer >
  )
}