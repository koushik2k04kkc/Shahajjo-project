// Localization/UI audit changelog: localized Continuity score, Median response, Cases resolved, this week, faster, Last 7 days, and all metric numerals/units.
import { mockMetrics } from '../data/mockData'
import { Card } from '../components/ui'
import { Page } from './Liquidity'
import { useAppStore } from '../store/useAppStore'
import { useCopy } from '../i18n'
import { formatNumber, formatPercent } from '../lib/formatters'

const labels = ['metricContinuity', 'metricResponse', 'metricResolved']
export default function Metrics() {
  const t = useCopy()
  const language = useAppStore((state) => state.language)
  const value = (metric) => metric.unit === 'percent' ? formatPercent(metric.value, language) : metric.unit === 'minutes' ? `${formatNumber(metric.value, language)} ${t.minutesShort}` : formatNumber(metric.value, language)
  const hint = (metric) => metric.change ? `${metric.hint === 'thisWeek' ? '+' : ''}${formatNumber(metric.change, language)}${metric.unit === 'percent' ? '%' : ` ${t.minutesShort}`} ${t[metric.hint]}` : t[metric.hint]
  return <Page title={t.Metrics} subtitle={t.titleMetrics}><div className="grid gap-4 sm:grid-cols-3">{mockMetrics.map((metric, index) => <Card className="p-5" key={metric.label}><p className="text-sm text-slate-500">{t[labels[index]]}</p><p className="mt-3 text-3xl font-bold">{value(metric)}</p><p className="mt-2 text-xs font-semibold text-emerald-600">{hint(metric)}</p></Card>)}</div></Page>
}
