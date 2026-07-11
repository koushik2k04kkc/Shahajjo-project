import { useState } from 'react'
import { Activity, Bell, BriefcaseBusiness, ChevronDown, LayoutDashboard, Menu, Settings, WalletCards, X } from 'lucide-react'
import Logo from '../components/Logo'
import { useAppStore } from '../store/useAppStore'
import { useCopy } from '../i18n'

const nav = [
  ['Overview', LayoutDashboard], ['Liquidity', WalletCards], ['Alerts', Bell], ['Cases', BriefcaseBusiness], ['Metrics', Activity], ['Settings', Settings],
]

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { activeView, setActiveView, role, setRole, language, setLanguage } = useAppStore()
  const t = useCopy()
  const select = (item) => { setActiveView(item); setMobileOpen(false) }
  return <div className="min-h-screen bg-canvas">
    <header className="fixed inset-x-0 top-0 z-40 flex h-[72px] items-center border-b border-slate-200 bg-white px-4 lg:px-7">
      <button className="mr-3 grid size-9 place-items-center rounded-lg border border-slate-200 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu className="size-5"/></button>
      <div className="lg:w-[220px]"><Logo /></div><div className="ml-auto flex items-center gap-2 sm:gap-4">
        <button onClick={() => setLanguage(language === 'EN' ? 'BN' : 'EN')} className="rounded-lg px-2 py-2 text-xs font-semibold text-slate-500"><span className={language === 'EN' ? 'text-brand' : ''}>EN</span><span className="px-1 text-slate-300">|</span><span className={language === 'BN' ? 'text-brand' : ''}>বাং</span></button>
        <label className="relative"><span className="sr-only">Select role</span><select value={role} onChange={(e) => setRole(e.target.value)} className="w-24 appearance-none truncate rounded-xl border border-slate-200 bg-white py-2 pl-2 pr-7 text-xs font-semibold text-slate-700 sm:w-auto sm:pl-3 sm:pr-8 sm:text-sm"><option value="Agent operator">{t.roleAgent}</option><option value="Area manager">{t.roleArea}</option><option value="Provider admin">{t.roleProvider}</option></select><ChevronDown className="pointer-events-none absolute right-2 top-2.5 size-4 text-slate-400 sm:right-2.5"/></label>
      </div>
    </header>
    <aside className={`fixed bottom-0 left-0 top-0 z-50 w-[248px] border-r border-slate-200 bg-white p-4 pt-5 transition-transform lg:top-[72px] lg:z-30 lg:w-[220px] lg:translate-x-0 lg:pt-7 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="mb-8 flex items-center justify-between lg:hidden"><Logo/><button className="grid size-9 place-items-center" onClick={() => setMobileOpen(false)}><X className="size-5"/></button></div>
      <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.14em] text-slate-400">{t.workspace}</p><nav className="space-y-1">{nav.map(([item, Icon]) => <button key={item} onClick={() => select(item)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${activeView === item ? 'bg-brand/10 text-brand' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}><Icon className="size-[18px]"/>{t[item]}{item === 'Alerts' && <span className="ml-auto grid size-5 place-items-center rounded-full bg-orange-100 text-[10px] text-orange-700">3</span>}</button>)}</nav>
      <div className="absolute bottom-5 left-4 right-4 rounded-xl bg-slate-50 p-3"><div className="flex items-center gap-2 text-xs font-semibold"><span className="size-2 rounded-full bg-emerald-500"/>{t.connected}</div><p className="mt-1 pl-4 text-[10px] text-slate-400">{t.sync}</p></div>
    </aside>
    {mobileOpen && <button className="fixed inset-0 z-40 bg-slate-950/25 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation"/>}
    <main className="pt-[72px] lg:pl-[220px]"><div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">{children}</div></main>
  </div>
}
