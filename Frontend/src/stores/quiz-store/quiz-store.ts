import { getCafeControllerInstance } from "@/games/cafe-game/cafe-controller.singleton";
import { Question } from "@common/types/game.type";
import { create } from "zustand";

type QuizState = {
  currentQuestion: Question | null;
  toggleQuizContainer: boolean;
  showCongraEffect: boolean;
  answerQuiz: boolean;
  isCorrect: boolean;
  answeredId: string;
  setToggleQuizContainer: (toggleQuizContainer: boolean) => void;
  setShowCongraEffect: (showCongraEffect: boolean) => void;
  setAnswerQuiz: (answerQuiz: boolean) => void;
  setCurrentQuestion: (currentQuestion: Question) => void;
  loadNewQuestion: () => void;
  setIsCorrect: (isCorrect: boolean) => void;
  setAnsweredId: (answeredId: string) => void;
};

const initialStateQuiz = {
  toggleQuizContainer: false,
  showCongraEffect: false,
  answerQuiz: false,
  currentQuestion: null,
  isCorrect: false,
  answeredId: "",
};

const QuizStore = create<QuizState>((set, get) => ({
  ...initialStateQuiz,
  setToggleQuizContainer: (toggleQuizContainer) => set({ toggleQuizContainer }),
  setShowCongraEffect: (showCongraEffect) => set({ showCongraEffect }),
  setAnswerQuiz: (answerQuiz) => set({ answerQuiz }),
  setCurrentQuestion: (currentQuestion) => set({ currentQuestion }),
  loadNewQuestion: () => {
    const gameController = getCafeControllerInstance();
    const question = gameController.getQuestion();

    return set({
      currentQuestion: question,
    });
  },
  setIsCorrect: (isCorrect) => set({ isCorrect }),
  setAnsweredId: (answeredId) => set({ answeredId }),
}));

export default QuizStore;
