import { apiFetch } from "./api";
import type { BackendUser } from "@/types/onboarding.types";
import type { OnboardingProgress } from "./onboarding.service";
import type { ContractorDetail } from "@/types/admin";

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

export async function getContractorProgress(id: string) {
  return apiFetch<OnboardingProgress>(`/onboarding/progress/${id}`);
}

export async function getContractorDetail(id: string) {
  return apiFetch<ContractorDetail>(`/onboarding/detail/${id}`);
}

export async function reviewStep(
  profileId: string,
  stepName: string,
  action: "approve" | "reject" | "reset",
  notes?: string,
) {
  return apiFetch<{ message: string }>("/onboarding/steps/review", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profileId, stepName, action, notes }),
  });
}
