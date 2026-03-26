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
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50/30 dark:from-black dark:to-blue-950/5">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pb-12 pt-8 mx-auto">
        {/* Header */}
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-5xl sm:text-6xl font-bold mb-3">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">Deep insights into your spending patterns</p>
        </div>

        {/* Date Range Filter */}
        <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
          <DateRangeFilter selectedRange={dateRange} onRangeChange={setDateRange} />
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {/* Total Spent Card */}
          <Card className="bg-gradient-to-br from-white/50 to-white/30 dark:from-white/10 dark:to-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 hover:border-red-300/30 dark:hover:border-red-900/30 shadow-lg hover:shadow-2xl hover:shadow-red-500/10 transition-spring group animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <CardHeader className="pb-3 border-b border-white/10">
              <CardTitle className="text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">Total Spent</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {loading ? (
                <Skeleton className="h-12 w-40 loading-pulse" />
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="text-5xl sm:text-6xl xl:text-5xl 2xl:text-6xl font-bold text-transparent bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text group-hover:scale-105 transition-transform origin-left">
                      ₦{totalDebit.toLocaleString()}
                    </div>
                    <p className="text-sm xl:text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                      {filteredTransactions.filter(t => t.type === 'debit').length} transaction{filteredTransactions.filter(t => t.type === 'debit').length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Total Received Card */}
          <Card className="bg-gradient-to-br from-white/50 to-white/30 dark:from-white/10 dark:to-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 hover:border-green-300/30 dark:hover:border-green-900/30 shadow-lg hover:shadow-2xl hover:shadow-green-500/10 transition-spring group animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <CardHeader className="pb-3 border-b border-white/10">
              <CardTitle className="text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">Total Received</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {loading ? (
                <Skeleton className="h-12 w-40 loading-pulse" />
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="text-5xl sm:text-6xl xl:text-5xl 2xl:text-6xl font-bold text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text group-hover:scale-105 transition-transform origin-left">
                      ₦{totalCredit.toLocaleString()}
                    </div>
                    <p className="text-sm xl:text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                      {filteredTransactions.filter(t => t.type === 'credit').length} transaction{filteredTransactions.filter(t => t.type === 'credit').length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Vendors Card */}
        <Card className="bg-gradient-to-br from-white/50 to-white/30 dark:from-white/10 dark:to-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-spring animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <CardHeader className="pb-4 border-b border-white/10">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Top Vendors</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Your most frequent transaction partners</p>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-xl loading-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="p-6 bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 rounded-lg">
                <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
              </div>
            ) : topVendors.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-600 dark:text-gray-400 text-lg">No vendors found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topVendors.map(([vendor, stats], idx) => (
                  <div 
                    key={vendor} 
                    className={`flex items-center justify-between p-5 rounded-xl border transition-spring group animate-fade-in-up ${
                      stats.type === 'credit'
                        ? 'bg-gradient-to-br from-green-50/40 dark:from-green-950/20 to-emerald-50/40 dark:to-emerald-950/20 border-green-200/20 dark:border-green-900/20 hover:from-green-100/60 dark:hover:from-green-900/40 hover:to-emerald-100/60 dark:hover:to-emerald-900/40 hover:border-green-300/30 dark:hover:border-green-800/30 hover:shadow-lg hover:shadow-green-500/20'
                        : 'bg-gradient-to-br from-red-50/40 dark:from-red-950/20 to-orange-50/40 dark:to-orange-950/20 border-red-200/20 dark:border-red-900/20 hover:from-red-100/60 dark:hover:from-red-900/40 hover:to-orange-100/60 dark:hover:to-orange-900/40 hover:border-red-300/30 dark:hover:border-red-800/30 hover:shadow-lg hover:shadow-red-500/20'
                    }`}
                    style={{ animationDelay: `${250 + idx * 50}ms` }}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold text-white text-sm transition-all group-hover:scale-110 group-hover:shadow-lg ${
                        stats.type === 'credit' 
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600 group-hover:shadow-green-500/30' 
                          : 'bg-gradient-to-br from-red-500 to-orange-600 group-hover:shadow-red-500/30'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all truncate">
                          {vendor}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors mt-1">
                          {stats.count} transaction{stats.count !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <p className={`text-lg font-bold transition-all group-hover:scale-110 origin-right ${
                      stats.type === 'credit' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      ₦{stats.total.toLocaleString()}
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
