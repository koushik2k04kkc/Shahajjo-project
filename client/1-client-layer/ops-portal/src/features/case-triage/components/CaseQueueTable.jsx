// Localization/UI audit changelog: localized Case, Priority, Owner, Status, SLA, Unassigned, raw priority/status/step enums, titles/owners, and SLA text; added transaction-row tint transition.
import SlaCountdownBadge from './SlaCountdownBadge'
import { useAppStore } from '../../../store/useAppStore'
import { translateEnum, useCopy } from '../../../i18n'
import { formatRelativeTime, localizeField } from '../../../lib/formatters'

export default function CaseQueueTable({ cases = [], onSelect }) {
  const t = useCopy()
  const language = useAppStore((state) => state.language)
  return <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm"><thead><tr className="border-b text-xs text-slate-400"><th className="pb-3">{t.case}</th><th>{t.priority}</th><th>{t.owner}</th><th>{t.status}</th><th>{t.sla}</th></tr></thead><tbody>{cases.map((item) => <tr key={item.id} onClick={() => onSelect?.(item)} className="cursor-pointer border-b border-slate-100 transition-colors duration-200 hover:bg-brand/[.035]"><td className="py-4"><b>{localizeField(item, 'title', language)}</b><small className="block text-brand">{item.id}</small></td><td>{translateEnum(item.priority, language)}</td><td>{localizeField(item, 'owner', language) || t.unassigned}</td><td>{translateEnum(item.steps?.[item.currentStep]?.label || item.status, language)}</td><td>{item.deadline ? <SlaCountdownBadge deadline={item.deadline}/> : formatRelativeTime(item.sla, language, t)}</td></tr>)}</tbody></table></div>
}
