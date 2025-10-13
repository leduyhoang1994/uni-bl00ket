import { GameMode } from "@Common/constants/host.constant";

export type Game = {
  _id: string;
  name: string;
  mode: GameMode;
};

export type Question = {
  id: string;
  text: string;
  answers: { id: string; text: string }[]; // danh sách đáp án
  correctAnswerId: string; // id của đáp án đúng
};

export type GameQuestions = {
  _id: string;
  questions: Array<Question>;
};
