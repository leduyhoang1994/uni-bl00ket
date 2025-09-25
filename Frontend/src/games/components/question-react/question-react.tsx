import QuizStore from "@/stores/quiz-store/quiz-store";
import SettingAudioReactIcon from "../setting-audio-react/setting-audio-react-icon";
import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import { useEffect, useRef, useState } from "react";
import { getCafeControllerInstance } from "@/games/cafe-game/cafe-controller.singleton";
import gsap from "gsap";

export default function QuestionReact() {
  const {
    setToggleQuizContainer,
    toggleQuizContainer,
    setShowCongraEffect,
    showCongraEffect,
    setAnswerQuiz,
    answerQuiz,
    currentQuestion,
    setIsCorrect,
    setAnsweredId
  } = QuizStore();
  const { loadCafeStocks } = CafeGameStore();

  const question = currentQuestion?.text;
  const answers = currentQuestion?.answers;

  const backgroundColorAnswer = [
    "question-react__answer-yellow",
    "question-react__answer-blue",
    "question-react__answer-green",
    "question-react__answer-red"
  ]
  const [allowCloseBlock, setAllowCloseBlock] = useState(false);
  const quizContainer = useRef<any>(null);
  const blockAnswer = useRef<any>(null);

  const doClickAnswser = (answerId: any) => {
    console.log('doClickAnswser', answerId);

    setAnswerQuiz(true);
    const cafeController = getCafeControllerInstance();
    const userAnswer = cafeController.answerQuestion(answerId);
    setAnsweredId(answerId);
    setIsCorrect(userAnswer.correct);

    if (!userAnswer.correct) {
      setAllowCloseBlock(false);
      setTimeout(() => {
        setAllowCloseBlock(true);
      }, 2000);
      return;
    }
    setAllowCloseBlock(true);
    setShowCongraEffect(true);
    loadCafeStocks();
  };

  useEffect(() => {
    if (!toggleQuizContainer) return;

    gsap.fromTo(
      quizContainer.current,
      { scale: 0 },
      { scale: 1, duration: 0.2, ease: "none" }
    );
  }, [toggleQuizContainer]);

  useEffect(() => {
    if (answerQuiz && blockAnswer.current && allowCloseBlock) {
      blockAnswer.current.off("pointerup");
      blockAnswer.current.on("pointerup", () => {
        setToggleQuizContainer(false);
        setAnswerQuiz(false);
        setShowCongraEffect(false);
      });
    }
  }, [answerQuiz, allowCloseBlock]);

  if (!toggleQuizContainer) {
    return null;
  }


  return (
    <div className="question-react" ref={quizContainer}>
      <div className="question-react__header">
        <div className="question-react__header-left">
          <img src="/images/icons/audio-question.svg" alt="" />
          <div>username</div>
        </div>
        <div className="question-react__header-right">
          <img src="/images/cafe-game/leader-board.svg" alt="" />
          <SettingAudioReactIcon />
        </div>
      </div>
      <div className="question-react__body">
        <div className="question-react__body-content">{question || 'a'}</div>
        <div className="question-react__body-content-answers">
          {answers?.map((answer, i) => {
            const answerText = answer?.text || '';
            const answerId = answer?.id;
            return (
              <div
                key={`${i}-${answer}`}
                className={`question-react__answer ${backgroundColorAnswer[i]}`}
                onPointerUp={() => doClickAnswser(answerId)}>
                {answerText}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}