import { useEffect, useState } from 'react'
import { getSocket } from '../../../sockets/socketClient'

export const demoAlerts = [
  { id: 'ALT-1042', provider: 'Nagad', severity: 'high', confidence: 87, title: 'Nagad cash-out pressure requires review', titleBn: 'নগদ ক্যাশ-আউটের চাপ পর্যালোচনা প্রয়োজন', situation: 'Demand is rising faster than today’s usual pattern.', situationBn: 'আজ স্বাভাবিকের চেয়ে দ্রুত নগদের চাহিদা বাড়ছে। এটি নিশ্চিত অনিয়ম নয়।', evidence: 'Cash-out speed is 1.8× the 30-day baseline.', evidenceBn: 'ক্যাশ-আউটের গতি ৩০ দিনের গড়ের ১.৮ গুণ।', action: 'Move ৳30,000 float to Nagad before 4:30 PM.', actionBn: 'বিকাল ৪:৩০-এর আগে নগদে ৳৩০,০০০ ফ্লোট সরান।', owner: 'Farzana Akter', status: 'Pending human review', currentStep: 3, finalStatus: 'Not finalized — human review pending', time: '4m', history: ['3:02 PM · Signal created', '3:05 PM · Assigned to Farzana', '3:11 PM · Agent acknowledged'] },
  { id: 'ALT-1039', provider: 'Rocket', severity: 'stale', confidence: 42, title: 'Rocket feed is delayed', titleBn: 'রকেটের তথ্য পেতে দেরি হচ্ছে', situation: 'The latest balance could not be verified.', situationBn: 'সর্বশেষ ব্যালেন্স যাচাই করা যায়নি।', evidence: 'Three expected updates have not arrived.', evidenceBn: 'প্রত্যাশিত তিনটি হালনাগাদ আসেনি।', action: 'Confirm in the provider app before acting.', actionBn: 'পদক্ষেপের আগে প্রোভাইডার অ্যাপে যাচাই করুন।', owner: 'Support queue', status: 'Awaiting verification', time: '18m', history: ['2:48 PM · Feed delayed', '2:55 PM · Verification requested'] },
]

export function useRealtimeAlerts() {
  const [alerts, setAlerts] = useState(demoAlerts)
  const [latest, setLatest] = useState(null)
  useEffect(() => {
    const socket = getSocket()
    const receive = (alert) => { setAlerts((current) => [alert, ...current.filter((item) => item.id !== alert.id)]); setLatest(alert) }
    socket.on('alert', receive); socket.connect()
    return () => { socket.off('alert', receive); socket.disconnect() }
  }, [])
  return { alerts, latest, dismiss: (id) => setAlerts((items) => items.filter((item) => item.id !== id)), clearLatest: () => setLatest(null) }
}
