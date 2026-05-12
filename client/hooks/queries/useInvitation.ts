import { validateInvitation } from "@/services/invitation.service";
import { useQuery } from "@tanstack/react-query";

export function useInvitation(
  token: string
) {
  return useQuery({
    queryKey: ["invitation", token],

    queryFn: () =>
      validateInvitation(token),

    enabled: !!token,

    retry: 1,

    refetchOnWindowFocus: false,

    staleTime: 1000 * 60 * 5,
  });
}