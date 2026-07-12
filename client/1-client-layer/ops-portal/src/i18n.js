// Localization audit changelog: replaced hardcoded app/nav/profile, risk/severity/status, chart, filter, empty-state, help, settings, case, SLA, routing, tooltip, and accessibility text with shared EN/BN keys.
import { useAppStore } from './store/useAppStore'

export const words = {
  EN: {
    appName: 'Shahajjo', appTagline: 'Operations intelligence', appHome: 'Shahajjo home', documentTitle: 'Shahajjo Operations Portal', profileName: 'Nabila Chowdhury', switchToBangla: 'Switch to Bangla', switchToEnglish: 'Switch to English',
    workspace: 'Workspace', Overview: 'Overview', Liquidity: 'Liquidity', Alerts: 'Alerts', Cases: 'Cases', Metrics: 'Metrics', Settings: 'Settings', Help: 'Help & FAQ',
    openNavigation: 'Open navigation', closeNavigation: 'Close navigation', operationsLead: 'Operations lead', centralOperations: 'Central operations', switchWorkspace: 'Switch role / workspace',
    connected: 'System connected', sync: 'Last sync: just now', roleAgent: 'Agent operator', roleArea: 'Area manager', roleProvider: 'Provider admin',
    continuity: 'Service Continuity Clock', continuityHint: 'Projected float availability · next 16 hours', confidence: 'Confidence', lowConfidence: 'Low confidence', chartAria: 'Service continuity forecast line chart', chartShortage: 'Nagad projected shortage', sharedCash: 'Shared cash',
    alertFeed: 'Alert feed', alertHint: 'Prioritized by service impact', active: 'active', situation: 'Situation', evidence: 'Evidence', safeStep: 'Safe next step', whyNormal: 'Why this might be normal', aiSummary: 'AI incident summary',
    riskScore: 'Risk score', severity: 'Severity', finalOutcome: 'Final outcome', ownedBy: 'Owned by', assignedTo: 'assigned to',
    activeCase: 'Active case', caseHint: 'One coordinated response, visible to every stakeholder', viewAll: 'View all', demo: 'Demo data', refresh: 'Refresh data',
    healthy: 'Operations are stable. Nagad may need attention within the next 2 hours.',
    titleLiquidity: 'Provider float and service continuity forecast', titleAlerts: 'Evidence-led situations requiring review', titleCases: 'Track ownership, SLA, and resolution progress', titleMetrics: 'A focused view of operational outcomes', titleSettings: 'Configure notifications and operational thresholds',
    unavailable: 'Balance unavailable', delayed: 'data delayed', now: 'Now', pooledReserve: 'Pooled reserve · usable across providers', providerWallet: 'Provider-owned · separate wallet', wallet: 'wallet', sharedReserve: 'Shared cash reserve', minutesShort: 'm', hoursShort: 'h', secondsShort: 's', remaining: 'remaining', ago: 'ago', toShortage: 'to shortage',
    allClear: 'All clear', noMatchingAlerts: 'No alerts match these filters.', nothingToReview: 'Nothing to review', noScenarios: 'There are no active scenarios right now.', noActiveCases: 'No active cases', noCasesMessage: 'New cases will appear here when an alert is routed.', openCase: 'Open case',
    provider: 'Provider', agent: 'Agent', area: 'Area', time: 'Time', all: 'All', anyTime: 'Any time', lastHour: 'Last hour', clearFilters: 'Clear filters',
    metricContinuity: 'Continuity score', metricResponse: 'Median response', metricResolved: 'Cases resolved', thisWeek: 'this week', faster: 'faster', lastSevenDays: 'Last 7 days',
    settingRealtime: 'Real-time provider feed alerts', settingSla: 'SLA escalation reminders', settingDaily: 'Daily continuity summary',
    helpSubtitle: 'Quick guidance for operations workflows', helpConfidenceQ: 'What does low confidence mean?', helpConfidenceA: 'A feed is missing, delayed, or conflicting. Verify the provider record before acting.', helpSignalQ: 'Is an unusual signal confirmed wrongdoing?', helpSignalA: 'No. It requires review. A human reviewer must confirm the final judgment.', helpHistoryQ: 'Where is alert history?', helpHistoryA: 'Expand an alert to see ownership, acknowledgement, escalation, evidence, and status.', helpSupportQ: 'Operations support', helpSupportA: 'Internal desk · ext. 204 · available 24/7 for continuity incidents.',
    case: 'Case', priority: 'Priority', owner: 'Owner', status: 'Status', sla: 'SLA', unassigned: 'Unassigned', advanceCase: 'Advance case', closeDetails: 'Close case details', slaBreached: 'SLA breached', pending: 'Pending',
    team: 'Team', assignee: 'Assignee', note: 'Note', staffId: 'Staff ID', routeCase: 'Route case', routing: 'Routing…', routeFailed: 'Could not route the case. Please try again.',
  },
  BN: {
    appName: 'সাহায্য', appTagline: 'পরিচালন বুদ্ধিমত্তা', appHome: 'সাহায্য হোম', documentTitle: 'সাহায্য পরিচালন পোর্টাল', profileName: 'নাবিলা চৌধুরী', switchToBangla: 'বাংলায় বদলান', switchToEnglish: 'ইংরেজিতে বদলান',
    workspace: 'কর্মক্ষেত্র', Overview: 'সারসংক্ষেপ', Liquidity: 'তারল্য', Alerts: 'সতর্কতা', Cases: 'কেস', Metrics: 'পরিমাপক', Settings: 'সেটিংস', Help: 'সহায়তা ও সাধারণ প্রশ্ন',
    openNavigation: 'নেভিগেশন খুলুন', closeNavigation: 'নেভিগেশন বন্ধ করুন', operationsLead: 'পরিচালন প্রধান', centralOperations: 'কেন্দ্রীয় পরিচালনা', switchWorkspace: 'ভূমিকা / কর্মক্ষেত্র বদলান',
    connected: 'সিস্টেম সংযুক্ত', sync: 'সর্বশেষ হালনাগাদ: এইমাত্র', roleAgent: 'এজেন্ট অপারেটর', roleArea: 'এরিয়া ম্যানেজার', roleProvider: 'প্রোভাইডার অ্যাডমিন',
    continuity: 'সেবা সচলতার পূর্বাভাস', continuityHint: 'আগামী ১৬ ঘণ্টার সম্ভাব্য ফ্লোট প্রাপ্যতা', confidence: 'আস্থার মাত্রা', lowConfidence: 'কম আস্থা', chartAria: 'সেবা সচলতার পূর্বাভাস রেখাচিত্র', chartShortage: 'নগদে সম্ভাব্য ঘাটতি', sharedCash: 'যৌথ নগদ',
    alertFeed: 'সতর্কতার তালিকা', alertHint: 'সেবার প্রভাব অনুযায়ী অগ্রাধিকার', active: 'সক্রিয়', situation: 'পরিস্থিতি', evidence: 'প্রমাণ', safeStep: 'নিরাপদ পরবর্তী পদক্ষেপ', whyNormal: 'এটি স্বাভাবিক হতে পারে কেন', aiSummary: 'এআই-তৈরি ঘটনার সারাংশ',
    riskScore: 'ঝুঁকি স্কোর', severity: 'তীব্রতা', finalOutcome: 'চূড়ান্ত ফলাফল', ownedBy: 'দায়িত্বে', assignedTo: 'নিযুক্ত',
    activeCase: 'সক্রিয় কেস', caseHint: 'সব অংশীজনের জন্য দৃশ্যমান একটি সমন্বিত প্রতিক্রিয়া', viewAll: 'সব দেখুন', demo: 'ডেমো তথ্য', refresh: 'তথ্য হালনাগাদ করুন',
    healthy: 'কার্যক্রম স্থিতিশীল। আগামী ২ ঘণ্টার মধ্যে Nagad-এ নজর দেওয়া প্রয়োজন হতে পারে।',
    titleLiquidity: 'প্রোভাইডার ফ্লোট ও সেবা সচলতার পূর্বাভাস', titleAlerts: 'পর্যালোচনা প্রয়োজন এমন প্রমাণভিত্তিক পরিস্থিতি', titleCases: 'দায়িত্ব, এসএলএ ও সমাধানের অগ্রগতি দেখুন', titleMetrics: 'কার্যক্রমের ফলাফলের সংক্ষিপ্ত চিত্র', titleSettings: 'সতর্কতা ও পরিচালন সীমা নির্ধারণ করুন',
    unavailable: 'ব্যালেন্স পাওয়া যায়নি', delayed: 'তথ্য পেতে দেরি', now: 'এখন', pooledReserve: 'যৌথ রিজার্ভ · সব প্রোভাইডারে ব্যবহারযোগ্য', providerWallet: 'প্রোভাইডারের নিজস্ব · আলাদা ওয়ালেট', wallet: 'ওয়ালেট', sharedReserve: 'যৌথ নগদ রিজার্ভ', minutesShort: 'মি', hoursShort: 'ঘ', secondsShort: 'সে', remaining: 'বাকি', ago: 'আগে', toShortage: 'ঘাটতি হতে',
    allClear: 'সব স্বাভাবিক', noMatchingAlerts: 'এই ফিল্টারে কোনো সতর্কতা মেলেনি।', nothingToReview: 'পর্যালোচনার কিছু নেই', noScenarios: 'এখন কোনো সক্রিয় পরিস্থিতি নেই।', noActiveCases: 'সক্রিয় কেস নেই', noCasesMessage: 'সতর্কতা রুট হলে নতুন কেস এখানে দেখা যাবে।', openCase: 'কেস খুলুন',
    provider: 'প্রোভাইডার', agent: 'এজেন্ট', area: 'এলাকা', time: 'সময়', all: 'সব', anyTime: 'যেকোনো সময়', lastHour: 'গত ঘণ্টা', clearFilters: 'ফিল্টার মুছুন',
    metricContinuity: 'সচলতা স্কোর', metricResponse: 'মধ্যম প্রতিক্রিয়া সময়', metricResolved: 'সমাধান করা কেস', thisWeek: 'এই সপ্তাহে', faster: 'দ্রুততর', lastSevenDays: 'গত ৭ দিন',
    settingRealtime: 'তাৎক্ষণিক প্রোভাইডার ফিড সতর্কতা', settingSla: 'এসএলএ বৃদ্ধির স্মরণিকা', settingDaily: 'দৈনিক সচলতার সারাংশ',
    helpSubtitle: 'পরিচালন কাজের দ্রুত নির্দেশনা', helpConfidenceQ: 'কম আস্থা বলতে কী বোঝায়?', helpConfidenceA: 'কোনো ফিড অনুপস্থিত, বিলম্বিত বা পরস্পরবিরোধী। পদক্ষেপের আগে প্রোভাইডারের তথ্য যাচাই করুন।', helpSignalQ: 'অস্বাভাবিক সংকেত কি অনিয়ম নিশ্চিত করে?', helpSignalA: 'না। এটি পর্যালোচনা প্রয়োজন বোঝায়। চূড়ান্ত সিদ্ধান্ত একজন মানব পর্যালোচক নিশ্চিত করবেন।', helpHistoryQ: 'সতর্কতার ইতিহাস কোথায়?', helpHistoryA: 'দায়িত্ব, স্বীকৃতি, এস্কেলেশন, প্রমাণ ও অবস্থা দেখতে সতর্কতাটি প্রসারিত করুন।', helpSupportQ: 'পরিচালন সহায়তা', helpSupportA: 'অভ্যন্তরীণ ডেস্ক · এক্সটেনশন ২০৪ · সচলতা-সংক্রান্ত ঘটনার জন্য ২৪/৭ উপলভ্য।',
    case: 'কেস', priority: 'অগ্রাধিকার', owner: 'দায়িত্বপ্রাপ্ত', status: 'অবস্থা', sla: 'এসএলএ', unassigned: 'অনির্ধারিত', advanceCase: 'কেস এগিয়ে নিন', closeDetails: 'কেসের বিস্তারিত বন্ধ করুন', slaBreached: 'এসএলএ অতিক্রান্ত', pending: 'অপেক্ষমাণ',
    team: 'দল', assignee: 'দায়িত্বপ্রাপ্ত ব্যক্তি', note: 'নোট', staffId: 'কর্মী আইডি', routeCase: 'কেস রুট করুন', routing: 'রুট করা হচ্ছে…', routeFailed: 'কেসটি রুট করা যায়নি। আবার চেষ্টা করুন।',
  },
}

const enumWords = {
  low: ['Low', 'কম'], medium: ['Medium', 'মাঝারি'], high: ['High', 'উচ্চ'], critical: ['Critical', 'গুরুতর'], watch: ['Medium', 'মাঝারি'], unreliable: ['Unreliable', 'অনির্ভরযোগ্য'], healthy: ['Healthy', 'স্বাভাবিক'], stale: ['Delayed', 'বিলম্বিত'],
  pending: ['Pending', 'অপেক্ষমাণ'], pending_human_review: ['Pending human review', 'মানব পর্যালোচনার অপেক্ষায়'], flagged: ['Flagged', 'চিহ্নিত'], resolved: ['Resolved', 'সমাধান হয়েছে'], awaiting_verification: ['Awaiting verification', 'যাচাইয়ের অপেক্ষায়'], in_review: ['In review', 'পর্যালোচনাধীন'],
  open: ['Open', 'খোলা'], closed: ['Closed', 'বন্ধ'], investigating: ['Investigating', 'তদন্তাধীন'], approved: ['Approved', 'অনুমোদিত'], rejected: ['Rejected', 'প্রত্যাখ্যাত'], cancelled: ['Cancelled', 'বাতিল'], failed: ['Failed', 'ব্যর্থ'], completed: ['Completed', 'সম্পন্ন'],
  new: ['New', 'নতুন'], assigned: ['Assigned', 'নিযুক্ত'], acknowledged: ['Acknowledged', 'স্বীকৃত'], escalated: ['Escalated', 'এস্কেলেট করা হয়েছে'], detected: ['Detected', 'শনাক্ত'], human_review: ['Human review', 'মানব পর্যালোচনা'],
  area_operations: ['Area operations', 'এলাকা পরিচালনা'], provider_operations: ['Provider operations', 'প্রোভাইডার পরিচালনা'], risk_review: ['Risk review', 'ঝুঁকি পর্যালোচনা'],
  risk_triage: ['Risk triage', 'ঝুঁকি বাছাই দল'], system_routing: ['System routing', 'সিস্টেম রাউটিং'], data_quality_queue: ['Data quality queue', 'তথ্যমান যাচাই সারি'], dhaka_north_desk: ['Dhaka North desk', 'ঢাকা উত্তর ডেস্ক'],
}

const normalizeEnum = (value) => String(value ?? '').trim().toLowerCase().replace(/[\s-]+/g, '_')

export function translateEnum(value, language = 'EN') {
  const translated = enumWords[normalizeEnum(value)]
  return translated ? translated[language === 'BN' ? 1 : 0] : String(value ?? '')
}

export function useCopy() {
  const language = useAppStore((state) => state.language)
  return words[language] || words.EN
}
