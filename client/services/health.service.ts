import { apiFetch } from "./api";

export async function getHealth() {
  const result = await apiFetch<any>("/health");
  return result;
}