import mongoose from "mongoose";
import shortid from "shortid";
import {
  GameNameExistedError,
  GameNotFoundError,
} from "../base/errors/game.error";
import { Game } from "@Common/types/game.type";
import logger from "../utils/logger";

const GameSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: shortid.generate,
    },
    name: { type: String, required: true, unique: true },
    mode: { type: String, required: true },
  },
  { timestamps: true }
);

const GameModel = mongoose.model("Game", GameSchema);

class GameRepo {
  static async createGame(name: string, mode: string) {
    const game = new GameModel({ name, mode });
    try {
      await game.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new GameNameExistedError();
      }
    }
    return game.toObject() as Game;
  }

  static async findGameById(id: string) {
    const data = await GameModel.findById(id);

    if (!data) {
      throw new GameNotFoundError();
    }

    return data.toObject() as Game;
  }

  /**
   * Danh sách game paginated
   * @returns
   */
  static async findAllGames(
    search: string = "",
    page: number = 1,
    limit: number = 10
  ) {
    const findOptions = {};

    if (search) {
      Object.assign(findOptions, {
        name: { $regex: search, $options: "i" },
      });
    }

    if (page == 0) {
      page = 1;
    }

    if (limit == 0) {
      limit = 10;
    }
    const total = await GameModel.countDocuments(findOptions);

    const list = (
      await GameModel.find(findOptions)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
    ).map((game) => game.toObject()) as Array<Game>;

    return {
      list,
      total: total,
      page,
      limit,
      total_page: Math.ceil(total / limit),
    };
  }

  static async findByName(name: string) {
    return (
      await GameModel.find({ name: { $regex: name, $options: "i" } })
    ).map((game) => game.toObject()) as Array<Game>;
  }

  static async updateGame(id: string, name: string, mode: string) {
    const game = await GameModel.findById(id);
    if (!game) {
      throw new GameNotFoundError();
    }
    game.name = name;
    game.mode = mode;
    
    await game.save();
    return game.toObject() as Game;
  }
}

export default GameRepo;
