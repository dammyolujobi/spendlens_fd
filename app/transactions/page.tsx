'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  formatDate, 
  detectTransactionType, 
  filterTransactionsByDateRange, 
  DateRangeType, 
  getMicroTransactionStats,
  groupTransactionsByDate,
  getMicroThreshold,
  getVendorDrainStats,
  getVendorDrainsAboveThreshold,
  MICRO_DRAIN_THRESHOLDS,
  VendorDrainStats
} from '@/lib/utils'
import SilentDrainsBanner from '@/components/silent-drains-banner'
import DateRangeFilter from '@/components/date-range-filter'
import { VendorAvatar } from '@/components/vendor-avatar'
import { Skeleton } from '@/components/ui/skeleton'

interface Transaction {
  from: string
  amount: string
  date: string
  subject: string
  type: 'credit' | 'debit'
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all')
  const [dateRange, setDateRange] = useState<DateRangeType>('month')
  const [microThreshold, setMicroThreshold] = useState(2000)
  const [mounted, setMounted] = useState(false)

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

    // Load threshold from localStorage
    setMounted(true)
    setMicroThreshold(getMicroThreshold())

    fetchTransactions()
  }, [])

  const dateFilteredTransactions = filterTransactionsByDateRange(transactions, dateRange)
  const filtered = dateFilteredTransactions.filter(t => {
    if (filter === 'all') return true
    return t.type === filter
  })

  // Get vendor drain stats for the banner (filtered micro transactions)
  const vendorDrainStats = getVendorDrainStats(dateFilteredTransactions, microThreshold)
  const periodThreshold = MICRO_DRAIN_THRESHOLDS[dateRange]
  const vendorsWithDrains = getVendorDrainsAboveThreshold(vendorDrainStats, periodThreshold)

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50/30 dark:from-black dark:to-blue-950/5">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pb-12 pt-8 mx-auto">
        {/* Header */}
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-5xl sm:text-6xl font-bold mb-2">Transactions</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">View and filter all your transactions</p>
        </div>

        {/* Date Range Filter */}
        <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
          <DateRangeFilter selectedRange={dateRange} onRangeChange={setDateRange} />
        </div>

        {/* Transaction Type Filter */}
        <div className="inline-flex bg-white/20 dark:bg-white/10 rounded-lg p-1.5 mb-10 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {(['all', 'credit', 'debit'] as const).map((f, idx) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 text-base font-semibold transition-spring relative group animate-fade-in-up ${
                filter === f
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
              style={{ animationDelay: `${150 + idx * 50}ms` }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Transactions Card */}
        <Card className="bg-gradient-to-br from-white/50 to-white/30 dark:from-white/10 dark:to-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-spring">
          <CardHeader className="pb-4 border-b border-white/10">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">{filtered.length} Transaction{filtered.length !== 1 ? 's' : ''}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-xl loading-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="p-6 bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 rounded-lg">
                <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-gray-600 dark:text-gray-400 text-lg">No transactions found</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Silent Drains Banner */}
                {mounted && (
                  <div className="animate-fade-in-up">
                    <SilentDrainsBanner 
                      vendorDrains={vendorsWithDrains}
                      isVisible={filter === 'all' || filter === 'debit'}
                    />
                  </div>
                )}

                {/* Grouped Transactions */}
                {groupTransactionsByDate(filtered).map(({ label, transactions }, groupIdx) => (
                  <div key={label} className="space-y-3 animate-fade-in-up" style={{ animationDelay: `${250 + groupIdx * 100}ms` }}>
                    {/* Date Group Header */}
                    <div className="px-3 pt-2">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                        {label}
                      </p>
                    </div>

                    {/* Transactions in this group */}
                    <div className="space-y-2">
                      {transactions.map((transaction, idx) => {
                        const isCredit = transaction.type === 'credit'
                        const amount = parseFloat(transaction.amount.replace(/[^0-9.]/g, ''))
                        const isMicro = !isNaN(amount) && amount > 0 && amount < microThreshold

                        return (
                          <div
                            key={idx}
                            className={`flex items-center justify-between p-4 sm:p-5 rounded-xl transition-spring group animate-fade-in-up border border-transparent ${
                              isCredit
                                ? 'bg-white/30 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/10 hover:border-green-200/30 dark:hover:border-green-900/20'
                                : 'bg-white/30 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/10 hover:border-red-200/30 dark:hover:border-red-900/20'
                            }`}
                            style={{ animationDelay: `${300 + groupIdx * 100 + idx * 30}ms` }}
                          >
                            {/* Left: Avatar */}
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <VendorAvatar vendorName={transaction.from} size="md" />

                              {/* Transaction Details */}
                              <div className="flex-1 min-w-0">
                                {/* Vendor Name - 16px semibold */}
                                <p className="text-base font-semibold truncate text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all">
                                  {transaction.from}
                                </p>

                                {/* Subject - 13px muted */}
                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-0.5 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                                  {transaction.subject}
                                </p>

                                {/* Date - 12px lighter grey */}
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1.5 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                                  {formatDate(transaction.date)}
                                </p>
                              </div>
                            </div>

                            {/* Right: Amount and Badge */}
                            <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                              {/* Micro Badge */}
                              {isMicro && !isCredit && (
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-orange-200/80 to-orange-100/80 dark:from-orange-950/60 dark:to-orange-900/60 text-orange-700 dark:text-orange-300 border border-orange-300/50 dark:border-orange-800/50 whitespace-nowrap shadow-sm hover:shadow-md transition-shadow">
                                  micro
                                </span>
                              )}

                              {/* Amount - 16px bold */}
                              <p
                                className={`text-base font-bold transition-all group-hover:scale-110 origin-right ${
                                  isCredit
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                                }`}
                              >
                                {isCredit ? '+' : '−'}₦{amount.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
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
