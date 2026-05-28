import { apiFetch } from "./api";
import type { BackendUser } from "@/types/onboarding.types";

export async function getUsers() {
  return apiFetch<BackendUser[]>("/users");
}

export async function getUser(id: string) {
  return apiFetch<BackendUser>(`/users/${id}`);
}

export async function deleteUser(id: string) {
  return apiFetch<BackendUser>(`/users/${id}`, {
    method: "DELETE",
  });
}

export async function createUser(data: {
  email: string;
  password: string;
  role: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
}) {
  return apiFetch<BackendUser>("/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateUser(
  id: string,
  data: {
    email?: string;
    role?: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    is_active?: boolean;
  }
) {
  return apiFetch<BackendUser>(`/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
