import { getContractorProgress } from "@/services/admin.service";
import { useQuery } from "@tanstack/react-query";

export function useContractorProgress(id: string) {
  return useQuery({
    queryKey: ["contractorProgress", id],
    queryFn: () => getContractorProgress(id),
    retry: false,
  });
}
