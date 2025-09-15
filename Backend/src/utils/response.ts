export default function JsonResponse(
  data: any,
  success: boolean = true,
  code: number = 200
) {
  return {
    success,
    code,
    data,
  };
}
