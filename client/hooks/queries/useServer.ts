import { getHealth } from "@/services/health.service";
import { useQuery } from "@tanstack/react-query";

export function useHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: getHealth,

    // Revisa estado automáticamente cada 30s
    refetchInterval: 1000 * 30,

    // Evita múltiples refetch innecesarios
    refetchOnWindowFocus: false,

    // Reintenta solo 1 vez
    retry: 1,

    // Mantiene cache viva
    staleTime: 1000 * 15,

    // Mantiene cache en memoria
    gcTime: 1000 * 60 * 5,
  });
}