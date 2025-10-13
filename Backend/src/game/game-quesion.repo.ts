import mongoose from "mongoose";
import { UniError } from "../base/errors/base.error";
import { GameQuestions, Question } from "@Common/types/game.type";

const GameQuestionSchema = new mongoose.Schema(
  {
    _id: String,
    game_id: String,
    questions: Array,
  },
  { timestamps: true }
);

const GameQuestionModel = mongoose.model("GameQuestions", GameQuestionSchema);

class GameQuestionRepo {
  static async insertGameQuestions(id: string, questions: Array<Question>) {
    const gameQuestions = await GameQuestionModel.findOneAndUpdate(
      { game_id: id },
      { questions },
      { upsert: true }
    );

    if (!gameQuestions) {
      return null;
    }

    return gameQuestions.toObject() as GameQuestions;
  }

  static async getGameQuestions(id: string) {
    const gameQuestions = await GameQuestionModel.findOne({ game_id: id });
    if (!gameQuestions) {
      return [];
    }
    return (gameQuestions.toObject() as GameQuestions).questions ?? [];
  }
}

export default GameQuestionRepo;
