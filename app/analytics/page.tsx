'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { ApiClient } from '@/lib/api-client'
import { detectTransactionType, filterTransactionsByDateRange, DateRangeType } from '@/lib/utils'
import { ProtectedRoute } from '@/components/ProtectedRoute'

interface Transaction {
  from: string
  amount: string
  date: string
  subject: string
  type: 'credit' | 'debit'
}

function AnalyticsPageContent() {
  const { isAuthenticated, isLoading, accessToken } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<DateRangeType>('month')

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
        console.error('[Analytics] Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [isLoading, isAuthenticated, accessToken])

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
    <div className="page active">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-sub">Insights into your spending</p>
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

      {/* Stats Grid */}
      {loading ? (
        <div className="stat-grid">
          <div className="stat-card animate-pulse" style={{ background: 'var(--surface2)', height: '140px' }}></div>
          <div className="stat-card animate-pulse" style={{ background: 'var(--surface2)', height: '140px' }}></div>
        </div>
      ) : (
        <div className="stat-grid">
          <div className="stat-card spent">
            <div className="stat-label">Total Spent</div>
            <div className="stat-amount">₦{totalDebit.toLocaleString('en-NG', { maximumFractionDigits: 0 })}</div>
            <div className="stat-meta">{filteredTransactions.filter(t => t.type === 'debit').length} transactions</div>
          </div>
          <div className="stat-card received">
            <div className="stat-label">Total Received</div>
            <div className="stat-amount">₦{totalCredit.toLocaleString('en-NG', { maximumFractionDigits: 0 })}</div>
            <div className="stat-meta">{filteredTransactions.filter(t => t.type === 'credit').length} transactions</div>
          </div>
        </div>
      )}

      {/* Category Breakdown & Daily Average */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
          {/* Daily Average */}
          <div className="section-card">
            <div className="section-head">
              <div>
                <div className="section-title">Daily Average</div>
                <div className="section-subtitle">Per day in period</div>
              </div>
            </div>
            <div style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div>
                  <div style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px' }}>Spent</div>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: '22px', fontWeight: 700, color: 'var(--red)' }}>
                    ₦{Math.round(totalDebit / Math.max(1, filteredTransactions.length / 10)).toLocaleString('en-NG')}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px' }}>Received</div>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: '22px', fontWeight: 700, color: 'var(--green)' }}>
                    ₦{Math.round(totalCredit / Math.max(1, filteredTransactions.length / 10)).toLocaleString('en-NG')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Spending Trend */}
          <div className="section-card">
            <div className="section-head">
              <div>
                <div className="section-title">Trend</div>
                <div className="section-subtitle">This period vs average</div>
              </div>
            </div>
            <div style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: '28px', fontWeight: 700, color: totalDebit > totalCredit ? 'var(--red)' : 'var(--green)' }}>
                  {totalDebit > totalCredit ? '↓' : '↑'}
                </div>
                <div>
                  <div style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Net Position</div>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: '18px', fontWeight: 700, color: totalCredit > totalDebit ? 'var(--green)' : 'var(--red)', textDecoration: totalDebit > totalCredit ? 'none' : 'line-through' }}>
                    ₦{Math.abs(totalCredit - totalDebit).toLocaleString('en-NG')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Vendors Section */}
      <div className="section-card">
        <div className="section-head">
          <div>
            <div className="section-title">Top Vendors</div>
            <div className="section-subtitle">Your most frequent partners</div>
          </div>
          <div className="section-count">{topVendors.length}</div>
        </div>
        <div>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>Loading...</div>
          ) : error ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <p style={{ color: 'var(--red)', marginBottom: '8px' }}>Error loading analytics</p>
              <p style={{ color: 'var(--muted)', fontSize: '13px' }}>{error}</p>
            </div>
          ) : topVendors.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
              No vendors found for this period
            </div>
          ) : (
            topVendors.map(([vendor, stats], idx) => (
              <div key={vendor} className="vendor-row">
                <div className={`vendor-rank rank-${idx + 1}`}>
                  {idx + 1}
                </div>
                <div className="vendor-name">{vendor}</div>
                <div className="vendor-count">{stats.count} txns</div>
                <div className="vendor-amount">₦{stats.total.toLocaleString('en-NG', { maximumFractionDigits: 0 })}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <AnalyticsPageContent />
    </ProtectedRoute>
  )
}
