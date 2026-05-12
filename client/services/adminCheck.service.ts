import { apiFetch } from "./api";

export async function checkAdmin() {

  const result =
    await apiFetch<boolean>("/admin-check");

    if (!result.ok) {
      throw new Error(result.message);
    }
    return result;
}