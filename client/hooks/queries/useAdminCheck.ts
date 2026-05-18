import { checkAdmin } from "@/services/adminCheck.service";
import { useQuery } from "@tanstack/react-query";

export function useAdminCheck() {
  return useQuery({
    queryKey: ["adminCheck"],
    queryFn: checkAdmin,

    // Mantiene datos frescos 5 minutos
    staleTime: 1000 * 60 * 5,

    // Mantiene cache 10 minutos
    gcTime: 1000 * 60 * 10,

    // Evita refetch al volver a la ventana
    refetchOnWindowFocus: false,

    // Evita refetch al reconectarse
    refetchOnReconnect: false,

    // Evita repetir si falla
    retry: 1,
  });
}