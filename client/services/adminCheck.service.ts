import { apiFetch } from "./api";

export async function checkAdmin() {
  return await apiFetch<boolean>(
    "/admin-check"
  );
}