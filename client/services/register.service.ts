import { apiFetch } from "./api";

type RegisterPayload = {
  email: string;
  password: string;
  role: string;
  firstname: string;
  lastname: string;
  phone: string;
};

export type RegisterResponse = {
  id: string;
  email: string;
  role: string;
  firstname: string;
  lastname: string;
  phone: string;
  is_active: boolean;
  created_at: string;
};

export async function register(data: RegisterPayload) {
  return apiFetch<RegisterResponse>("/register", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
