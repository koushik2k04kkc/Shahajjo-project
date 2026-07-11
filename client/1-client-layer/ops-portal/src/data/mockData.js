export const mockOverview = {
  agent: { id: 'AGT-2048', name: 'Rahman Telecom', location: 'Mirpur 10, Dhaka', lastSync: 'Just now' },
  status: 'Operations are stable. Nagad may need attention within the next 2 hours.',
  balances: [
    { id: 'bkash', label: 'bKash balance', labelBn: 'বিকাশ ব্যালেন্স', amount: 184500, change: '+4.8%', status: 'healthy', color: '#C6006F', updatedAt: 'Now' },
    { id: 'nagad', label: 'Nagad balance', labelBn: 'নগদ ব্যালেন্স', amount: 62800, change: '-12.4%', status: 'watch', color: '#F58220', updatedAt: '2m ago' },
    { id: 'rocket', label: 'Rocket balance', labelBn: 'রকেট ব্যালেন্স', amount: null, status: 'stale', color: '#6F2C91', delayedMinutes: 18, updatedAt: '18m ago' },
    { id: 'cash', label: 'Shared cash', labelBn: 'নগদ অর্থ', amount: 326400, change: '+2.1%', status: 'healthy', color: '#24324A', updatedAt: 'Now' },
  ],
}

export const mockLiquidity = {
  confidence: 87,
  shortageWindow: { start: 7, end: 8, label: 'Projected shortage' },
  points: [
    { time: '8 AM', cash: 78, bkash: 63, nagad: 54, rocket: 48 },
    { time: '10 AM', cash: 74, bkash: 69, nagad: 50, rocket: 53 },
    { time: '12 PM', cash: 65, bkash: 74, nagad: 44, rocket: 58 },
    { time: '2 PM', cash: 58, bkash: 70, nagad: 35, rocket: 52 },
    { time: '4 PM', cash: 51, bkash: 62, nagad: 24, rocket: 45 },
    { time: '6 PM', cash: 47, bkash: 55, nagad: 18, rocket: 39 },
    { time: '8 PM', cash: 42, bkash: 48, nagad: 28, rocket: 35 },
    { time: '10 PM', cash: 38, bkash: 42, nagad: 36, rocket: 31 },
    { time: '12 AM', cash: 35, bkash: 39, nagad: 41, rocket: 28 },
  ],
}

export const mockAlerts = [
  { id: 'ALT-1042', title: 'Nagad cash-out pressure rising', severity: 'high', confidence: 87, time: '4 min ago', provider: 'Nagad', situation: 'Cash-out demand is increasing faster than today’s normal pattern.', evidence: 'Velocity is 1.8x baseline across the last 45 minutes.', action: 'Move ৳30,000 float to Nagad before 4:30 PM.', normal: 'A nearby salary disbursement could temporarily lift demand.' },
  { id: 'ALT-1039', title: 'Rocket feed is delayed', severity: 'unreliable', confidence: 64, time: '18 min ago', provider: 'Rocket', situation: 'The latest Rocket balance could not be verified.', evidence: 'Three expected feed updates have not arrived.', action: 'Confirm the balance in the provider app before acting.', normal: 'Provider maintenance can delay updates without affecting service.' },
  { id: 'ALT-1034', title: 'Unusual bKash transaction cluster', severity: 'watch', confidence: 72, time: '32 min ago', provider: 'bKash', situation: 'A transaction cluster requires review.', evidence: 'Seven similar deposits originated within a 12-minute window.', action: 'Review transaction references before the next settlement.', normal: 'A local merchant may be batching customer collections.' },
]

export const mockCases = [{ id: 'CASE-2841', title: 'Restore Nagad service continuity', owner: 'Farzana Akter', priority: 'High', sla: '42m remaining', currentStep: 2, steps: [
  { label: 'New', time: '3:02 PM' }, { label: 'Assigned', time: '3:05 PM' }, { label: 'Acknowledged', time: '3:11 PM' }, { label: 'Escalated' }, { label: 'Resolved' },
] }]

export const mockMetrics = [
  { label: 'Continuity score', value: '94%', hint: '+3% this week' },
  { label: 'Median response', value: '6m', hint: '2m faster' },
  { label: 'Cases resolved', value: '28', hint: 'Last 7 days' },
]
