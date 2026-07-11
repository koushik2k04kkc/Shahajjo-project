import { useState } from 'react'
import { BarChart3, MonitorCog, Store } from 'lucide-react'
import AgentWorkspace from './App'
import RiskWorkspace from '../../risk-dashboard/src/App'
import OperationsWorkspace from '../../ops-portal/src/App'

const workspaces = [
  { id: 'agent', label: 'Agent app', Icon: Store },
  { id: 'risk', label: 'Risk board', Icon: BarChart3 },
  { id: 'operations', label: 'Operations', Icon: MonitorCog },
]

export default function UnifiedApp() {
  const [workspace, setWorkspace] = useState(() => localStorage.getItem('shahajjo_workspace') || 'agent')
  const selectWorkspace = (id) => {
    localStorage.setItem('shahajjo_workspace', id)
    setWorkspace(id)
  }
  const ActiveWorkspace = workspace === 'risk' ? RiskWorkspace : workspace === 'operations' ? OperationsWorkspace : AgentWorkspace

  return <>
    <div className="fixed right-3 top-3 z-[70] flex rounded-xl border border-slate-200 bg-white p-1 shadow-lg sm:right-5 sm:top-4" aria-label="Workspace switcher">
      {workspaces.map(({ id, label, Icon }) => <button key={id} onClick={() => selectWorkspace(id)} title={label} aria-label={label} className={`grid size-9 place-items-center rounded-lg transition sm:w-auto sm:px-3 ${workspace === id ? 'bg-brand text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
        <Icon className="size-4"/><span className="ml-2 hidden text-xs font-bold sm:inline">{label}</span>
      </button>)}
    </div>
    <ActiveWorkspace />
  </>
}
