import { useState } from 'react'
import { BanknoteArrowDown, CirclePlus, Layers3, PiggyBank, ReceiptText, Send, ShoppingBag, Smartphone, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const actionTopics = [
  { id: 'send', label: 'Send money', labelBn: 'সেন্ড মানি', Icon: Send, tone: 'bg-rose-50 text-rose-600' },
  { id: 'recharge', label: 'Mobile recharge', labelBn: 'মোবাইল রিচার্জ', Icon: Smartphone, tone: 'bg-emerald-50 text-emerald-700' },
  { id: 'payment', label: 'Payment', labelBn: 'পেমেন্ট', Icon: ShoppingBag, tone: 'bg-orange-50 text-orange-600' },
  { id: 'cashout', label: 'Cash out', labelBn: 'ক্যাশ আউট', Icon: BanknoteArrowDown, tone: 'bg-teal-50 text-teal-700' },
  { id: 'bundle', label: 'Provider bundle', labelBn: 'বিকাশ বান্ডেল', Icon: Layers3, tone: 'bg-emerald-50 text-emerald-700' },
  { id: 'addmoney', label: 'Add money', labelBn: 'অ্যাড মানি', Icon: CirclePlus, tone: 'bg-purple-50 text-purple-700' },
  { id: 'paybill', label: 'Pay bill', labelBn: 'পে বিল', Icon: ReceiptText, tone: 'bg-slate-100 text-slate-700' },
  { id: 'savings', label: 'Savings', labelBn: 'সেভিংস', Icon: PiggyBank, tone: 'bg-pink-50 text-pink-600' },
]

export default function QuickActions() {
  const { i18n } = useTranslation()
  const [selected, setSelected] = useState(null)
  const bn = i18n.language === 'bn'
  return <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-card sm:p-5">
    <div className="mb-4 flex items-center justify-between"><div><h2 className="font-bold">{bn ? 'দ্রুত সেবা' : 'Quick services'}</h2><p className="text-xs text-slate-500">{bn ? 'ছবি দেখে সেবা বেছে নিন' : 'Choose a service by its icon'}</p></div>{selected && <button onClick={() => setSelected(null)} className="grid size-8 place-items-center rounded-full bg-slate-100" aria-label="Close message"><X className="size-4"/></button>}</div>
    <div className="grid grid-cols-4 gap-x-2 gap-y-5 sm:grid-cols-8">{actionTopics.map((action) => <button key={action.id} onClick={() => setSelected(action)} className="group flex min-w-0 flex-col items-center gap-2 text-center"><span className={`grid size-12 place-items-center rounded-2xl transition group-active:scale-95 sm:size-14 ${action.tone}`}><action.Icon className="size-6 sm:size-7"/></span><span className="text-[11px] font-semibold leading-4 text-slate-600">{bn ? action.labelBn : action.label}</span></button>)}</div>
    {selected && <p role="status" className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-center text-xs font-semibold text-slate-600">{bn ? selected.labelBn : selected.label} · {bn ? 'ডেমো সেবা খোলা হয়েছে' : 'Demo service opened'}</p>}
  </section>
}
