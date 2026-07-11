import { useEffect, useState } from 'react'
import { apiGet, endpoints } from '../lib/apiClient'
import { mockAlerts, mockCases, mockLiquidity, mockOverview } from '../data/mockData'

const fallbacks = { overview: mockOverview, liquidity: mockLiquidity, alerts: mockAlerts, cases: mockCases }

export function useDashboardData(agentId = 'AGT-2048') {
  const [data, setData] = useState(fallbacks)
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const paths = { overview: endpoints.overview(agentId), liquidity: endpoints.liquidity(agentId), alerts: endpoints.alerts, cases: endpoints.cases }
    Promise.allSettled(Object.entries(paths).map(async ([key, path]) => [key, await apiGet(path, { signal: controller.signal })]))
      .then((results) => {
        const next = { ...fallbacks }; let fallbackUsed = false
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') next[result.value[0]] = result.value[1]?.data ?? result.value[1]
          else if (results[index].reason?.name !== 'AbortError') fallbackUsed = true
        })
        setData(next); setIsDemo(fallbackUsed); setLoading(false)
      })
    return () => controller.abort()
  }, [agentId, refreshKey])

  return { ...data, loading, isDemo, refresh: () => { setLoading(true); setRefreshKey((key) => key + 1) } }
}
