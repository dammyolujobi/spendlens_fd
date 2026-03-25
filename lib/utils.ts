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

export function filterTransactionsByDateRange(
  transactions: Array<{ date: string; [key: string]: any }>,
  rangeType: DateRangeType
): Array<{ date: string; [key: string]: any }> {
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
