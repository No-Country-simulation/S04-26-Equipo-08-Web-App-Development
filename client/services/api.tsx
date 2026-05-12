import { ApiResponse } from "@/types/api.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {

  const response = await fetch(
    `${API_URL}${endpoint}`,
    options
  );

  const result: ApiResponse<T> =
    await response.json();

  return result;
}