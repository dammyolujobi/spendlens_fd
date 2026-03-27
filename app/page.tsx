'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { getGoogleLoginUrl, ApiClient } from '@/lib/api-client'
import { detectTransactionType, filterTransactionsByDateRange, DateRangeType } from '@/lib/utils'
import { AnimatedNumber } from '@/components/AnimatedNumber'
import { SilentDrains } from '@/components/SilentDrains'

interface Transaction {
  from: string
  amount: string
  date: string
  subject: string
  type: 'credit' | 'debit'
}

export default function Page() {
  const router = useRouter()
  const { isAuthenticated, isLoading, login, accessToken } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<DateRangeType>('month')
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [hasToken, setHasToken] = useState(false)

  // CRITICAL: Extract token from URL on mount
  useEffect(() => {
    // Direct check of URL
    const token = new URLSearchParams(window.location.search).get('token')
    if (!token) return
    
    console.log('[INIT] Token found in URL, extracting...')
    setHasToken(true)
    
    try {
      const [header, payload, signature] = token.split('.')
      if (!payload) throw new Error('Invalid token format')
      
      const decoded = JSON.parse(atob(payload))
      const email = decoded.email || ''
      const name = decoded.name || ''
      
      localStorage.setItem('access_token', token)
      localStorage.setItem('user_email', email)
      localStorage.setItem('user_name', name)
      
      login(token, '', email, name)
      window.history.replaceState({}, '', '/')
      
      console.log('[INIT] Token stored and auth updated')
    } catch (err) {
      console.error('[INIT] Token extraction failed:', err)
      setHasToken(false)
    }
  }, [])

  // Redirect to dashboard after successful auth
  useEffect(() => {
    if (hasToken && isAuthenticated && !isLoading) {
      router.push('/dashboard')
    }
  }, [hasToken, isAuthenticated, isLoading, router])

  // Fetch transactions after authenticated
  useEffect(() => {
    if (!isAuthenticated || isLoading) return

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
        console.log('[v0] Error fetching transactions:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [isAuthenticated, isLoading, accessToken])

  const handleGoogleLogin = () => {
    setIsRedirecting(true)
    window.location.href = getGoogleLoginUrl()
  }

  const filteredTransactions = filterTransactionsByDateRange(transactions, dateRange)

  // Show loading state while auth is initializing
  if (isLoading || hasToken) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--ink)' }}>
        <div className="h-8 w-8 rounded-full border-2 border-[--accent] border-t-transparent animate-spin"></div>
      </div>
    )
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', height: '100vh', background: 'var(--ink)', overflow: 'hidden', '@media (maxWidth: 1024px)': { gridTemplateColumns: '1fr' } }}>
        {/* Left Panel */}
        <div className="hidden lg:flex flex-col justify-between relative border-r" style={{ borderColor: 'var(--border)', paddingLeft: '56px', paddingRight: '56px', paddingTop: '48px', paddingBottom: '48px' }}>
          {/* Vertical decorative lines */}
          <div style={{ position: 'absolute', top: 0, left: '25%', bottom: 0, width: '1px', background: 'linear-gradient(to bottom, transparent 0%, var(--border) 30%, var(--border) 70%, transparent 100%)', pointerEvents: 'none', opacity: 0.4 }}></div>
          <div style={{ position: 'absolute', top: 0, left: '75%', bottom: 0, width: '1px', background: 'linear-gradient(to bottom, transparent 0%, var(--border) 30%, var(--border) 70%, transparent 100%)', pointerEvents: 'none', opacity: 0.3 }}></div>

          {/* Background glow */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 30% 60%, rgba(200, 169, 110, 0.07) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 20%, rgba(200, 169, 110, 0.04) 0%, transparent 70%)', pointerEvents: 'none' }}></div>

          {/* Wordmark */}
          <div className="relative z-10" style={{ animation: 'fadeUp 0.6s ease forwards' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-playfair)', fontWeight: 700, fontSize: '15px', color: 'var(--ink)', letterSpacing: '-0.5px' }}>
                SL
              </div>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', fontWeight: 400, letterSpacing: '0.1em', color: 'var(--paper)', textTransform: 'uppercase' }}>SpendLens</span>
            </div>
          </div>

          {/* Hero */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 0', animation: 'fadeUp 0.7s ease 0.15s forwards', opacity: 0 }}>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', fontWeight: 400, letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '28px' }}>
              Financial clarity · Gmail-powered
            </p>
            <h1 style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(44px, 4.5vw, 72px)', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--paper)', marginBottom: '28px' }}>
              Every naira<br />tells a <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>story.</em><br />Read yours.
            </h1>
            <p style={{ fontSize: '15px', fontWeight: 300, lineHeight: 1.7, color: 'var(--muted)', maxWidth: '380px' }}>
              SpendLens connects to your Gmail, finds your transaction emails, and turns scattered receipts into a clear picture of where your money actually goes.
            </p>
          </div>

          {/* Stats & Ticker */}
          <div style={{ animation: 'fadeUp 0.6s ease 0.45s forwards', opacity: 0 }}>
            {/* Ticker */}
            <div style={{ overflow: 'hidden', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '10px 0', marginBottom: '28px' }}>
              <div style={{ display: 'flex', gap: '48px', animation: 'ticker 18s linear infinite', whiteSpace: 'nowrap' }}>
                {[...Array(12)].map((_, i) => {
                  const items = ['Gmail scanning', '₦ amount extraction', 'Secure OAuth 2.0', 'Zero password storage', 'Auto-refresh tokens', 'Multi-currency support'];
                  return (
                    <div key={i} style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', letterSpacing: '0.12em', color: 'var(--muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                      {items[i % 6]} <span style={{ color: 'var(--accent)' }}>●</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '40px' }}>
              {[
                { num: '₦0', label: 'stored passwords' },
                { num: '2s', label: 'to connect Gmail' },
                { num: '100%', label: 'your data' }
              ].map((stat, i) => (
                <div key={i}>
                  <div style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '28px', fontWeight: 700, color: 'var(--paper)', lineHeight: 1 }}>
                    {stat.num}
                  </div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: '4px' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 56px', position: 'relative' }}>
          {/* Background glow */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 60% 50%, rgba(200, 169, 110, 0.04) 0%, transparent 70%)', pointerEvents: 'none' }}></div>

          {/* Auth Card */}
          <div style={{ width: '100%', maxWidth: '400px', background: 'rgba(245, 240, 232, 0.03)', border: '1px solid var(--border)', borderRadius: '2px', padding: '52px 44px', position: 'relative', zIndex: 10, animation: 'fadeUp 0.7s ease 0.3s forwards', opacity: 0 }}>
            {/* Corner accents */}
            <div style={{ position: 'absolute', top: '-1px', left: '-1px', width: '16px', height: '16px', borderTop: '2px solid var(--accent)', borderLeft: '2px solid var(--accent)' }}></div>
            <div style={{ position: 'absolute', bottom: '-1px', right: '-1px', width: '16px', height: '16px', borderBottom: '2px solid var(--accent)', borderRight: '2px solid var(--accent)' }}></div>

            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '18px' }}>
              Secure access
            </p>
            <h2 style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '32px', fontWeight: 700, lineHeight: 1.1, color: 'var(--paper)', marginBottom: '10px' }}>
              Sign in to<br />SpendLens
            </h2>
            <p style={{ fontSize: '13.5px', fontWeight: 300, color: 'var(--muted)', lineHeight: 1.6, marginBottom: '40px' }}>
              Connect your Google account to start tracking your spending automatically.
            </p>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>Continue with</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
            </div>

            {/* Google Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isRedirecting}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '15px 24px',
                background: 'transparent',
                border: '1px solid rgba(200, 169, 110, 0.35)',
                borderRadius: '2px',
                color: 'var(--paper)',
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: '0.03em',
                cursor: isRedirecting ? 'not-allowed' : 'pointer',
                opacity: isRedirecting ? 0.5 : 1,
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.color = 'var(--accent)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.35)'
                e.currentTarget.style.color = 'var(--paper)'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {isRedirecting ? 'Redirecting...' : 'Sign in with Google'}
            </button>

            {/* Fine Print */}
            <p style={{ marginTop: '28px', fontSize: '11.5px', fontWeight: 300, color: 'var(--muted)', lineHeight: 1.7, textAlign: 'center' }}>
              By signing in, you agree to our <a href="#" style={{ color: 'rgba(200, 169, 110, 0.7)', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'border-color 0.2s' }}>Terms of Service</a> and <a href="#" style={{ color: 'rgba(200, 169, 110, 0.7)', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'border-color 0.2s' }}>Privacy Policy</a>.<br />
              We only read transaction emails — nothing else.
            </p>
          </div>

          {/* Footer Note */}
          <p style={{ position: 'absolute', bottom: '48px', fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(107, 101, 96, 0.5)', textAlign: 'center', animation: 'fadeUp 0.6s ease 0.6s forwards', opacity: 0 }}>
            Your spending patterns analyzed · Your data secured
          </p>
        </div>
      </div>
    )
  }

  // Show dashboard if authenticated
  const totalSpent = filteredTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0)
  
  const totalReceived = filteredTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0)

  return (
    <div className="page active">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Your spending at a glance</p>
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

      {/* Stat Cards */}
      {loading ? (
        <div className="stat-grid">
          <div className="stat-card animate-pulse" style={{ background: 'var(--surface2)', height: '140px' }}></div>
          <div className="stat-card animate-pulse" style={{ background: 'var(--surface2)', height: '140px' }}></div>
        </div>
      ) : (
        <div className="stat-grid">
          <div className="stat-card spent">
            <div className="stat-label">Total Spent</div>
            <div className="stat-amount">
              ₦<AnimatedNumber 
                value={totalSpent} 
                format={(n) => n.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
                duration={1000}
              />
            </div>
            <div className="stat-meta">{filteredTransactions.filter(t => t.type === 'debit').length} transactions</div>
          </div>
          <div className="stat-card received">
            <div className="stat-label">Total Received</div>
            <div className="stat-amount">
              ₦<AnimatedNumber 
                value={totalReceived} 
                format={(n) => n.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
                duration={1000}
              />
            </div>
            <div className="stat-meta">{filteredTransactions.filter(t => t.type === 'credit').length} transactions</div>
          </div>
        </div>
      )}

      {/* Net Flow Banner */}
      {!loading && (
        <div className="net-banner">
          <div>
            <div className="net-label">Net Flow</div>
            <div className="net-amount" style={{ textDecoration: totalSpent > totalReceived ? 'line-through' : 'none' }}>
              ₦<AnimatedNumber 
                value={Math.abs(totalReceived - totalSpent)} 
                format={(n) => n.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
                duration={1000}
              />
            </div>
          </div>
          <div className="net-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {totalReceived > totalSpent ? (
                <polyline points="22 12 18 8 14 12"></polyline>
              ) : (
                <polyline points="22 12 18 16 14 12"></polyline>
              )}
              <line x1="9" y1="18" x2="0" y2="18"></line>
            </svg>
          </div>
        </div>
      )}

      {/* Silent Drains Section */}
      <SilentDrains transactions={transactions} />

      {/* Transactions Section */}
      {error ? (
        <div className="section-card">
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p style={{ color: 'var(--red)', marginBottom: '8px' }}>Error loading transactions</p>
            <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Please ensure your API connection is working.</p>
          </div>
        </div>
      ) : (
        <div className="section-card">
          <div className="section-head">
            <div>
              <div className="section-title">Recent Transactions</div>
              <div className="section-subtitle">{filteredTransactions.length} transactions</div>
            </div>
            <div className="section-count">{filteredTransactions.length}</div>
          </div>
          <div>
            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)' }}>Loading...</div>
            ) : filteredTransactions.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
                No transactions found for this period
              </div>
            ) : (
              filteredTransactions.slice(0, 10).map((txn, idx) => (
                <div key={idx} className="txn-row">
                  <div className="txn-avatar" style={{ background: txn.type === 'debit' ? 'rgba(224, 90, 90, 0.15)' : 'rgba(90, 191, 138, 0.15)' }}>
                    {txn.from.charAt(0).toUpperCase()}
                  </div>
                  <div className="txn-info">
                    <div className="txn-name">{txn.from}</div>
                    <div className="txn-desc">{txn.subject.substring(0, 40)}</div>
                  </div>
                  <div className="txn-right">
                    <div className={`txn-amount ${txn.type === 'debit' ? 'debit' : 'credit'}`}>
                      {txn.type === 'debit' ? '-' : '+'}₦{Math.abs(parseFloat(txn.amount || '0')).toLocaleString('en-NG', { maximumFractionDigits: 0 })}
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
      )}
    </div>
  )
}
