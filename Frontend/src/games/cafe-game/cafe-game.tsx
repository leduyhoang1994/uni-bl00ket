import RenderIf from "@/utils/condition-render";
import QuestionScreen from "../components/question-screen/question-screen";
import UpgradesScreen from "./screens/shop/upgrade-screen";
import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import { useEffect } from "react";
import QuizStore from "@/games/stores/quiz-store/quiz-store";
import CustomerDesk from "./screens/customer-desk/customer-desk";

export default function CafeGame() {
  const { toggleVisitShop, loadCafeData } = CafeGameStore();
  const { toggleQuizContainer } = QuizStore();

  useEffect(() => {
    loadCafeData();
  }, [])

  return (
    <>
      <RenderIf condition={!toggleQuizContainer}>
        <CustomerDesk />
      </RenderIf>
      <QuestionScreen />
      <RenderIf condition={toggleVisitShop}>
        <UpgradesScreen />
      </RenderIf>
    </>
  );
}