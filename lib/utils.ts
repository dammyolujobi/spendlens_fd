import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  } catch {
    return dateString
  }
}

export function detectTransactionType(subject: string): 'credit' | 'debit' {
  const lowerSubject = subject.toLowerCase()
  
  // Credit keywords
  const creditKeywords = ['credit', 'received', 'deposit', 'refund', 'transfer in', 'paid to', 'incoming']
  if (creditKeywords.some(keyword => lowerSubject.includes(keyword))) {
    return 'credit'
  }
  
  // Default to debit if uncertain
  return 'debit'
}

export type DateRangeType = 'week' | 'month' | 'quarter' | 'year' | 'all'

export function getDateRange(rangeType: DateRangeType): { start: Date; end: Date } {
  const end = new Date()
  const start = new Date()

  switch (rangeType) {
    case 'week':
      start.setDate(end.getDate() - 7)
      break
    case 'month':
      start.setMonth(end.getMonth() - 1)
      break
    case 'quarter':
      start.setMonth(end.getMonth() - 3)
      break
    case 'year':
      start.setFullYear(end.getFullYear() - 1)
      break
    case 'all':
    default:
      start.setFullYear(1970)
  }

  return { start, end }
}

export function parseTransactionDate(dateString: string): Date {
  try {
    return new Date(dateString)
  } catch {
    return new Date(0)
  }
}

export function filterTransactionsByDateRange<T extends { date: string; [key: string]: any }>(
  transactions: T[],
  rangeType: DateRangeType
): T[] {
  const { start, end } = getDateRange(rangeType)

  return transactions.filter(t => {
    const transactionDate = parseTransactionDate(t.date)
    return transactionDate >= start && transactionDate <= end
  })
}

export function formatDateForDisplay(rangeType: DateRangeType): string {
  const { start, end } = getDateRange(rangeType)

  if (rangeType === 'all') {
    return 'All time'
  }

  if (rangeType === 'week') {
    return `Last 7 days (${formatDate(start.toString())} - ${formatDate(end.toString())})`
  }

  if (rangeType === 'month') {
    return `Last 30 days (${formatDate(start.toString())} - ${formatDate(end.toString())})`
  }

  if (rangeType === 'quarter') {
    return `Last 3 months (${formatDate(start.toString())} - ${formatDate(end.toString())})`
  }

  if (rangeType === 'year') {
    return `Last 12 months (${formatDate(start.toString())} - ${formatDate(end.toString())})`
  }

  return 'Custom'
}

// Micro transaction detection (under ₦2,000)
export const MICRO_TRANSACTION_THRESHOLD = 2000

export function isMicroTransaction(amount: string): boolean {
  const numAmount = parseFloat(amount.replace(/[^0-9.]/g, ''))
  return !isNaN(numAmount) && numAmount > 0 && numAmount < MICRO_TRANSACTION_THRESHOLD
}

export interface MicroTransactionStats {
  count: number
  total: number
  transactions: Array<{ amount: string; [key: string]: any }>
}

export function getMicroTransactionStats(
  transactions: Array<{ amount: string; type: string; [key: string]: any }>
): MicroTransactionStats {
  const microTransactions = transactions.filter(t => t.type === 'debit' && isMicroTransaction(t.amount))
  
  const total = microTransactions.reduce((sum, t) => {
    const amount = parseFloat(t.amount.replace(/[^0-9.]/g, ''))
    return sum + (isNaN(amount) ? 0 : amount)
  }, 0)

  return {
    count: microTransactions.length,
    total,
    transactions: microTransactions
  }
}

// Vendor avatar utilities
const AVATAR_COLORS = [
  'from-blue-600 to-blue-700',
  'from-purple-600 to-purple-700',
  'from-pink-600 to-pink-700',
  'from-green-600 to-green-700',
  'from-orange-600 to-orange-700',
  'from-red-600 to-red-700',
  'from-cyan-600 to-cyan-700',
  'from-indigo-600 to-indigo-700',
  'from-emerald-600 to-emerald-700',
  'from-yellow-600 to-yellow-700',
]

export function getVendorInitials(vendorName: string): string {
  return vendorName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getVendorColorClass(vendorName: string): string {
  // Deterministic hash based on vendor name
  let hash = 0
  for (let i = 0; i < vendorName.length; i++) {
    const char = vendorName.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length
  return AVATAR_COLORS[index]
}

// Date grouping for transactions
export function groupTransactionsByDate(
  transactions: Array<{ date: string; [key: string]: any }>
): Array<{ label: string; transactions: Array<{ date: string; [key: string]: any }> }> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const groups: Record<string, Array<{ date: string; [key: string]: any }>> = {
    'Today': [],
    'Yesterday': [],
    'Earlier': []
  }

  const dateLabels: { date: Date; label: string }[] = []

  transactions.forEach(t => {
    const txDate = parseTransactionDate(t.date)
    txDate.setHours(0, 0, 0, 0)

    if (txDate.getTime() === today.getTime()) {
      groups['Today'].push(t)
    } else if (txDate.getTime() === yesterday.getTime()) {
      groups['Yesterday'].push(t)
    } else {
      const monthYear = txDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      })
      if (!groups[monthYear]) {
        groups[monthYear] = []
        dateLabels.push({ date: txDate, label: monthYear })
      }
      groups[monthYear].push(t)
    }
  })

  const result: Array<{ label: string; transactions: Array<{ date: string; [key: string]: any }> }> = []

  if (groups['Today'].length > 0) {
    result.push({ label: 'Today', transactions: groups['Today'] })
  }
  if (groups['Yesterday'].length > 0) {
    result.push({ label: 'Yesterday', transactions: groups['Yesterday'] })
  }

  // Sort earlier dates in descending order (newest first)
  dateLabels.sort((a, b) => b.date.getTime() - a.date.getTime())
  dateLabels.forEach(({ label }) => {
    if (groups[label].length > 0) {
      result.push({ label, transactions: groups[label] })
    }
  })

  return result
}

// Micro drain thresholds by period
export const MICRO_DRAIN_THRESHOLDS: Record<DateRangeType, { amount: number; count: number }> = {
  week: { amount: 5000, count: 3 },
  month: { amount: 20000, count: 4 },
  quarter: { amount: 30000, count: 8 },
  year: { amount: 60000, count: 15 },
  all: { amount: 100000, count: 30 }
}

// localStorage helpers
export function getMicroThreshold(): number {
  if (typeof window === 'undefined') return 2000
  const stored = localStorage.getItem('microThreshold')
  return stored ? parseInt(stored) : 2000
}

export function setMicroThreshold(value: number): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('microThreshold', value.toString())
}

// Vendor drain stats
export interface VendorDrainStats {
  vendor: string
  total: number
  count: number
  average: number
}

export function getVendorDrainStats(
  transactions: Array<{ from: string; amount: string; type: string; [key: string]: any }>,
  microThreshold: number
): VendorDrainStats[] {
  const vendorMap: Record<string, { total: number; count: number }> = {}

  transactions.forEach(t => {
    if (t.type !== 'debit') return
    const amount = parseFloat(t.amount.replace(/[^0-9.]/g, ''))
    if (isNaN(amount) || amount <= 0) return
    if (amount >= microThreshold) return // Only micro transactions

    if (!vendorMap[t.from]) {
      vendorMap[t.from] = { total: 0, count: 0 }
    }
    vendorMap[t.from].total += amount
    vendorMap[t.from].count += 1
  })

  return Object.entries(vendorMap)
    .map(([vendor, { total, count }]) => ({
      vendor,
      total,
      count,
      average: total / count
    }))
    .sort((a, b) => b.total - a.total)
}

export function getVendorDrainsAboveThreshold(
  vendorStats: VendorDrainStats[],
  threshold: { amount: number; count: number }
): VendorDrainStats[] {
  return vendorStats.filter(v => v.total >= threshold.amount && v.count >= threshold.count)
}
