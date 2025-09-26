import { ABILITY_ID } from "@/model/model";
import { useEffect, useState } from "react";

interface PopupAbilitiesHealthProps {
  healthPopupObj: {
    player: {
      username: string;
    };
  };
  timeBlockEnd: () => void;
}

export default function PopupAbilitiesHealth({
  healthPopupObj = { player: { username: '' } },
  timeBlockEnd = () => { },
}: PopupAbilitiesHealthProps) {
  const [countdown, setCountdown] = useState<number>(8);
  const username = healthPopupObj.player.username;
  useEffect(() => {
    if (countdown <= 0) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      timeBlockEnd();
    }
  }, [countdown, timeBlockEnd]);

  return (
    <div className="cafe-game__popup-abilities-health">
      <div className="cafe-game__popup-abilities-health-container">
        <img src="/images/cafe-game/abilites-background-health.svg" alt="" />
        <div className="cafe-game__popup-abilities-health-content">
          <div><b>{countdown}s</b> until you can resume.</div>
          <div>Targeted by <b>{username}</b></div>
        </div>
      </div>
    </div>
  )
}