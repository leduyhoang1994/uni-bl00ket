import {
  Body,
  Controller,
  FormField,
  Get,
  Path,
  Post,
  Route,
  Security,
  Tags,
  UploadedFile,
} from "tsoa";
import GameRepo from "../game/game.repo";
import JsonResponse from "../utils/response";
import { xlsx2json } from "../game/utils";
import { QuestionConvertError } from "../base/errors/game.error";
import GameQuestionRepo from "../game/game-quesion.repo";
import { JWT_SECRET } from "../servers/api.server";
import { CmsUser } from "@Common/types/cms.type";
import jwt from "jsonwebtoken";
import { LoginFailedError } from "../base/errors/auth.error";

type GameListOpts = {
  /**
   * Tìm kiếm
   */
  search?: string;

  /**
   * @isInt
   * @default 1
   */
  page?: number;

  /**
   * @isInt
   * @default 10
   */
  limit?: number;
};

@Route("cms")
@Tags("CMS API")
export class CmsController extends Controller {
  /**
   * Tạo game mới
   */
  @Security("cmsBearerAuth")
  @Post("game")
  public async createGame(
    @UploadedFile() game_questions: Express.Multer.File,
    @FormField() game_name: string,
    @FormField() game_mode: string
  ) {
    const game = await GameRepo.createGame(game_name, game_mode);
    if (game_questions) {
      const jsonQuestions = xlsx2json(game_questions.buffer);
      if (!jsonQuestions) {
        throw new QuestionConvertError();
      }

      await GameQuestionRepo.insertGameQuestions(game._id, jsonQuestions);
    }
    return JsonResponse({ game });
  }

  /**
   * Lấy thông tin game
   */
  @Security("cmsBearerAuth")
  @Get("game/{game_id}")
  public async getGame(@Path() game_id: string) {
    const game = await GameRepo.findGameById(game_id);
    const gameQuestions = await GameQuestionRepo.getGameQuestions(game_id);
    return JsonResponse({ game, game_questions: gameQuestions });
  }

  /**
   * Cập nhật game
   */
  @Security("cmsBearerAuth")
  @Post("game/update")
  public async updateGame(
    @UploadedFile() game_questions: Express.Multer.File,
    @FormField() game_id: string,
    @FormField() game_name: string,
    @FormField() game_mode: string
  ) {
    const game = await GameRepo.updateGame(game_id, game_name, game_mode);
    if (game_questions) {
      const jsonQuestions = xlsx2json(game_questions.buffer);
      if (!jsonQuestions) {
        throw new QuestionConvertError();
      }

      await GameQuestionRepo.insertGameQuestions(game_id, jsonQuestions);
    }
    const gameQuestions = await GameQuestionRepo.getGameQuestions(game_id);

    return JsonResponse({ game, game_questions: gameQuestions });
  }

  /**
   * Danh sách game
   */
  @Security("cmsBearerAuth")
  @Post("game/list")
  public async listGame(@Body() body: GameListOpts) {
    const games = await GameRepo.findAllGames(
      body.search,
      body.page || 1,
      body.limit || 10
    );
    return JsonResponse(games);
  }

  /**
   * Đăng nhập
   */
  @Post("auth/login")
  public async login(@Body() body: { username: string; password: string }) {
    if (body.username !== "admin" || body.password !== "uniclass@123") {
      throw new LoginFailedError();
    }

    const user: CmsUser = {
      id: "1",
      username: body.username,
    };

    const token = jwt.sign(user, JWT_SECRET);
    return JsonResponse({ user, token });
  }
}
