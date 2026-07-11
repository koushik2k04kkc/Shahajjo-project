// Localization audit changelog: centralized Bangla numeral, BDT currency, relative-time, chart-time, SLA, and localized demo-field formatting; provider brands intentionally remain bKash/Nagad/Rocket in Latin script.
const localeFor = (language) => language === 'BN' ? 'bn-BD' : 'en-BD'

export function formatNumber(value, language = 'EN', options = {}) {
  return new Intl.NumberFormat(localeFor(language), options).format(Number(value) || 0)
}

export function formatCurrency(value, language = 'EN') {
  return `৳${formatNumber(value, language, { maximumFractionDigits: 0 })}`
}

export function formatPercent(value, language = 'EN') {
  return `${formatNumber(value, language, { maximumFractionDigits: 1 })}%`
}

export function formatClock(value, language = 'EN') {
  if (language !== 'BN' || !value) return value
  const match = String(value).match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i)
  if (!match) return localizeDigits(value, language)
  const date = new Date(2020, 0, 1, Number(match[1]) % 12 + (match[3].toUpperCase() === 'PM' ? 12 : 0), Number(match[2] || 0))
  return new Intl.DateTimeFormat('bn-BD', { hour: 'numeric', minute: match[2] ? '2-digit' : undefined }).format(date)
}

export function localizeDigits(value, language = 'EN') {
  if (language !== 'BN') return String(value ?? '')
  const digits = '০১২৩৪৫৬৭৮৯'
  return String(value ?? '').replace(/\d/g, (digit) => digits[Number(digit)])
}

export function formatRelativeTime(value, language, t) {
  const text = String(value ?? '')
  if (/^now$/i.test(text)) return t.now
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) return formatDateTime(text, language)
  const match = text.match(/^(\d+)\s*(m|min|h|hr|hrs)\s*(ago|remaining|to shortage)?$/i)
  if (!match) return localizeDigits(text, language)
  const unit = /^h/.test(match[2].toLowerCase()) ? t.hoursShort : t.minutesShort
  const suffix = match[3]?.toLowerCase() === 'ago' ? t.ago : match[3]?.toLowerCase() === 'remaining' ? t.remaining : match[3] ? t.toShortage : ''
  return `${formatNumber(match[1], language)} ${unit}${suffix ? ` ${suffix}` : ''}`
}

export function formatDateTime(value, language = 'EN') {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return localizeDigits(value, language)
  return new Intl.DateTimeFormat(localeFor(language), { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

export function localizeField(item, field, language = 'EN') {
  if (language === 'BN' && item?.[`${field}Bn`]) return item[`${field}Bn`]
  return item?.[field] ?? ''
}
