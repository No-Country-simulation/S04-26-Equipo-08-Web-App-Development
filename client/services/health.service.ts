import { apiFetch } from "./api";

export async function getHealth() {

  const result =
    await apiFetch<boolean>("/health");

  if (!result.ok) {
    throw new Error(result.message);
  }

  return result;
}

// apiFetch<T>(`/health`)