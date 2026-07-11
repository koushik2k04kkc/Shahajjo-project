import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../../../lib/apiClient'
export const demoForecast = { confidence: 86, points: [{ t: '8 AM', cash: 82, bkash: 68, nagad: 59, rocket: 54 }, { t: '11 AM', cash: 76, bkash: 72, nagad: 52, rocket: 58 }, { t: '2 PM', cash: 67, bkash: 65, nagad: 39, rocket: 50 }, { t: '5 PM', cash: 59, bkash: 57, nagad: 25, rocket: 43 }, { t: '8 PM', cash: 51, bkash: 49, nagad: 31, rocket: 37 }, { t: '11 PM', cash: 45, bkash: 43, nagad: 40, rocket: 32 }] }
export function useLiquidityForecast() { return useQuery({ queryKey: ['forecast'], queryFn: ({ signal }) => apiGet('/forecasts/liquidity', { signal }), select: (response) => response.data || response, initialData: demoForecast }) }
