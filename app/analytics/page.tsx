'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

export default function AnalyticsPage() {
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
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const filteredTransactions = filterTransactionsByDateRange(transactions, dateRange)

  const totalDebit = filteredTransactions.reduce((sum, t) => {
    if (t.type !== 'debit') return sum
    const amount = parseFloat(t.amount.replace(/[^0-9.]/g, ''))
    return sum + (isNaN(amount) ? 0 : amount)
  }, 0)

  const totalCredit = filteredTransactions.reduce((sum, t) => {
    if (t.type !== 'credit') return sum
    const amount = parseFloat(t.amount.replace(/[^0-9.]/g, ''))
    return sum + (isNaN(amount) ? 0 : amount)
  }, 0)

  // Top vendors
  const vendorStats = filteredTransactions.reduce((acc, t) => {
    const vendor = t.from
    const amount = parseFloat(t.amount.replace(/[^0-9.]/g, ''))
    if (!acc[vendor]) {
      acc[vendor] = { count: 0, total: 0, type: t.type }
    }
    acc[vendor].count += 1
    acc[vendor].total += isNaN(amount) ? 0 : amount
    return acc
  }, {} as Record<string, { count: number; total: number; type: string }>)

  const topVendors = Object.entries(vendorStats)
    .sort(([, a], [, b]) => b.total - a.total)
    .slice(0, 5)

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50/30 dark:from-black dark:to-blue-950/20">
      <div className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Deep insights into your spending patterns</p>
        </div>

        <DateRangeFilter selectedRange={dateRange} onRangeChange={setDateRange} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-in-up">
          <Card className="bg-gradient-to-br from-red-50 to-red-50/50 dark:from-red-950/20 dark:to-red-950/10 border-red-200/30 dark:border-red-900/30 hover:from-red-100/60 hover:to-red-100/40 dark:hover:from-red-950/30 dark:hover:to-red-950/20 transition-smooth group">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-red-700 dark:text-red-300 group-hover:text-red-800 dark:group-hover:text-red-200 transition-colors">Total Spent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <Skeleton className="h-10 w-32 mb-2" />
              ) : (
                <>
                  <div>
                    <div className="text-4xl font-bold text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors">₦{totalDebit.toFixed(2)}</div>
                    <p className="text-sm text-red-600/70 dark:text-red-400/70 mt-2">{filteredTransactions.filter(t => t.type === 'debit').length} transactions</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-50/50 dark:from-green-950/20 dark:to-green-950/10 border-green-200/30 dark:border-green-900/30 hover:from-green-100/60 hover:to-green-100/40 dark:hover:from-green-950/30 dark:hover:to-green-950/20 transition-smooth group">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-green-700 dark:text-green-300 group-hover:text-green-800 dark:group-hover:text-green-200 transition-colors">Total Received</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <Skeleton className="h-10 w-32 mb-2" />
              ) : (
                <>
                  <div>
                    <div className="text-4xl font-bold text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">₦{totalCredit.toFixed(2)}</div>
                    <p className="text-sm text-green-600/70 dark:text-green-400/70 mt-2">{filteredTransactions.filter(t => t.type === 'credit').length} transactions</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="transition-smooth animate-fade-in-up">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Top Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 rounded-xl" />
                ))}
              </div>
            ) : error ? (
              <p className="text-red-600 dark:text-red-400">{error}</p>
            ) : topVendors.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No vendors found</p>
            ) : (
              <div className="space-y-3">
                {topVendors.map(([vendor, stats]) => (
                  <div key={vendor} className="flex items-center justify-between p-4 rounded-xl bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10 hover:border-white/50 dark:hover:border-white/20 transition-smooth group">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-gray-950 dark:group-hover:text-white transition-colors">{vendor}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stats.count} transactions</p>
                    </div>
                    <p className={`text-lg font-semibold transition-colors ${stats.type === 'credit' ? 'text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300' : 'text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300'}`}>
                      ₦{stats.total.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
