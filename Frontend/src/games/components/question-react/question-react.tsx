import QuizStore from "@/stores/quiz-store/quiz-store";
import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import { useEffect, useRef, useState } from "react";
import { getCafeControllerInstance } from "@/games/cafe-game/cafe-controller.singleton";
import gsap from "gsap";
import CongratulationEffect from "./congratulation-effect";
import RenderIf from "@/utils/condition-render";
import HostStore from "@/stores/host-store/host-store";

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
    setAnsweredId,
    isCorrect
  } = QuizStore();
  const { loadCafeStocks, setToggleLeaderBoard } = CafeGameStore();
  const { userInfo } = HostStore();

  const question = currentQuestion?.text;
  const answers = currentQuestion?.answers;

  const backgroundColorAnswer = [
    "question-react__answer-yellow",
    "question-react__answer-blue",
    "question-react__answer-green",
    "question-react__answer-red",
  ];
  const [allowCloseBlock, setAllowCloseBlock] = useState(false);
  const quizContainer = useRef<any>(null);
  const headerRef = useRef<any>(null);
  const blockAnswer = useRef<any>(null);

  const doClickAnswser = (answerId: any, e: any) => {
    const divAnswers = document.querySelectorAll('.question-react__answer');
    divAnswers.forEach((el) => el.classList.add('question-react__answer-default'));
    setAnswerQuiz(true);
    const cafeController = getCafeControllerInstance();
    const userAnswer = cafeController.answerQuestion(answerId);
    setAnsweredId(answerId);
    setIsCorrect(userAnswer.correct);

    if (!userAnswer.correct) {
      if (e.target && (e.target as HTMLElement).classList) {
        (e.target as HTMLElement).classList.add('question-react__answer-incorrect');
      }
      setAllowCloseBlock(false);
      setTimeout(() => {
        setAllowCloseBlock(true);
      }, 2000);
      return;
    }
    if (e.target && (e.target as HTMLElement).classList) {
      (e.target as HTMLElement).classList.add('question-react__answer-correct');
    }
    setAllowCloseBlock(true);
    setShowCongraEffect(true);
    loadCafeStocks();
  };

  const doClickOutQuestion = () => {
    if (!allowCloseBlock) {
      return;
    }
    setToggleQuizContainer(false);
    setAnswerQuiz(false);
    setShowCongraEffect(false);
  }

  useEffect(() => {
    if (!toggleQuizContainer) return;

    gsap.fromTo(
      quizContainer.current,
      { scale: 0 },
      { scale: 1, duration: 0.2, ease: "none" }
    );
  }, [toggleQuizContainer]);

  useEffect(() => {
    if (answerQuiz && headerRef.current) {
      if (!isCorrect) {
        headerRef.current.classList.add('question-react__header-incorrect');
      } else {
        headerRef.current.classList.add('question-react__header-correct');
      }
    }
  }, [answerQuiz, headerRef]);

  if (!toggleQuizContainer) {
    return null;
  }

  return (
    <div className="question-react" ref={quizContainer}>
      <div className={`question-react__header`} ref={headerRef}>
        <div className="question-react__header-left">
          {/* <img src="/images/icons/audio-question.svg" alt="" /> */}
          <div>{userInfo?.username}</div>
        </div>
        <RenderIf condition={answerQuiz}>
          <div className="question-react__header-mid">{isCorrect ? 'Chính xác' : 'Sai đáp án'}</div>
        </RenderIf>
        <div className="question-react__header-right">
          <img src="/images/cafe-game/leader-board.svg" alt="" onClick={() => setToggleLeaderBoard(true)} />
          {/* <SettingAudioReactIcon /> */}
        </div>
      </div>
      <div className="question-react__body">
        <div className="question-react__body-content">
          <div className="question-react__body-content-title">{question || 'a'}</div>
          <RenderIf condition={answerQuiz}>
            <RenderIf condition={allowCloseBlock}>
              <div className="question-react__body-content-allow">
                <div className="question-react__body-content-allow-inside">
                  <div className={`${isCorrect ? 'question-react__body-content-allow-inside-correct' : 'question-react__body-content-allow-inside-incorrect'}`}>
                    <img src={`${isCorrect ? '/images/icons/question-correct.svg' : '/images/icons/question-wrong.svg'}`} alt="" />
                  </div>
                  <div>Nhấn bất kỳ đâu để tiếp tục.</div>
                </div>
              </div>
            </RenderIf>
            <RenderIf condition={!allowCloseBlock}>
              <div className="question-react__body-content-allow">
                <div className="question-react__body-content-allow-inside">
                  <div className="question-react__body-content-allow-inside-incorrect">
                    <img src="/images/icons/question-wrong.svg" alt="" />
                  </div>
                  <div>Vui lòng chờ chút.</div>
                </div>
              </div>
            </RenderIf>
          </RenderIf>
        </div>
        <div className="question-react__body-content-answers">
          {answers?.map((answer, i) => {
            const answerText = answer?.text || "";
            const answerId = answer?.id;
            return (
              <div
                key={`${i}-${answer}`}
                className={`question-react__answer ${backgroundColorAnswer[i]}`}
                onClick={(e) => doClickAnswser(answerId, e)}>
                {answerText}
              </div>
            );
          })}
        </div>
      </div>
      <RenderIf condition={showCongraEffect}>
        <CongratulationEffect />
      </RenderIf>
      <RenderIf condition={answerQuiz}>
        <div className="question-react__mask" onClick={(doClickOutQuestion)}></div>
      </RenderIf>
    </div>
  );
}
