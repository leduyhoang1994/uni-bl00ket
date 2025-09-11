import CongraEffect from "@/games/effects/congra";
import QuizStore from "@/games/stores/quiz-store/quiz-store";
import { useApplication, useExtend } from "@pixi/react";
import gsap from "gsap";
import { Graphics, TextStyle, Text, Container, Texture, Sprite } from "pixi.js";
import { useEffect, useMemo, useRef, useState } from "react";
import AnswerBtn from "./answer-btn";
import { getCafeControllerInstance } from "@/games/cafe-game/cafeController.singleton";
import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import RenderIf from "@/utils/condition-render";

export default function QuestionScreen() {
  useExtend({ Graphics, Text });
  const {
    setToggleQuizContainer,
    toggleQuizContainer,
    setShowCongraEffect,
    showCongraEffect,
    setAnswerQuiz,
    answerQuiz,
    currentQuestion,
  } = QuizStore();
  const { loadCafeStocks } = CafeGameStore();
  const { setIsCorrect, setAnsweredId } = QuizStore();
  const { app } = useApplication();
  const cafeController = getCafeControllerInstance();
  const question = currentQuestion?.text;
  const answers = currentQuestion?.answers;
  const appWidth = app.screen.width;
  const appHeight = app.screen.height;
  const quizContainer = useRef<Container>(null);
  const blockAnswer = useRef<Sprite>(new Sprite());
  const [allowCloseBlock, setAllowCloseBlock] = useState(false);

  const headerHeight = appHeight / 15;
  const shadowHeight = 6;
  const bodyHeight = appHeight / 2 - headerHeight;
  const shadowObj = {
    color: 0x000000,
    alpha: 0.2,
  };

  const gap = 6;
  const answerContainerHeight = appHeight / 2 - gap;
  const answerContainerY = appHeight - answerContainerHeight - gap;
  const answerContainerWidth = appWidth - gap * 2;

  const boxWidth = (answerContainerWidth - gap) / 2;
  const boxHeight = (answerContainerHeight - gap) / 2;

  const baseStyle: any = {
    fontFamily: "Arial, sans-serif",
    fontWeight: "500",
    align: "center",
    wordWrap: true,
    wordWrapWidth: appWidth - 40,
    breakWords: true,
    fontSize: "30%",
  };

  const textStyleQuestion = new TextStyle({ ...baseStyle, fill: "black" });

  const colors = ["#FFA31E", "#3378FF", "#00CF77", "#FF462B"];

  const drawBackground = (g: Graphics) => {
    g.clear();
    g.roundRect(0, 0, appWidth, appHeight, 0).fill({ color: "white" });
  };

  const drawHeader = (g: Graphics) => {
    g.clear();
    g.roundRect(0, 0, appWidth, headerHeight, 0).fill({ color: 0x9a49aa });
    g.roundRect(0, headerHeight - shadowHeight, appWidth, shadowHeight, 0).fill(
      shadowObj
    );
  };

  const drawBody = (g: Graphics) => {
    g.clear();
    g.roundRect(0, 0, appWidth, bodyHeight, 0).fill({ color: "white" });
  };

  const doClickAnswser = (answerId: any) => {
    setAnswerQuiz(true);
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
    <pixiContainer
      label="Quiz layout"
      ref={quizContainer}
      pivot={{ x: appWidth / 2, y: appHeight / 2 }}
      x={appWidth / 2}
      y={appHeight / 2}
    >
      <pixiGraphics draw={drawBackground} />
      <pixiContainer label="Header quiz layout">
        <pixiGraphics draw={drawHeader} />
      </pixiContainer>
      <pixiContainer label="body quiz layout" x={0} y={headerHeight}>
        <pixiGraphics draw={drawBody} />
        <pixiText
          text={question}
          style={textStyleQuestion}
          anchor={0.5}
          x={appWidth / 2}
          y={bodyHeight / 2}
          resolution={2}
        />
        <RenderIf condition={answerQuiz}>
          <RenderIf condition={allowCloseBlock}>
            <pixiText
              text={"Click anywhere to continue !"}
              anchor={0.5}
              x={appWidth / 2}
              y={bodyHeight - 40}
            />
          </RenderIf>
          <RenderIf condition={!allowCloseBlock}>
            <pixiText
              text={"Wait for the abandon time to continue."}
              anchor={0.5}
              x={appWidth / 2}
              y={bodyHeight - 40}
            />
          </RenderIf>
        </RenderIf>
      </pixiContainer>

      <pixiContainer label="Answer quiz layout" x={gap} y={answerContainerY}>
        {answers?.map((answer, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = col * (boxWidth + gap);
          const y = row * (boxHeight + gap);
          const text = answer.text;
          const answerId = answer.id;
          return (
            <AnswerBtn
              answerId={answerId}
              text={text}
              key={i}
              i={i}
              x={x}
              y={y}
              boxWidth={boxWidth}
              boxHeight={boxHeight}
              colors={colors}
              shadowHeight={shadowHeight}
              shadowObj={shadowObj}
              baseStyle={baseStyle}
              doClickAnswser={doClickAnswser}
            />
          );
        })}
      </pixiContainer>
      {showCongraEffect && <CongraEffect />}
      <RenderIf condition={answerQuiz}>
        <pixiSprite
          ref={blockAnswer}
          width={appWidth}
          height={appHeight}
          texture={Texture.EMPTY}
          interactive={allowCloseBlock}
          eventMode="static"
          cursor={allowCloseBlock ? "pointer" : "default"}
        />
      </RenderIf>
    </pixiContainer>
  );
}
