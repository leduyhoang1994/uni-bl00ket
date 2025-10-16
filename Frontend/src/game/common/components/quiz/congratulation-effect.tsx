import CongraEffect from "@/game/common/components/quiz/congra";
import { Application } from "@pixi/react";
import { useRef } from "react";

export default function CongratulationEffect() {
  const congraRef = useRef<any>(null);

  return (
    <div className="question-react__congratulation-effect" ref={congraRef}>
      <Application resizeTo={window} autoDensity backgroundAlpha={0}>
        <CongraEffect />
      </Application>
    </div>
  );
}
