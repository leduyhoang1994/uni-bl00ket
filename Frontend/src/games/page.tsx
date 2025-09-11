
import { Application } from "@pixi/react";
import { useRef } from "react";
import styles from "./game.module.css";
import GameContainer from "./application";

export default function GameApplication() {
  const gameContainer = useRef(null);

  return (
    <div ref={gameContainer} className={styles.game_container}>
      <Application resizeTo={gameContainer} antialias>
        <GameContainer />
      </Application>
    </div>
  );
}
