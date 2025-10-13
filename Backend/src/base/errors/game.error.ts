import { CmsCode } from "@Common/constants/error-code.constant";
import { UniError } from "./base.error";

export class GameNameExistedError extends UniError {
  constructor() {
    super("Tên game đã tồn tại");
  }

  getCode(): number {
    return CmsCode.GameNameExisted;
  }

  getHttpCode(): number {
    return 400;
  }
}

export class GameNotFoundError extends UniError {
  constructor() {
    super("Game không tồn tại");
  }

  getCode(): number {
    return 1404;
  }

  getHttpCode(): number {
    return 404;
  }
}

export class QuestionConvertError extends UniError {
  constructor() {
    super("Lỗi chuyển đổi câu hỏi");
  }

  getCode(): number {
    return 1401;
  }

  getHttpCode(): number {
    return 400;
  }
}