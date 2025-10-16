import { useRef } from "react";
import styles from "./game.module.css";
import GameContainerReact from "./application";

export default function GameApplication() {
  const gameContainer = useRef(null);

  return (
    <div ref={gameContainer} className={styles.game_container}>
      <GameContainerReact />
    </div>
  );
}
