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
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50/30 dark:from-black dark:to-blue-950/20">
      <DashboardHeader />
      
      <div className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        {loading ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-2xl" />
              ))}
            </div>
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-600 dark:text-red-400 mb-4 text-lg">Error loading transactions</p>
            <p className="text-gray-600 dark:text-gray-400">Please ensure your API connection is working.</p>
          </div>
        ) : (
          <>
            <DateRangeFilter selectedRange={dateRange} onRangeChange={setDateRange} />
            <SummaryCards transactions={filteredTransactions} />
            <div className="mt-10 animate-fade-in-up">
              <SpendingChart transactions={filteredTransactions} />
            </div>
          </>
        )}
      </div>
    </main>
  )
}
