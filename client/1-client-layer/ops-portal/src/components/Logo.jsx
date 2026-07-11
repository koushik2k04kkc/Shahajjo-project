export default function Logo({ compact = false, onClick }) {
  const Tag = onClick ? 'button' : 'div'
  return <Tag onClick={onClick} className="flex items-center gap-2 sm:gap-3" aria-label="Shahajjo home">
    <svg className="size-9 shrink-0" viewBox="0 0 42 42" fill="none" aria-hidden="true"><path d="M21 2 38 12v18L21 40 4 30V12L21 2Z" fill="#C6006F"/><path d="m21 8 10 6-10 6-10-6 10-6Zm-10 9 8 5v11l-8-5V17Zm20 0v11l-8 5V22l8-5Z" fill="white"/></svg>
    {!compact && <div><div className="text-lg font-bold tracking-tight text-slate-950 sm:text-xl">Shahajjo</div><div className="-mt-0.5 hidden text-[9px] font-semibold uppercase tracking-[.18em] text-slate-400 sm:block">Operations intelligence</div></div>}
  </Tag>
}
