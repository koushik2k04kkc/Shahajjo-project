const stages = ['Detected', 'Assigned', 'Acknowledged', 'Human review', 'Resolved']

export default function AlertStageTracker({ status = '', currentStep }) {
  const derivedStep = status.toLowerCase().includes('resolved') ? 4 : status.toLowerCase().includes('review') ? 3 : status.toLowerCase().includes('verification') ? 1 : 2
  const active = Number.isInteger(currentStep) ? currentStep : derivedStep
  return <div className="mt-4" aria-label={`Alert progress: ${stages[active]}`}><div className="relative flex justify-between"><span className="absolute left-3 right-3 top-2.5 h-0.5 bg-slate-200"/>{stages.map((stage, index) => <div key={stage} className="relative z-10 flex w-1/5 flex-col items-center text-center"><span className={`grid size-5 place-items-center rounded-full border-2 text-[9px] font-bold ${index <= active ? 'border-brand bg-brand text-white' : 'border-slate-300 bg-white text-slate-400'}`}>{index < active ? '✓' : index + 1}</span><span className={`mt-1 text-[9px] font-semibold leading-3 ${index <= active ? 'text-slate-700' : 'text-slate-400'}`}>{stage}</span></div>)}</div></div>
}
