import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../../../lib/apiClient'

export const demoAreas = [
  { id: 'mirpur', name: 'Mirpur', nameBn: 'মিরপুর', risk: 'high', score: 78, outlets: 34, x: 19, y: 22 },
  { id: 'uttara', name: 'Uttara', nameBn: 'উত্তরা', risk: 'watch', score: 54, outlets: 29, x: 55, y: 12 },
  { id: 'gulshan', name: 'Gulshan', nameBn: 'গুলশান', risk: 'healthy', score: 22, outlets: 27, x: 68, y: 43 },
  { id: 'tejgaon', name: 'Tejgaon', nameBn: 'তেজগাঁও', risk: 'watch', score: 47, outlets: 31, x: 43, y: 53 },
  { id: 'mohammadpur', name: 'Mohammadpur', nameBn: 'মোহাম্মদপুর', risk: 'critical', score: 91, outlets: 27, x: 22, y: 70 },
]

export function useHeatmapData() {
  return useQuery({ queryKey: ['heatmap'], queryFn: ({ signal }) => apiGet('/heatmap', { signal }), select: (response) => response.data || response, initialData: demoAreas })
}
