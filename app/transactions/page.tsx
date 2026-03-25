'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, detectTransactionType, filterTransactionsByDateRange, DateRangeType } from '@/lib/utils'
import DateRangeFilter from '@/components/date-range-filter'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
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

  const dateFilteredTransactions = filterTransactionsByDateRange(transactions, dateRange)
  const filtered = dateFilteredTransactions.filter(t => {
    if (filter === 'all') return true
    return t.type === filter
  })

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50/30 dark:from-black dark:to-blue-950/20">
      <div className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Transactions</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">View and filter all your transactions</p>
        </div>

        <DateRangeFilter selectedRange={dateRange} onRangeChange={setDateRange} />

        <Card className="mb-8 transition-smooth">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Type Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 flex-wrap">
              {(['all', 'credit', 'debit'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                    filter === f
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-white/50 dark:bg-white/5 border border-white/30 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-white/10'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="transition-smooth">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">{filtered.length} Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-xl" />
                ))}
              </div>
            ) : error ? (
              <p className="text-red-600 dark:text-red-400">{error}</p>
            ) : filtered.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No transactions found</p>
            ) : (
              <div className="space-y-3">
                {filtered.map((transaction, idx) => {
                  const isCredit = transaction.type === 'credit'
                  return (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10 hover:border-white/50 dark:hover:border-white/20 transition-smooth group">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-smooth ${
                          isCredit ? 'bg-green-100/80 dark:bg-green-950/50 group-hover:bg-green-100 dark:group-hover:bg-green-950' : 'bg-red-100/80 dark:bg-red-950/50 group-hover:bg-red-100 dark:group-hover:bg-red-950'
                        }`}>
                          {isCredit ? (
                            <ArrowUpRight className={`w-5 h-5 ${isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                          ) : (
                            <ArrowDownLeft className={`w-5 h-5 ${isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-gray-900 dark:text-gray-100">{transaction.from}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{transaction.subject}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{formatDate(transaction.date)}</p>
                        </div>
                      </div>
                      <p className={`text-lg font-semibold ml-4 ${isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {isCredit ? '+' : '-'}₦{transaction.amount}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
