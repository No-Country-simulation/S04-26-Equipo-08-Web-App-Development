import { getOnboardingProgress } from "@/services/onboarding.service";
import { useQuery } from "@tanstack/react-query";

export function useOnboardingProgress() {
  return useQuery({
    queryKey: ["onboardingProgress"],
    queryFn: getOnboardingProgress,
    retry: false,
  });
}
