export class UniError extends Error {
  constructor(message: string) {
    super(message);
  }

  getCode(): number {
    return 500;
  }

  getHttpCode(): number {
    return 500;
  }
}
