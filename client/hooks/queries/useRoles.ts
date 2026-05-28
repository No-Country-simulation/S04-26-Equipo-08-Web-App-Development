import { getUsers, updateUser } from "@/services/admin.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { BackendUser } from "@/types/onboarding.types";

export function useAllUsers() {
  return useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const users = await getUsers();
      return users as BackendUser[];
    },
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      updateUser(id, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
