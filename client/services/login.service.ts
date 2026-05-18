// services/auth/login.ts

import { apiFetch } from "./api";

type LoginPayload = {
  email: string;
  password: string;
};

export async function login(
  data: LoginPayload
) {

  return apiFetch<null>(
    "/login",
    {
      method: "POST",

      credentials: "include",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(data),
    }
  );
}