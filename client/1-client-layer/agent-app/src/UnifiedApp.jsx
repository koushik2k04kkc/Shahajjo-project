import { useState } from 'react'
import { ArrowRight, BarChart3, Languages, MonitorCog, Store } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import AgentWorkspace from './App'
import RiskWorkspace from '../../risk-dashboard/src/App'
import OperationsWorkspace from '../../ops-portal/src/App'

const roles = [
  { id: 'agent', label: 'Agent', detail: 'দোকান ও দৈনিক সেবা', Icon: Store, color: 'bg-pink-50 text-brand' },
  { id: 'risk', label: 'Risk Analyst', detail: 'Signals, evidence & review', Icon: BarChart3, color: 'bg-amber-50 text-amber-700' },
  { id: 'operations', label: 'Operations', detail: 'Liquidity & case response', Icon: MonitorCog, color: 'bg-sky-50 text-sky-700' },
]

export default function UnifiedApp() {
  const { i18n } = useTranslation()
  const [role, setRole] = useState(() => localStorage.getItem('shahajjo_role'))
  const [signedIn, setSignedIn] = useState(() => localStorage.getItem('shahajjo_session') === 'active')
  const [language, setLanguage] = useState(() => localStorage.getItem('shahajjo_language') || 'en')
  const chooseRole = (id) => { localStorage.setItem('shahajjo_role', id); setRole(id); setSignedIn(false) }
  const login = async () => {
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'agent@shahajjo.test', password: 'password' })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('shahajjo_token', data.token);
        localStorage.setItem('shahajjo_user', JSON.stringify(data.user));
      }
    } catch (e) {
      console.warn('Backend login unavailable', e);
    }
    localStorage.setItem('shahajjo_session', 'active')
    setSignedIn(true)
  }
  const switchRole = () => { localStorage.removeItem('shahajjo_session'); setSignedIn(false); setRole(null); localStorage.removeItem('shahajjo_role'); localStorage.removeItem('shahajjo_token'); localStorage.removeItem('shahajjo_user'); }
  const clearRole = () => { localStorage.removeItem('shahajjo_role'); setRole(null) }
  const toggleLanguage = () => { const next = language === 'bn' ? 'en' : 'bn'; localStorage.setItem('shahajjo_language', next); localStorage.setItem('risk_lang', next); localStorage.setItem('ops_language', next === 'bn' ? 'BN' : 'EN'); i18n.changeLanguage(next); document.documentElement.lang = next; setLanguage(next) }
  if (!role) return <Gateway language={language} onLanguage={toggleLanguage}><div className="w-full max-w-3xl"><div className="mb-8 text-center"><Brand/><h1 className="mt-6 text-3xl font-bold">Choose your workspace</h1><p className="mt-2 text-slate-500">আপনার ভূমিকা বেছে নিন</p></div><div className="grid gap-4 md:grid-cols-3">{roles.map(({ id, label, detail, Icon, color }) => <button key={id} onClick={() => chooseRole(id)} className="group rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-card transition hover:-translate-y-1 hover:border-brand/40"><span className={`grid size-14 place-items-center rounded-2xl ${color}`}><Icon className="size-7"/></span><span className="mt-6 flex items-center justify-between text-lg font-bold">{label}<ArrowRight className="size-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand"/></span><span className="mt-1 block text-sm text-slate-500">{detail}</span></button>)}</div></div></Gateway>
  if (!signedIn) return <Gateway language={language} onLanguage={toggleLanguage}><form onSubmit={(event) => { event.preventDefault(); login() }} className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-7 shadow-card"><button type="button" onClick={clearRole} className="mb-6 text-xs font-bold text-slate-500">← Change role</button><Brand/><h1 className="mt-6 text-2xl font-bold">{roles.find((item) => item.id === role)?.label} sign in</h1><p className="mt-1 text-sm text-slate-500">Enter your workspace credentials to continue.</p><label className="mt-6 block text-xs font-bold text-slate-600">Mobile or email<input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Enter your mobile or email"/></label><label className="mt-4 block text-xs font-bold text-slate-600">PIN<input type="password" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Enter your PIN"/></label><button className="mt-6 w-full rounded-xl bg-brand py-3 font-bold text-white">Continue to workspace</button></form></Gateway>
  const props = { onSwitchRole: switchRole }
  return role === 'risk' ? <RiskWorkspace {...props}/> : role === 'operations' ? <OperationsWorkspace {...props}/> : <AgentWorkspace {...props}/>
}

function Gateway({ children, language, onLanguage }) { return <main className="relative grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,_#fff1f7,_transparent_40%),radial-gradient(circle_at_bottom_right,_#eff8ff,_transparent_40%)] p-5"><button onClick={onLanguage} className="fixed right-5 top-5 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold shadow-sm"><Languages className="size-4"/>{language === 'bn' ? 'English' : 'বাংলা'}</button>{children}</main> }
function Brand() { return <button type="button" className="mx-auto flex items-center justify-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-brand text-xl font-bold text-white">স</span><span className="text-xl font-bold">Shahajjo</span></button> }
