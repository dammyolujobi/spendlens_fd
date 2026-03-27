'use client'

import { useEffect, useState } from 'react'
import { useSettings } from '@/context/SettingsContext'

interface Drain {
  vendor: string
  avatar: string
  avatarGradient: string
  purchases: number
  frequency: string
  total: number
  average: number
  percentage: number
}

interface SilentDrainsProps {
  transactions: any[]
}

export function SilentDrains({ transactions }: SilentDrainsProps) {
  const { microThreshold } = useSettings()
  const [drains, setDrains] = useState<Drain[]>([])
  const [totalDrain, setTotalDrain] = useState(0)

  useEffect(() => {
    // Filter micro transactions (debit + below threshold)
    const microTransactions = transactions.filter(
      (t) =>
        t.type === 'debit' &&
        parseFloat(t.amount || '0') > 0 &&
        parseFloat(t.amount || '0') < microThreshold
    )

    if (microTransactions.length === 0) {
      setDrains([])
      setTotalDrain(0)
      return
    }

    // Group by vendor
    const vendorMap = new Map<
      string,
      { total: number; count: number; amounts: number[] }
    >()

    microTransactions.forEach((t) => {
      const vendor = t.from
      const amount = parseFloat(t.amount || '0')

      if (!vendorMap.has(vendor)) {
        vendorMap.set(vendor, { total: 0, count: 0, amounts: [] })
      }

      const vData = vendorMap.get(vendor)!
      vData.total += amount
      vData.count += 1
      vData.amounts.push(amount)
    })

    // Calculate total drain
    const total = microTransactions.reduce(
      (sum, t) => sum + parseFloat(t.amount || '0'),
      0
    )
    setTotalDrain(total)

    // Build drain list
    const drainList: Drain[] = Array.from(vendorMap.entries())
      .map(([vendor, data]) => ({
        vendor,
        avatar: vendor.charAt(0).toUpperCase(),
        avatarGradient: getGradient(vendor),
        purchases: data.count,
        frequency: getFrequency(data.count),
        total: data.total,
        average: data.total / data.count,
        percentage: Math.round((data.total / total) * 100),
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3) // Top 3 drains

    setDrains(drainList)
  }, [transactions, microThreshold])

  if (drains.length === 0) return null

  // Project totals to 3 months and 1 year
  const threeMonthDrain = totalDrain * 3
  const yearDrain = totalDrain * 12

  return (
    <div className="drains-card">
      {/* Header */}
      <div className="drains-head">
        <div>
          <div className="drains-title-row">
            <div className="drains-dot"></div>
            <h2 className="drains-title">Silent Drains</h2>
          </div>
          <p className="drains-subtitle">
            Small charges quietly bleeding your balance
          </p>
        </div>
        <div className="total-drain">
          <p className="total-label">Total this month</p>
          <p className="total-amount">
            ₦{totalDrain.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
          </p>
          <p className="total-period">
            across {transactions.filter((t) => t.type === 'debit' && parseFloat(t.amount || '0') < microThreshold).length} micro-transactions
          </p>
        </div>
      </div>

      {/* Projection Banner */}
      <div className="projection-banner">
        <div className="proj-item">
          <p className="proj-period">This Month</p>
          <p className="proj-amount">
            ₦{totalDrain.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="proj-arrow">→</div>
        <div className="proj-item">
          <p className="proj-period">In 3 Months</p>
          <p className="proj-amount">
            ₦{threeMonthDrain.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="proj-arrow">→</div>
        <div className="proj-item">
          <p className="proj-period">In 1 Year</p>
          <p className="proj-amount">
            ₦{yearDrain.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* Drain Rows */}
      {drains.map((drain, idx) => (
        <div key={idx} className="drain-row">
          <div className="drain-row-top">
            <div className="drain-vendor">
              <div
                className="drain-avatar"
                style={{ background: drain.avatarGradient }}
              >
                {drain.avatar}
              </div>
              <div>
                <p className="drain-name">{drain.vendor}</p>
                <p className="drain-count">
                  {drain.purchases} purchases · avg every{' '}
                  {drain.frequency}
                </p>
              </div>
            </div>
            <div className="drain-right">
              <p className="drain-total">
                ₦{drain.total.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
              </p>
              <p className="drain-avg">
                avg ₦{drain.average.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
          <div className="compound-bar-track">
            <div
              className="compound-bar-fill"
              style={{ width: `${drain.percentage}%` }}
            ></div>
          </div>
          <div className="bar-scale">
            <span className="bar-scale-label">₦0</span>
            <span className="bar-scale-label">
              {drain.percentage}% of drain
            </span>
            <span className="bar-scale-label">
              ₦{totalDrain.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      ))}

      {/* Insight Footer */}
      <div className="drain-insight">
        <p className="insight-text">
          At your current rate,{' '}
          <strong>
            ₦{totalDrain.toLocaleString('en-NG', { maximumFractionDigits: 0 })}/month
          </strong>{' '}
          in micro-transactions adds up to{' '}
          <strong>
            ₦{yearDrain.toLocaleString('en-NG', { maximumFractionDigits: 0 })}/year
          </strong>
          . {drains[0] && <span>Your small purchases alone costs <strong>₦{(drains[0].total * 12).toLocaleString('en-NG', { maximumFractionDigits: 0 })}/year</strong>.</span>}
        </p>
      </div>
    </div>
  )
}

// Helper to get frequency string
function getFrequency(count: number): string {
  const daysPerTransaction = 30 / count
  if (daysPerTransaction < 1) return 'daily'
  if (daysPerTransaction < 7) return `${daysPerTransaction.toFixed(1)} days`
  if (daysPerTransaction < 30) return `${(daysPerTransaction / 7).toFixed(1)} weeks`
  return `${(daysPerTransaction / 30).toFixed(1)} months`
}

// Helper to get avatar gradient
function getGradient(vendor: string): string {
  const hash = vendor.charCodeAt(0)
  // Check if light mode
  const isLight = typeof document !== 'undefined' && document.documentElement.classList.contains('light')
  
  const darkGradients = [
    'linear-gradient(135deg,#c8a96e,#9d7d45)',
    'linear-gradient(135deg,#5abf8a,#2e8f5f)',
    'linear-gradient(135deg,#e05a5a,#c73b3b)',
    'linear-gradient(135deg,#888,#555)',
  ]
  
  const lightGradients = [
    'linear-gradient(135deg,#d4b896,#c8a96e)',
    'linear-gradient(135deg,#6fce9c,#5abf8a)',
    'linear-gradient(135deg,#ff6b6b,#e05a5a)',
    'linear-gradient(135deg,#b8b8b8,#9a9a9a)',
  ]
  
  const gradients = isLight ? lightGradients : darkGradients
  return gradients[hash % gradients.length]
}
