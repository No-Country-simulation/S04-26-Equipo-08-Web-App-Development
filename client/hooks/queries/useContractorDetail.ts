import { getContractorDetail, reviewStep } from "@/services/admin.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ContractorDetail } from "@/types/admin";

export function useContractorDetail(id: string) {
  return useQuery<ContractorDetail>({
    queryKey: ["contractorDetail", id],
    queryFn: () => getContractorDetail(id),
    enabled: !!id,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

export function useReviewStep(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      profileId,
      stepName,
      action,
      notes,
    }: {
      profileId: string;
      stepName: string;
      action: "approve" | "reject" | "reset";
      notes?: string;
    }) => reviewStep(profileId, stepName, action, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contractorDetail", id] });
      queryClient.invalidateQueries({ queryKey: ["contractorProgress", id] });
    },
  });
}
