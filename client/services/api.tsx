import { ApiResponse } from "@/types/api.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const isFormData = options?.body instanceof FormData;

  const fetchOptions: RequestInit = {
    credentials: "include",
    ...options,
    headers: isFormData
      ? (options?.headers as Record<string, string>)
      : {
          "Content-Type": "application/json",
          ...(options?.headers as Record<string, string>),
        },
  };

  const response = await fetch(`${API_URL}/v1${endpoint}`, fetchOptions);

  const result: ApiResponse<T> = await response.json();

  if (!result.ok) {
    return Promise.reject(result.message);
  }

  return result.data;
}
