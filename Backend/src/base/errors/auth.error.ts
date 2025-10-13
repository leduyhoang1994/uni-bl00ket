import { UniError } from "./base.error";

export class AuthError extends UniError {}

export class LoginFailedError extends UniError {
  constructor() {
    super("Authentication failed");
  }

  getHttpCode(): number {
    return 401;
  }

  getCode(): number {
    return 2401;
  }
}
