// Localization/UI audit changelog: localized chart title/hint, confidence, Shared cash legend, shortage annotation, axis times/numerals, and chart accessibility label; added guarded replay skeleton.
import { useId } from 'react'
import { useCopy } from '../i18n'
import { useAppStore } from '../store/useAppStore'
import { formatClock, formatPercent } from '../lib/formatters'
import { ChartSkeleton } from './ui'
import { useDelayedLoading } from '../hooks/useDelayedLoading'

const colors = { cash: '#24324A', bkash: '#C6006F', nagad: '#F58220', rocket: '#6F2C91' }

export default function ContinuityChart({ data, loading = false }) {
  const t = useCopy()
  const language = useAppStore((state) => state.language)
  const showSkeleton = useDelayedLoading(loading)
  const clip = useId().replace(/:/g, '')
  if (showSkeleton) return <ChartSkeleton/>
  const labels = { cash: t.sharedCash, bkash: 'bKash', nagad: 'Nagad', rocket: 'Rocket' }
  const width = 760, height = 300, left = 36, top = 28, right = 18, bottom = 42
  const points = data?.points || []
  const shortageWindow = data?.shortageWindow || { start: 0, end: 0, label: '', labelBn: '' }
  const confidence = data?.confidence || 0
  const x = (i) => left + i * ((width - left - right) / Math.max(points.length - 1, 1))
  const y = (value) => top + (100 - value) * ((height - top - bottom) / 100)
  const line = (key) => points.map((point, i) => `${x(i)},${y(point[key])}`).join(' ')
  const bandX = x(shortageWindow.start), bandWidth = x(shortageWindow.end) - bandX
  return <div className="transition-opacity duration-200">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold text-slate-900">{t.continuity}</h2><p className="mt-0.5 text-xs text-slate-500">{t.continuityHint}</p></div><div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-600">{formatPercent(confidence, language)} {t.confidence}</div></div>
    <div className="flex flex-wrap gap-x-4 gap-y-2 pb-2">{Object.entries(labels).map(([key, label]) => <span key={key} className="flex items-center gap-1.5 text-[11px] text-slate-500"><span className="h-0.5 w-4 rounded" style={{ background: colors[key] }} />{label}</span>)}</div>
    <div className="overflow-x-auto scrollbar-none"><svg viewBox={`0 0 ${width} ${height}`} className="min-w-[620px] w-full" role="img" aria-label={t.chartAria}>
      <defs><clipPath id={clip}><rect x={left} y={top} width={width-left-right} height={height-top-bottom} rx="8" /></clipPath></defs>
      {[25,50,75,100].map(v => <g key={v}><line x1={left} x2={width-right} y1={y(v)} y2={y(v)} stroke="#E8EBF0" strokeDasharray="3 5"/><text x={left-10} y={y(v)+4} textAnchor="end" fontSize="10" fill="#94A3B8">{formatPercent(v, language)}</text></g>)}
      <g clipPath={`url(#${clip})`}><rect x={bandX} y={top} width={bandWidth} height={height-top-bottom} fill="#FFF3D6" opacity=".75" />{Object.keys(colors).map(key => <polyline key={key} points={line(key)} fill="none" stroke={colors[key]} strokeWidth={key === 'cash' ? 3 : 2.4} strokeLinecap="round" strokeLinejoin="round"/>)}</g>
      <text x={bandX+bandWidth/2} y={top+14} textAnchor="middle" fontSize="10" fontWeight="600" fill="#9A6700">{language === 'BN' ? shortageWindow.labelBn || t.chartShortage : shortageWindow.label}</text>
      {points.map((point,i) => <text key={point.time} x={x(i)} y={height-14} textAnchor="middle" fontSize="10" fill="#94A3B8">{formatClock(point.time, language)}</text>)}
    </svg></div>
  </div>
}
