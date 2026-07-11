import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../../../lib/apiClient'

export const demoAnomalies = [
  { id: 'AN-2408', title: 'Nagad cash-out velocity spike', titleBn: 'নগদ ক্যাশ-আউটের গতি বৃদ্ধি', area: 'Mirpur', provider: 'Nagad', severity: 'high', confidence: 89, evidence: 'Velocity is 2.1x the 30-day baseline.', evidenceBn: 'লেনদেনের গতি ৩০ দিনের গড়ের ২.১ গুণ।', action: 'Coordinate float transfer across 3 nearby outlets.', actionBn: 'নিকটবর্তী ৩টি আউটলেটের মধ্যে ফ্লোট স্থানান্তর করুন।', time: '6m' },
  { id: 'AN-2405', title: 'Conflicting Rocket feed', titleBn: 'রকেটের তথ্যে অসামঞ্জস্য', area: 'Mohammadpur', provider: 'Rocket', severity: 'unreliable', confidence: 62, evidence: 'Provider and ledger balances differ by ৳18,200.', evidenceBn: 'প্রোভাইডার ও লেজার ব্যালেন্সে ৳১৮,২০০ পার্থক্য।', action: 'Verify provider records before escalation.', actionBn: 'এসকেলেশনের আগে প্রোভাইডারের রেকর্ড যাচাই করুন।', time: '21m' },
  { id: 'AN-2401', title: 'bKash liquidity trend requires review', titleBn: 'বিকাশের তারল্য প্রবণতা পর্যালোচনা প্রয়োজন', area: 'Uttara', provider: 'bKash', severity: 'watch', confidence: 76, evidence: 'Five outlets may cross reserve thresholds tonight.', evidenceBn: 'আজ রাতে ৫টি আউটলেট সংরক্ষণসীমার নিচে যেতে পারে।', action: 'Prepare a shared float plan for the evening window.', actionBn: 'সন্ধ্যার জন্য যৌথ ফ্লোট পরিকল্পনা প্রস্তুত করুন।', time: '43m' },
]

export function useAnomalies() {
  return useQuery({ queryKey: ['anomalies'], queryFn: ({ signal }) => apiGet('/anomalies', { signal }), select: (response) => response.data || response, initialData: demoAnomalies })
}
