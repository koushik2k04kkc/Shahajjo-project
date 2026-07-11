import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../../../lib/apiClient'

export function useAnomalies() {
  return useQuery({
    queryKey: ['anomalies'],
    queryFn: ({ signal }) => apiGet('/anomalies', { signal }),
    select: (response) => response?.data || response || [],
  })
}
