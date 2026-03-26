'use client'

import { useEffect, useState } from 'react'
import DashboardHeader from '@/components/dashboard/header'
import SummaryCards from '@/components/dashboard/summary-cards'
import SpendingChart from '@/components/dashboard/spending-chart'
import DateRangeFilter from '@/components/date-range-filter'
import { Skeleton } from '@/components/ui/skeleton'
import { detectTransactionType, filterTransactionsByDateRange, DateRangeType } from '@/lib/utils'

interface Transaction {
  from: string
  amount: string
  date: string
  subject: string
  type: 'credit' | 'debit'
}

export default function Page() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<DateRangeType>('month')

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://127.0.0.1:8000/gmail/get_amount')
        if (!response.ok) throw new Error('Failed to fetch transactions')
        const data = await response.json()
        const transactionsWithType = data.map((t: any) => ({
          ...t,
          type: detectTransactionType(t.subject)
        }))
        setTransactions(transactionsWithType)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.log('[v0] Error fetching transactions:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const filteredTransactions = filterTransactionsByDateRange(transactions, dateRange)

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50/30 dark:from-black dark:to-blue-950/5">
      <DashboardHeader />
      
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pb-12 pt-8 mx-auto">
        {loading ? (
          <div className="space-y-8 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`h-40 rounded-2xl loading-pulse ${i === 0 ? 'lg:col-span-2' : ''}`} />
              ))}
            </div>
            <div className="h-96 rounded-2xl loading-pulse" />
          </div>
        ) : error ? (
          <div className="text-center py-16 space-y-4 animate-fade-in-up">
            <p className="text-lg font-semibold text-red-600 dark:text-red-400">Error loading transactions</p>
            <p className="text-gray-600 dark:text-gray-400">Please ensure your API connection is working.</p>
          </div>
        ) : (
          <>
            <DateRangeFilter selectedRange={dateRange} onRangeChange={setDateRange} />
            <SummaryCards transactions={filteredTransactions} />
            <div className="mt-12 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <SpendingChart transactions={filteredTransactions} />
            </div>
          </>
        )}
      </div>
    </main>
  )
}
