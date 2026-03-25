'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, detectTransactionType } from '@/lib/utils'
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

  const filtered = transactions.filter(t => {
    if (filter === 'all') return true
    return t.type === filter
  })

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50/30 dark:from-black dark:to-blue-950/20">
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Transactions</h1>
          <p className="text-gray-600 dark:text-gray-400">View all your transactions</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'credit', 'debit'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === f
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-white/20'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{filtered.length} Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-lg" />
                ))}
              </div>
            ) : error ? (
              <p className="text-red-600 dark:text-red-400">{error}</p>
            ) : filtered.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No transactions found</p>
            ) : (
              <div className="space-y-4">
                {filtered.map((transaction, idx) => {
                  const isCredit = transaction.type === 'credit'
                  return (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          isCredit ? 'bg-green-100 dark:bg-green-950' : 'bg-red-100 dark:bg-red-950'
                        }`}>
                          {isCredit ? (
                            <ArrowUpRight className={`w-5 h-5 ${isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                          ) : (
                            <ArrowDownLeft className={`w-5 h-5 ${isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{transaction.from}</p>
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
