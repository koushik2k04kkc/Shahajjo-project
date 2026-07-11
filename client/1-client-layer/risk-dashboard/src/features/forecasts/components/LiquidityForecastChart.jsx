const colors = { cash: '#24324A', bkash: '#C6006F', nagad: '#F58220', rocket: '#6F2C91' }
export default function LiquidityForecastChart({ data }) {
  if (!data?.points?.length) return <p className="py-12 text-center text-sm text-slate-500">Forecast data is unavailable.</p>
  const w = 680; const h = 240; const x = (i) => 34 + i * 124; const y = (v) => 200 - v * 1.8
  const line = (key) => data.points.map((point, i) => `${x(i)},${y(point[key])}`).join(' ')
  return <div className="overflow-x-auto"><div className="mb-3 flex gap-4">{Object.entries(colors).map(([key, color]) => <span key={key} className="flex items-center gap-1 text-[10px] capitalize text-slate-500"><i className="h-0.5 w-4" style={{ background: color }}/>{key}</span>)}</div><svg viewBox={`0 0 ${w} ${h}`} className="min-w-[600px] w-full">{[25, 50, 75, 100].map((value) => <line key={value} x1="34" x2="654" y1={y(value)} y2={y(value)} stroke="#e8ebf0" strokeDasharray="3 5"/>)}<rect x="390" y="20" width="100" height="180" fill="#fff3d6" rx="8"/>{Object.entries(colors).map(([key, color]) => <polyline key={key} points={line(key)} fill="none" stroke={color} strokeWidth={key === 'cash' ? 3 : 2.4}/>) }{data.points.map((point, i) => <text key={point.t} x={x(i)} y="225" textAnchor="middle" fontSize="10" fill="#94A3B8">{point.t}</text>)}</svg></div>
}
