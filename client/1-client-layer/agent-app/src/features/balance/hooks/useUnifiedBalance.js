import { useQuery } from '@tanstack/react-query'
import { getUnifiedBalance } from '../api/balanceApi'

const defaultProviders = [
  { id: 'bkash', name: 'bKash', amount: 0, color: '#C6006F', updated: '—', trend: '+0%', confidence: 0, delayed: 0, shortageIn: null },
  { id: 'nagad', name: 'Nagad', amount: 0, color: '#F58220', updated: '—', trend: '+0%', confidence: 0, delayed: 0, shortageIn: null },
  { id: 'rocket', name: 'Rocket', amount: 0, color: '#6F2C91', updated: '—', trend: '+0%', confidence: 0, delayed: 0, shortageIn: null },
]

const normalizeBalance = (value) => {
  const source = value?.data || value || {}
  const providers = Array.isArray(source.providers) && source.providers.length > 0
    ? source.providers.map((provider) => ({
        ...provider,
        id: provider.id || 'provider',
        name: provider.name || provider.id || 'Provider',
        amount: provider.amount ?? 0,
        color: provider.color || '#94a3b8',
        updated: provider.updated || '—',
        trend: provider.trend || '+0%',
        confidence: provider.confidence ?? 0,
        delayed: provider.delayed ?? 0,
        shortageIn: provider.shortageIn ?? null,
      }))
    : defaultProviders

  return {
    total: source.total ?? 0,
    cash: source.cash ?? 0,
    cashIn: source.cashIn ?? 0,
    cashOut: source.cashOut ?? 0,
    providers,
  }
}

export const emptyBalance = normalizeBalance({})

export function useUnifiedBalance(agentId) {
  return useQuery({
    queryKey: ['balance', agentId],
    queryFn: ({ signal }) => getUnifiedBalance(agentId, signal),
    select: (response) => normalizeBalance(response),
    enabled: !!agentId,
  })
}
