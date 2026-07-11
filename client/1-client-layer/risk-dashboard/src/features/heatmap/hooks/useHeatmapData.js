import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../../../lib/apiClient'

export function useHeatmapData() {
  return useQuery({
    queryKey: ['heatmap'],
    queryFn: ({ signal }) => apiGet('/heatmap', { signal }),
    select: (response) => response?.data || response || [],
  })
}
