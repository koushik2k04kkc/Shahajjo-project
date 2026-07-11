// Localization/UI audit changelog: localized Team, Area/Provider operations, Risk review, Assignee, Staff ID placeholder, Note, Route case/loading, and catch-block error toast while preserving submitted API values.
import { useState } from 'react'
import { routeCase } from '../api/routingApi'
import { useAppStore } from '../../../store/useAppStore'
import { translateEnum, useCopy } from '../../../i18n'

const teams = ['Area operations', 'Provider operations', 'Risk review']
export default function StakeholderRoutingForm({ alertId, onRouted }) {
  const [form, setForm] = useState({ team: teams[0], assigneeId: '', note: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)
  const t = useCopy()
  const language = useAppStore((state) => state.language)
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError(false)
    try { const result = await routeCase({ alertId, ...form }); onRouted?.(result) }
    catch { setError(true) }
    finally { setBusy(false) }
  }
  return <form onSubmit={submit} className="space-y-4">{error && <p role="alert" className="toast-motion rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">{t.routeFailed}</p>}<label className="block text-xs font-bold">{t.team}<select value={form.team} onChange={(event) => setForm({ ...form, team: event.target.value })} className="mt-2 w-full rounded-xl border p-3">{teams.map((team) => <option key={team} value={team}>{translateEnum(team, language)}</option>)}</select></label><label className="block text-xs font-bold">{t.assignee}<input value={form.assigneeId} onChange={(event) => setForm({ ...form, assigneeId: event.target.value })} className="mt-2 w-full rounded-xl border p-3" placeholder={t.staffId}/></label><label className="block text-xs font-bold">{t.note}<textarea value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} className="mt-2 w-full rounded-xl border p-3" rows="3"/></label><button disabled={busy} className="rounded-xl bg-brand px-4 py-2 text-sm font-bold text-white disabled:opacity-60">{busy ? t.routing : t.routeCase}</button></form>
}
