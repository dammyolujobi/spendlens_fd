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
  
  // Debit keywords
  const debitKeywords = ['order', 'receipt', 'payment', 'charged', 'debit', 'purchase', 'paid', 'subscription', 'spent']
  if (debitKeywords.some(keyword => lowerSubject.includes(keyword))) {
    return 'debit'
  }
  
  // Default to debit if uncertain
  return 'debit'
}
