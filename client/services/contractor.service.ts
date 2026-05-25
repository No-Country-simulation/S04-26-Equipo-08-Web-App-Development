import { apiFetch } from "./api";
import type {
  ContractorProfile,
  OnboardingStep,
  Document,
  Contract,
  PaymentMethod,
  IdentityVerification,
} from "@/types/onboarding.types";

export async function getProfile() {
  return apiFetch<ContractorProfile>("/onboarding/profile");
}

export async function updateProfile(data: Partial<ContractorProfile>) {
  return apiFetch<ContractorProfile>("/onboarding/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function getOnboardingSteps() {
  return apiFetch<OnboardingStep[]>("/onboarding/steps");
}

export async function completeStep(stepName: string) {
  return apiFetch<OnboardingStep>("/onboarding/steps", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ step_name: stepName }),
  });
}

export async function getDocuments() {
  return apiFetch<Document[]>("/onboarding/documents");
}

export async function uploadDocument(data: FormData) {
  return apiFetch<Document>("/onboarding/documents/upload", {
    method: "POST",
    body: data,
  });
}

export async function getContracts() {
  return apiFetch<Contract[]>("/onboarding/contracts");
}

export async function signContract() {
  return apiFetch<Contract>("/onboarding/contracts/sign", {
    method: "POST",
  });
}

export async function getPaymentMethods() {
  return apiFetch<PaymentMethod[]>("/onboarding/payment-methods");
}

export async function createPaymentMethod(data: {
  method_type: string;
  account_holder?: string;
  account_number?: string;
  bank_name?: string;
  swift_code?: string;
  wallet_address?: string;
}) {
  return apiFetch<PaymentMethod>("/onboarding/payment-methods", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function getIdentityVerification() {
  return apiFetch<IdentityVerification>("/onboarding/identity-verification");
}
