const API_URL = import.meta.env.VITE_API_URL || '/api/v1'

export async function apiGet(path, { signal } = {}) {
  const token = localStorage.getItem('shahajjo_token');
  const response = await fetch(`${API_URL}${path}`, { 
    signal, 
    headers: { 
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    } 
  })
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
  return response.json()
}

export const endpoints = {
  overview: (agentId) => `/agents/${agentId}/overview`,
  liquidity: (agentId) => `/agents/${agentId}/liquidity`,
  alerts: '/alerts',
  cases: '/cases',
}
