// Localization audit changelog: replaced SLA breached and minute/second timer strings with Bangla-aware copy and numerals.
import { useSlaTimer } from '../hooks/useSlaTimer'
import { useAppStore } from '../../../store/useAppStore'
import { useCopy } from '../../../i18n'
import { formatNumber } from '../../../lib/formatters'

export default function SlaCountdownBadge({ deadline }) {
  const sla = useSlaTimer(deadline)
  const t = useCopy()
  const language = useAppStore((state) => state.language)
  const label = sla.expired ? t.slaBreached : `${formatNumber(Math.floor(sla.remaining / 60000), language)} ${t.minutesShort} ${formatNumber(sla.seconds, language)} ${t.secondsShort}`
  return <span className={`rounded-full px-2 py-1 text-[10px] font-bold transition-colors duration-200 ${sla.expired ? 'bg-red-50 text-red-700' : sla.minutes < 15 && !sla.hours ? 'bg-orange-50 text-orange-700' : 'bg-slate-100 text-slate-600'}`}>{label}</span>
}
