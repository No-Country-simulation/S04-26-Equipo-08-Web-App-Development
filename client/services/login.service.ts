// services/auth/login.ts

import { apiFetch } from "./api";

type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    firstname: string;
    lastname: string;
  };
};

export async function login(
  data: LoginPayload
) {

  return apiFetch<LoginResponse>(
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