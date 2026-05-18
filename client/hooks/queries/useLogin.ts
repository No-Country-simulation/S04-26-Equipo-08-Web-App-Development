// hooks/auth/useLogin.ts

import { login } from "@/services/login.service";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}