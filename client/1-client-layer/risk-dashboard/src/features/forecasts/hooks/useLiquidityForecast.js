import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../../../lib/apiClient'

export function useLiquidityForecast() {
  return useQuery({
    queryKey: ['forecast'],
    queryFn: ({ signal }) => apiGet('/forecasts/liquidity', { signal }),
    select: (response) => response?.data || response || { confidence: 0, points: [] },
  })
}
