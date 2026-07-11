import { useQuery } from '@tanstack/react-query'
import { getTransactionHistory } from '../api/balanceApi'
import { useAuth } from '../../auth/hooks/useAuth'

const providerColors = {
  bkash: '#C6006F',
  nagad: '#F58220',
  rocket: '#6F2C91',
}

export default function BalanceHistoryChart() {
  const { user } = useAuth()
  const agentId = user?.id
  
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['transactionHistory', agentId],
    queryFn: ({ signal }) => getTransactionHistory(agentId, signal),
    refetchInterval: 5000, // Poll every 5 seconds to show real-time updates when a transaction is submitted
    enabled: !!agentId
  })

  const transactions = response?.data || response || []
  const txList = Array.isArray(transactions) ? transactions : []
  const sortedTx = [...txList].sort((a, b) => new Date(a.time) - new Date(b.time))

  const grouped = { bkash: [], nagad: [], rocket: [] }
  sortedTx.forEach(tx => {
    if (grouped[tx.provider_code]) {
      grouped[tx.provider_code].push(Number(tx.amount))
    }
  })

  // Ensure minimum points if empty so we always draw a line
  Object.keys(grouped).forEach(k => {
    if (grouped[k].length === 0) {
      grouped[k] = [0, 0, 0, 0] // dummy flat line
    }
  })

  // Find max value across all providers to scale the graph Y axis
  const allValues = Object.values(grouped).flat()
  const maxVal = Math.max(...allValues, 1000)

  const w = 640, h = 190, pad = 20
  
  const getPathData = (points) => {
    if (points.length < 2) {
      points = [points[0] || 0, points[0] || 0]
    }
    const coords = points.map((v, i) => {
      const x = pad + i * ((w - pad * 2) / (points.length - 1))
      const y = h - pad - (v / maxVal) * (h - pad * 2)
      return { x, y, v }
    })
    const pathStr = coords.map(c => `${c.x},${c.y}`).join(' ')
    return { pathStr, coords }
  }

  if (isLoading) return <div className="h-[190px] w-full flex items-center justify-center text-slate-400 text-sm animate-pulse">Loading transaction graph...</div>
  if (isError) return <div className="h-[190px] w-full flex items-center justify-center text-rose-500 text-sm">Failed to load graph</div>

  return (
    <div className="overflow-x-auto mt-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="min-w-[540px] w-full" role="img" aria-label="Liquidity history">
        {[0.25, 0.5, 0.75].map(ratio => {
          const y = h - pad - ratio * (h - pad * 2)
          return <line key={ratio} x1={pad} x2={w-pad} y1={y} y2={y} stroke="#e8ebf0" strokeDasharray="4 5" />
        })}
        
        <rect x="455" y="18" width="72" height="152" rx="8" fill="#fff3d6" />

        {Object.entries(grouped).map(([provider, points]) => {
          const color = providerColors[provider] || '#94a3b8'
          const { pathStr, coords } = getPathData(points)
          
          return (
            <g key={provider}>
              <polyline points={pathStr} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {coords.map((c, i) => (
                <circle key={i} cx={c.x} cy={c.y} r="4" fill="white" stroke={color} strokeWidth="2" />
              ))}
            </g>
          )
        })}
      </svg>
      
      {/* Legend */}
      <div className="flex justify-center gap-4 mt-2">
        {Object.entries(providerColors).map(([provider, color]) => (
          <div key={provider} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
            <span className="text-[10px] font-bold text-slate-600 capitalize">{provider}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
