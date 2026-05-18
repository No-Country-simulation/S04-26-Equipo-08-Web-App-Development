import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { testService } from '../services/test.service'

// Query keys
export const testQueryKeys = {
  health: ['health'],
  adminCheck: ['adminCheck'],
}

// Custom hook for health check
export function useHealthCheck() {
  return useQuery({
    queryKey: testQueryKeys.health,
    queryFn: testService.healthCheck,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Custom hook for admin check
export function useAdminCheck() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: testService.adminCheck,
    onSuccess: (data) => {
      // Update the query cache with the new data
      queryClient.setQueryData(testQueryKeys.adminCheck, data)
    },
  })
}