import { apiFetch } from "./api";

export type StepData = {
  step_name: string;
  completed: boolean;
  completed_at: string | null;
  notes: string | null;
};

export type OnboardingProgress = {
  profileExists: boolean;
  onboardingStatus: string | null;
  steps: StepData[];
};

export async function getOnboardingProgress() {
  return apiFetch<OnboardingProgress>("/onboarding/progress");
}
