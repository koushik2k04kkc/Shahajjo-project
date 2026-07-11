import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../../../lib/apiClient'

export const demoAnomalies = [
  { id: 'AN-2408', title: 'Unusual Nagad cash-out velocity requires review', titleBn: 'নগদ ক্যাশ-আউটের অস্বাভাবিক গতি পর্যালোচনা প্রয়োজন', area: 'Mirpur', agent: 'AGT-2048', provider: 'Nagad', severity: 'high', confidence: 89, evidence: 'Velocity is 2.1x the 30-day baseline.', evidenceBn: 'লেনদেনের গতি ৩০ দিনের গড়ের ২.১ গুণ।', action: 'Coordinate float transfer across 3 nearby outlets.', actionBn: 'নিকটবর্তী ৩টি আউটলেটের মধ্যে ফ্লোট স্থানান্তর করুন।', owner: 'Farzana Akter', status: 'Pending human review', currentStep: 3, finalStatus: 'Not finalized — human review pending', time: '6m', timeBucket: '1h', history: ['3:02 PM · Signal created', '3:05 PM · Assigned to Farzana', '3:11 PM · Evidence acknowledged'] },
  { id: 'AN-2405', title: 'Conflicting Rocket feed requires review', titleBn: 'রকেটের অসামঞ্জস্যপূর্ণ তথ্য পর্যালোচনা প্রয়োজন', area: 'Mohammadpur', agent: 'AGT-1984', provider: 'Rocket', severity: 'unreliable', confidence: 62, evidence: 'Provider and ledger balances differ by ৳18,200.', evidenceBn: 'প্রোভাইডার ও লেজার ব্যালেন্সে ৳১৮,২০০ পার্থক্য।', action: 'Verify provider records before escalation.', actionBn: 'এসকেলেশনের আগে প্রোভাইডারের রেকর্ড যাচাই করুন।', owner: 'Data quality queue', status: 'Awaiting verification', time: '21m', timeBucket: '1h', history: ['2:43 PM · Conflict detected', '2:47 PM · Provider check requested'] },
  { id: 'AN-2401', title: 'bKash liquidity trend requires review', titleBn: 'বিকাশের তারল্য প্রবণতা পর্যালোচনা প্রয়োজন', area: 'Uttara', agent: 'AGT-1762', provider: 'bKash', severity: 'watch', confidence: 76, evidence: 'Five outlets may cross reserve thresholds tonight.', evidenceBn: 'আজ রাতে ৫টি আউটলেট সংরক্ষণসীমার নিচে যেতে পারে।', action: 'Prepare a shared float plan for the evening window.', actionBn: 'সন্ধ্যার জন্য যৌথ ফ্লোট পরিকল্পনা প্রস্তুত করুন।', owner: 'Dhaka North desk', status: 'Review scheduled', time: '43m', timeBucket: '1h', history: ['2:21 PM · Forecast threshold crossed', '2:26 PM · Area desk notified'] },
]

export function useAnomalies() {
  return useQuery({ queryKey: ['anomalies'], queryFn: ({ signal }) => apiGet('/anomalies', { signal }), select: (response) => response.data || response, initialData: demoAnomalies })
}
