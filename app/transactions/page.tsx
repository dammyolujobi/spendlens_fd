'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useSettings } from '@/context/SettingsContext'
import { ApiClient } from '@/lib/api-client'
import { 
  detectTransactionType, 
  filterTransactionsByDateRange, 
  DateRangeType
} from '@/lib/utils'
import { ProtectedRoute } from '@/components/ProtectedRoute'

interface Transaction {
  from: string
  amount: string
  date: string
  subject: string
  type: 'credit' | 'debit'
}

function TransactionsPageContent() {
  const { isAuthenticated, isLoading, accessToken } = useAuth()
  const { microThreshold } = useSettings()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all')
  const [dateRange, setDateRange] = useState<DateRangeType>('month')

  // Fetch transactions AFTER auth context finishes loading
  useEffect(() => {
    // Guard 1: Wait for auth context to finish loading from localStorage
    if (isLoading) return
    // Guard 2: Don't fetch if not authenticated
    if (!isAuthenticated) return

    const fetchTransactions = async () => {
      try {
        setLoading(true)
        const data = await ApiClient.get('/gmail/get_amount', accessToken || undefined)
        const transactionsWithType = data.map((t: any) => ({
          ...t,
          type: detectTransactionType(t.subject)
        }))
        setTransactions(transactionsWithType)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('[Transactions] Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [isLoading, isAuthenticated, accessToken])

  const dateFilteredTransactions = filterTransactionsByDateRange(transactions, dateRange)
  const filtered = dateFilteredTransactions.filter(t => {
    if (filter === 'all') return true
    return t.type === filter
  })

  // Helper to check if transaction is a micro transaction
  const isMicroTransaction = (amount: string, type: 'credit' | 'debit') => {
    if (type !== 'debit') return false // Only debit transactions can be drains
    const numAmount = parseFloat(amount || '0')
    return numAmount > 0 && numAmount < microThreshold
  }

  return (
    <div className="page active">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-sub">All your transactions in one place</p>
        </div>
      </div>

      {/* Period Filter */}
      <div className="period-filter">
        {(['week', 'month', 'quarter', 'year'] as const).map(period => (
          <button
            key={period}
            className={`period-btn ${dateRange === period ? 'active' : ''}`}
            onClick={() => setDateRange(period)}
          >
            {period === 'week' ? 'This Week' : period === 'month' ? 'This Month' : period === 'quarter' ? 'This Quarter' : 'This Year'}
          </button>
        ))}
      </div>

      {/* Transaction Type Filter */}
      <div className="pill-filter" style={{ marginBottom: '24px' }}>
        {(['all', 'credit', 'debit'] as const).map(f => (
          <button
            key={f}
            className={`pill ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f === 'credit' ? 'Received' : 'Spent'}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="section-card">
        <div className="section-head">
          <div>
            <div className="section-title">Recent Transactions</div>
            <div className="section-subtitle">{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</div>
          </div>
          <div className="section-count">{filtered.length}</div>
        </div>
        <div>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>Loading...</div>
          ) : error ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <p style={{ color: 'var(--red)', marginBottom: '8px' }}>Error loading transactions</p>
              <p style={{ color: 'var(--muted)', fontSize: '13px' }}>{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
              No transactions found for this period
            </div>
          ) : (
            filtered.map((txn, idx) => (
              <div key={idx} className="txn-row">
                <div className="txn-avatar" style={{ background: txn.type === 'debit' ? 'rgba(224, 90, 90, 0.15)' : 'rgba(90, 191, 138, 0.15)' }}>
                  {txn.from.charAt(0).toUpperCase()}
                </div>
                <div className="txn-info">
                  <div className="txn-name">{txn.from}</div>
                  <div className="txn-desc">{txn.subject.substring(0, 50)}</div>
                  {isMicroTransaction(txn.amount, txn.type) && (
                    <div style={{ fontSize: '10px', fontFamily: "'DM Mono', monospace", color: 'var(--accent)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '500' }}>
                      Micro drain
                    </div>
                  )}
                </div>
                <div className="txn-right">
                  <div className={`txn-amount ${txn.type === 'debit' ? 'debit' : 'credit'}`}>
                    {txn.type === 'debit' ? '−' : '+'}₦{Math.abs(parseFloat(txn.amount || '0')).toLocaleString('en-NG', { maximumFractionDigits: 0 })}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: "'DM Mono', monospace" }}>
                    {new Date(txn.date).toLocaleDateString('en-NG')}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default function TransactionsPage() {
  return (
    <ProtectedRoute>
      <TransactionsPageContent />
    </ProtectedRoute>
  )
}
