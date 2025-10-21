import QuizStore from "@/game/common/components/quiz/store";
import { ReactElement, useEffect, useLayoutEffect, useRef, useState } from "react";
import CongratulationEffect from "./congratulation-effect";
import RenderIf from "@/game/common/utils/condition-render";
import HostStore from "@/game/host/store";
import "./quiz.scss";
import GameController from "../../game.controller";

export default function Quiz({
  gameController,
  answerCallback,
  onQuizDissmiss,
  children
}: {
  gameController: GameController;
  answerCallback?: (correct: boolean) => void;
  onQuizDissmiss?: (correct: boolean) => void;
  children?: ReactElement
}) {
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
    isCorrect,
  } = QuizStore();
  const { userInfo } = HostStore();
  const answersContainerRef = useRef<HTMLDivElement>(null);

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

  const doClickAnswser = (answerId: any, e: any) => {
    const divAnswers = document.querySelectorAll(".question-react__answer");
    divAnswers.forEach((el) =>
      el.classList.add("question-react__answer-default")
    );
    setAnswerQuiz(true);
    const userAnswer = gameController.answerQuestion(answerId);
    setAnsweredId(answerId);
    setIsCorrect(userAnswer.correct);

    if (!userAnswer.correct) {
      if (e.target && (e.target as HTMLElement).classList) {
        (e.target as HTMLElement).classList.add(
          "question-react__answer-incorrect"
        );
      }
      setAllowCloseBlock(false);
      setTimeout(() => {
        setAllowCloseBlock(true);
      }, 2000);

      if (answerCallback) {
        answerCallback(false);
      }
      return;
    }
    if (e.target && (e.target as HTMLElement).classList) {
      (e.target as HTMLElement).classList.add("question-react__answer-correct");
    }
    setAllowCloseBlock(true);
    setShowCongraEffect(true);

    if (answerCallback) {
      answerCallback(true);
    }
  };

  const doClickOutQuestion = () => {
    if (!allowCloseBlock) {
      return;
    }
    setToggleQuizContainer(false);
    setAnswerQuiz(false);
    setShowCongraEffect(false);
    if (onQuizDissmiss) {
      onQuizDissmiss(isCorrect);
    }
  };

  useEffect(() => {
    if (!toggleQuizContainer) return;

    quizContainer.current.animate(
      [{ transform: "scale(0)" }, { transform: "scale(1)" }],
      {
        duration: 200,
        easing: "linear",
        fill: "forwards",
      }
    );
  }, [toggleQuizContainer]);

  useEffect(() => {
    if (answerQuiz && headerRef.current) {
      if (!isCorrect) {
        headerRef.current.classList.add("question-react__header-incorrect");
      } else {
        headerRef.current.classList.add("question-react__header-correct");
      }
    }
  }, [answerQuiz, headerRef]);

  useLayoutEffect(() => {
    if (!toggleQuizContainer || !answersContainerRef.current) {
      return;
    }
    const answerElements = Array.from(
      answersContainerRef.current.children
    ) as HTMLElement[];

    if (answerElements.length === 0) {
      return;
    }
    answerElements.forEach((el) => {
      el.style.height = "auto";
    });
    const maxHeight = Math.max(
      ...answerElements.map((el) => el.offsetHeight)
    );
    answerElements.forEach((el) => {
      el.style.minHeight = `${maxHeight}px`;
    });
  }, [answers, toggleQuizContainer]);

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
          <div className="question-react__header-mid">
            {isCorrect ? "Chính xác" : "Sai đáp án"}
          </div>
        </RenderIf>
        <RenderIf condition={!!children}>
          {children}
        </RenderIf>
      </div>
      <div className="question-react__body">
        <div className="question-react__body-content">
          <div className="question-react__body-content-title">
            {question || "a"}
          </div>
          <RenderIf condition={answerQuiz}>
            <RenderIf condition={allowCloseBlock}>
              <div className="question-react__body-content-allow">
                <div
                  className="question-react__body-content-allow-inside"
                  onClick={doClickOutQuestion}
                >
                  <div
                    className={`${isCorrect
                      ? "question-react__body-content-allow-inside-correct"
                      : "question-react__body-content-allow-inside-incorrect"
                      }`}
                  >
                    <img
                      src={`${isCorrect
                        ? "/images/icons/question-correct.svg"
                        : "/images/icons/question-wrong.svg"
                        }`}
                      alt=""
                    />
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
        <div className="question-react__body-content-answers" ref={answersContainerRef}>
          {answers?.map((answer, i) => {
            const answerText = answer?.text || "";
            const answerId = answer?.id;
            return (
              <div
                key={`${i}-${answer}`}
                className={`question-react__answer ${backgroundColorAnswer[i]}`}
                onClick={(e) => doClickAnswser(answerId, e)}
              >
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
        <div
          className="question-react__mask"
          onClick={doClickOutQuestion}
        ></div>
      </RenderIf>
    </div>
  );
}
