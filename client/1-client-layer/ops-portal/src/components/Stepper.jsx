export default function Stepper({ steps, currentStep = 0 }) {
  return <div className="relative flex justify-between"><div className="absolute left-3 right-3 top-3 h-px bg-slate-200" />{steps.map((step, index) => {
    const complete = index <= currentStep
    return <div key={step.label} className="group relative z-10 flex w-1/5 flex-col items-center text-center"><button title={step.time || 'Pending'} className={`grid size-6 place-items-center rounded-full border-2 text-[10px] font-bold ${complete ? 'border-brand bg-brand text-white' : 'border-slate-300 bg-white text-slate-400'}`}>{complete ? '✓' : index + 1}</button><span className={`mt-2 text-[10px] font-semibold sm:text-xs ${complete ? 'text-slate-700' : 'text-slate-400'}`}>{step.label}</span>{step.time && <span className="pointer-events-none absolute top-8 z-20 hidden whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-[10px] text-white group-hover:block group-focus-within:block">{step.time}</span>}</div>
  })}</div>
}
