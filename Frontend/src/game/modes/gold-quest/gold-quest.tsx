import styles from "../../game.module.css";
import "./styles/style.scss";

export default function GoldQuest() {
  return (
    <div className={styles.game_container}>
      <button>Man A</button>
      <button>Man B</button>
      
      <div className="game-container-react">Gold Quest</div>
    </div>
  );
}
