export interface ApiSuccessResponse<T> {
  ok: true;
  code: number;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  ok: false;
  code: number;
  message: string;
  error: true;
  details: unknown;
}

export type ApiResponse<T> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse;