import { useEffect, useState, useCallback } from 'react'
import { getCases } from '../api/caseApi'
import { mockCases } from '../../../data/mockData'

export function useCaseQueue() {
  const [cases, setCases] = useState(mockCases)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(() => {
    const controller = new AbortController()
    setLoading(true)
    getCases(controller.signal)
      .then((response) => setCases(response?.data || response || []))
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err)
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [])

  useEffect(() => refresh(), [refresh])

  return { cases, loading, error, refresh, setCases }
}
