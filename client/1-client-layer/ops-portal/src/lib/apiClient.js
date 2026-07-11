const API_URL = import.meta.env.VITE_API_URL || '/api'

export async function apiGet(path, { signal } = {}) {
  const response = await fetch(`${API_URL}${path}`, { signal, headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
  return response.json()
}

export const endpoints = {
  overview: (agentId) => `/agents/${agentId}/overview`,
  liquidity: (agentId) => `/agents/${agentId}/liquidity`,
  alerts: '/alerts',
  cases: '/cases',
}
