export type ResponseType<T> = {
  success: boolean;
  code: number;
  data: T;
};

export default function JsonResponse<T>(
  data: T,
  success: boolean = true,
  code: number = 200
): ResponseType<T> {
  return {
    success,
    code,
    data,
  };
}
