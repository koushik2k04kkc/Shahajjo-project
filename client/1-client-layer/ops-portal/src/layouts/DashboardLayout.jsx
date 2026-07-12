// Localization/UI audit changelog: localized Open/Close navigation, Operations lead, Central operations, Switch role/workspace, Help & FAQ, language controls, and added scroll-only sticky-header treatment plus 200ms nav/profile motion.
import { useEffect, useState } from 'react'
import { Activity, Bell, BriefcaseBusiness, ChevronDown, CircleHelp, LayoutDashboard, Menu, Settings, UserRound, WalletCards, X } from 'lucide-react'
import Logo from '../components/Logo'
import { useAppStore } from '../store/useAppStore'
import { useCopy } from '../i18n'
import { formatNumber } from '../lib/formatters'

const nav = [['Overview', LayoutDashboard], ['Liquidity', WalletCards], ['Alerts', Bell], ['Cases', BriefcaseBusiness], ['Metrics', Activity], ['Settings', Settings], ['Help', CircleHelp]]

export default function DashboardLayout({ children, onSwitchRole }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { activeView, setActiveView, language, setLanguage } = useAppStore()
  const t = useCopy()
  const select = (item) => { setActiveView(item); setMobileOpen(false) }

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 0)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => { document.title = t.documentTitle }, [t.documentTitle])

  return <div className="dashboard-wave min-h-screen bg-canvas">
    <header className={`sticky inset-x-0 top-0 z-50 flex h-[72px] items-center border-b px-4 transition-all duration-200 ease-in-out lg:px-7 ${scrolled ? 'border-slate-200/80 bg-white/90 shadow-[0_6px_24px_rgba(15,23,42,.07)] backdrop-blur-xl' : 'border-transparent bg-white'}`}>
      <button className="mr-3 grid size-9 place-items-center rounded-lg border border-slate-200 lg:hidden" onClick={() => setMobileOpen(true)} aria-label={t.openNavigation}><Menu className="size-5"/></button>
      <div className="lg:w-[220px]"><Logo onClick={() => select('Overview')}/></div>
      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <button onClick={() => setLanguage(language === 'EN' ? 'BN' : 'EN')} className="rounded-lg px-2 py-2 text-xs font-semibold text-slate-500" aria-label={language === 'EN' ? t.switchToBangla : t.switchToEnglish}><span className={language === 'EN' ? 'text-brand' : ''}>EN</span><span className="px-1 text-slate-300">|</span><span className={language === 'BN' ? 'text-brand' : ''}>বাংলা</span></button>
        <div className="relative"><button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700" aria-expanded={profileOpen}><UserRound className="size-4"/><span className="hidden sm:inline">{t.operationsLead}</span><ChevronDown className={`size-3 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}/></button>{profileOpen && <div className="incident-enter absolute right-0 top-12 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"><div className="px-3 py-2"><b className="text-sm">{t.profileName}</b><p className="text-xs text-slate-400">{t.centralOperations}</p></div><button onClick={onSwitchRole} className="w-full rounded-xl px-3 py-2 text-left text-xs font-bold hover:bg-slate-50">{t.switchWorkspace}</button></div>}</div>
      </div>
    </header>
    <aside className={`fixed bottom-0 left-0 top-0 z-50 w-[248px] border-r border-slate-200 bg-white p-4 pt-5 transition-transform duration-200 ease-in-out lg:top-[72px] lg:z-30 lg:w-[220px] lg:translate-x-0 lg:pt-7 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="mb-8 flex items-center justify-between lg:hidden"><Logo onClick={() => select('Overview')}/><button className="grid size-9 place-items-center" onClick={() => setMobileOpen(false)} aria-label={t.closeNavigation}><X className="size-5"/></button></div>
      <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.14em] text-slate-400">{t.workspace}</p>
      <nav className="space-y-1">{nav.map(([item, Icon]) => <button key={item} onClick={() => select(item)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ease-in-out ${activeView === item ? 'bg-brand/10 text-brand shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}><Icon className="size-[18px]"/>{t[item]}{item === 'Alerts' && <span className="ml-auto grid size-5 place-items-center rounded-full bg-orange-100 text-[10px] text-orange-700">{formatNumber(3, language)}</span>}</button>)}</nav>
      <div className="absolute bottom-5 left-4 right-4 rounded-xl bg-slate-50 p-3"><div className="flex items-center gap-2 text-xs font-semibold"><span className="size-2 rounded-full bg-emerald-500"/>{t.connected}</div><p className="mt-1 pl-4 text-[10px] text-slate-400">{t.sync}</p></div>
    </aside>
    {mobileOpen && <button className="no-button-motion modal-backdrop-enter fixed inset-0 z-40 bg-slate-950/25 lg:hidden" onClick={() => setMobileOpen(false)} aria-label={t.closeNavigation}/>}
    <main className="lg:pl-[220px]"><div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">{children}</div></main>
  </div>
}
