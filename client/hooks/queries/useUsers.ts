import { getUsers, getUser, deleteUser } from "@/services/admin.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Contractor } from "@/types/admin";
import type { BackendUser } from "@/types/onboarding.types";

function mapUserToContractor(u: BackendUser): Contractor {
  return {
    id: u.id,
    name: `${u.firstname ?? ""} ${u.lastname ?? ""}`.trim() || u.email,
    email: u.email,
    phone: u.phone ?? "",
    country: "",
    created_at: u.created_at,
    is_active: u.is_active,
    steps: [],
  };
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const users = await getUsers();
      return users.filter((u) => u.role === "contractor").map(mapUserToContractor);
    },
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
    enabled: !!id,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
