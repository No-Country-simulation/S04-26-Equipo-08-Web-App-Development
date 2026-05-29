import { ApiResponse } from "@/types/api.types";
import { useAuthStore } from "@/app/store/use-auth-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = useAuthStore.getState().token;
  const isFormData = options?.body instanceof FormData;

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchOptions: RequestInit = {
    credentials: "include",
    ...options,
    headers: {
      ...authHeader,
      ...(isFormData
        ? (options?.headers as Record<string, string>)
        : { "Content-Type": "application/json", ...(options?.headers as Record<string, string>) }),
    },
  };

  const response = await fetch(`${API_URL}/v1${endpoint}`, fetchOptions);

  const result: ApiResponse<T> = await response.json();

  if (!result.ok) {
    return Promise.reject(result.message);
  }

  return result.data;
}
