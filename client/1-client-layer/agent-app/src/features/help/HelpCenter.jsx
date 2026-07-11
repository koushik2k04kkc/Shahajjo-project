import { useState } from 'react'
import { ArrowLeft, CircleHelp, Headphones, Lightbulb, PhoneCall, Play, Volume2, X } from 'lucide-react'
import { actionTopics } from '../actions/QuickActions'

const helpContent = {
  send: ['টাকা পাঠানো হয়নি?', ['রেফারেন্স রাখুন', 'ব্যালেন্স দেখুন', 'দুইবার পাঠাবেন না']],
  recharge: ['রিচার্জ আটকে গেছে?', ['নম্বর মিলান', '৫ মিনিট অপেক্ষা করুন', 'তারপর সহায়তায় কল করুন']],
  payment: ['পেমেন্ট সম্পন্ন হয়নি?', ['রেফারেন্স দেখুন', 'দোকানের নাম মিলান', 'আবার দেওয়ার আগে যাচাই করুন']],
  cashout: ['ক্যাশ আউট হচ্ছে না?', ['ব্যালেন্স দেখুন', 'নেট চালু আছে দেখুন', 'আবার চেষ্টা করুন']],
  bundle: ['বান্ডেল চালু হয়নি?', ['প্যাকের নাম মিলান', 'এসএমএস দেখুন', 'না হলে সহায়তায় কল করুন']],
  addmoney: ['অ্যাড মানি দেখা যাচ্ছে না?', ['উৎস মিলান', 'হালনাগাদ চাপুন', 'রেফারেন্স রেখে কল করুন']],
  paybill: ['বিল দেওয়া আটকে গেছে?', ['বিল নম্বর মিলান', 'স্ট্যাটাস দেখুন', 'দুইবার দেবেন না']],
  savings: ['সেভিংস দেখা যাচ্ছে না?', ['প্রোভাইডার বাছুন', 'হালনাগাদ দেখুন', 'তথ্য না এলে কল করুন']],
}
const topics = actionTopics.map((topic) => ({ ...topic, label: topic.labelBn, color: topic.tone, question: helpContent[topic.id][0], steps: helpContent[topic.id][1] }))

export default function HelpCenter({ onBack }) {
  const [selected, setSelected] = useState(topics[0])
  const [playing, setPlaying] = useState(false)
  const [callState, setCallState] = useState('idle')
  const call = () => { setCallState('connecting'); window.setTimeout(() => setCallState('connected'), 900) }
  return <div className="mx-auto max-w-4xl">
    <div className="mb-5 flex items-center gap-3"><button onClick={onBack} className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white" aria-label="Back"><ArrowLeft className="size-5"/></button><div><h1 className="text-2xl font-bold">সহায়তা</h1><p className="text-sm text-slate-500">ছবি দেখে সমস্যা বেছে নিন</p></div></div>
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">{topics.map((topic) => <button key={topic.id} onClick={() => setSelected(topic)} className={`rounded-2xl border bg-white p-3 text-center shadow-card transition ${selected.id === topic.id ? 'border-brand ring-2 ring-brand/10' : 'border-slate-200'}`}><span className={`mx-auto grid size-12 place-items-center rounded-2xl ${topic.color}`}><topic.Icon className="size-6"/></span><span className="mt-2 block text-[11px] font-bold leading-4">{topic.label}</span></button>)}</div>
    <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-7"><div className="flex items-center gap-4"><span className={`grid size-14 shrink-0 place-items-center rounded-2xl ${selected.color}`}><selected.Icon className="size-7"/></span><div><p className="text-xs font-bold text-slate-400">সমস্যা</p><h2 className="text-lg font-bold">{selected.question}</h2></div></div><div className="mt-6 grid gap-3 sm:grid-cols-3">{selected.steps.map((step, index) => <div key={step} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-900 text-sm font-bold text-white">{index + 1}</span><b className="text-sm">{step}</b></div>)}</div><button onClick={() => setPlaying(!playing)} className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl border border-sky-200 bg-sky-50 py-3 text-sm font-bold text-sky-800"><Volume2 className="size-5"/>{playing ? 'শুনছেন… থামাতে চাপুন' : 'কথায় শুনুন'}{playing ? <X className="size-4"/> : <Play className="size-4"/>}</button></section>
    <section className="mt-5 rounded-3xl bg-emerald-700 p-5 text-white shadow-card sm:flex sm:items-center sm:justify-between sm:p-6"><div className="flex items-center gap-4"><span className="grid size-12 place-items-center rounded-2xl bg-white/15"><Headphones className="size-6"/></span><div><h2 className="font-bold">মানুষের সাহায্য দরকার?</h2><p className="text-sm text-emerald-100">সকাল ৮টা–রাত ১০টা · ১৬২৪৭</p></div></div><button onClick={call} disabled={callState !== 'idle'} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-bold text-emerald-800 disabled:opacity-90 sm:mt-0 sm:w-auto"><PhoneCall className="size-5"/>{callState === 'idle' ? 'এখন কল করুন' : callState === 'connecting' ? 'সংযোগ হচ্ছে…' : 'সংযুক্ত · ১৬২৪৭'}</button></section>
    <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400"><Lightbulb className="size-4"/>সতর্কতা বা ঝুঁকির সিদ্ধান্ত একজন মানুষ যাচাই করেন।</p>
  </div>
}

export function FloatingHelp({ onClick }) { return <button onClick={onClick} className="fixed bottom-24 right-4 z-50 grid size-14 place-items-center rounded-full border-4 border-white bg-sky-600 text-white shadow-xl transition hover:bg-sky-700 lg:bottom-6 lg:right-6" aria-label="Open help" title="সহায়তা"><CircleHelp className="size-7"/></button> }
