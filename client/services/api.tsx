import { ApiResponse } from "@/types/api.types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {

  const response = await fetch(
    `${API_URL}/v1${endpoint}`,
    options
  );

  const result: ApiResponse<T> =
    await response.json();

  if (!result.ok) {
    return Promise.reject(result.message);
  }

  return result.data;
}