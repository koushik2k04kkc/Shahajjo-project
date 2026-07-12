// Localization/UI audit changelog: localized Owner, Unassigned, Priority, Advance case, Close case details, title/owner/priority values; added 180–220ms modal backdrop/panel open-close motion.
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import Stepper from '../../../components/Stepper'
import { useAppStore } from '../../../store/useAppStore'
import { translateEnum, useCopy } from '../../../i18n'
import { localizeField } from '../../../lib/formatters'

export default function CaseDetailPanel({ item, onClose, onUpdate }) {
  const t = useCopy()
  const language = useAppStore((state) => state.language)
  const [closing, setClosing] = useState(false)
  useEffect(() => setClosing(false), [item?.id])
  if (!item) return null
  const close = () => { setClosing(true); setTimeout(() => onClose?.(), 180) }
  return <><button onClick={close} className={`no-button-motion fixed inset-0 z-40 bg-black/20 transition-opacity duration-200 ${closing ? 'opacity-0' : 'modal-backdrop-enter'}`} aria-label={t.closeDetails}/><aside className={`fixed bottom-0 right-0 top-0 z-50 w-full max-w-lg overflow-y-auto bg-white p-6 shadow-xl ${closing ? 'modal-closing' : 'modal-panel-enter'}`}><button onClick={close} className="absolute right-5 top-5" aria-label={t.closeDetails}><X/></button><p className="text-xs font-bold text-brand">{item.id}</p><h2 className="mt-2 text-xl font-bold">{localizeField(item, 'title', language)}</h2><p className="mt-2 text-sm text-slate-500">{t.owner}: {localizeField(item, 'owner', language) || t.unassigned} · {t.priority}: {translateEnum(item.priority, language)}</p><div className="mt-8"><Stepper steps={item.steps} currentStep={item.currentStep}/></div><button onClick={() => onUpdate?.({ ...item, currentStep: Math.min(item.currentStep + 1, item.steps.length - 1) })} className="mt-8 rounded-xl bg-brand px-4 py-2 text-sm font-bold text-white">{t.advanceCase}</button></aside></>
}
