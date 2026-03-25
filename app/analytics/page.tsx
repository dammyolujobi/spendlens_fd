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
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Insights into your spending</p>
        </div>

        <DateRangeFilter selectedRange={dateRange} onRangeChange={setDateRange} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-gradient-to-br from-red-50 to-red-50/50 dark:from-red-950/20 dark:to-red-950/10 border-red-200/30 dark:border-red-900/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-10 w-32 mb-2" />
              ) : (
                <>
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">₦{totalDebit.toFixed(2)}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{filteredTransactions.filter(t => t.type === 'debit').length} transactions</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-50/50 dark:from-green-950/20 dark:to-green-950/10 border-green-200/30 dark:border-green-900/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">Total Received</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-10 w-32 mb-2" />
              ) : (
                <>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">₦{totalCredit.toFixed(2)}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{filteredTransactions.filter(t => t.type === 'credit').length} transactions</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 rounded-lg" />
                ))}
              </div>
            ) : error ? (
              <p className="text-red-600 dark:text-red-400">{error}</p>
            ) : topVendors.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No vendors found</p>
            ) : (
              <div className="space-y-3">
                {topVendors.map(([vendor, stats]) => (
                  <div key={vendor} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-white/5">
                    <div>
                      <p className="font-medium">{vendor}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stats.count} transactions</p>
                    </div>
                    <p className={`text-lg font-semibold ${stats.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
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
