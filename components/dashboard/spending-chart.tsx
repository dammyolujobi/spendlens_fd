'use client'

import { Card, CardContent } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'

interface Transaction {
  from: string
  amount: string
  date: string
  subject: string
  type: 'credit' | 'debit'
}

interface Props {
  transactions: Transaction[]
}

// Bar colors for chart
const barColors = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#10B981',
  '#F59E0B', '#EF4444', '#06B6D4', '#6366F1'
]

function VendorAvatar({ vendor }: { vendor: string }) {
  const initials = vendor
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // Deterministic color based on vendor name
  const colors = [
    'bg-blue-600', 'bg-purple-600', 'bg-pink-600', 'bg-green-600',
    'bg-orange-600', 'bg-red-600', 'bg-cyan-600', 'bg-indigo-600'
  ]
  let hash = 0
  for (let i = 0; i < vendor.length; i++) {
    hash = ((hash << 5) - hash) + vendor.charCodeAt(i)
  }
  const colorIndex = Math.abs(hash) % colors.length

  return (
    <div className={`w-9 h-9 rounded-lg ${colors[colorIndex]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
      {initials}
    </div>
  )
}

// Formatter for Y-axis to show abbreviated currency values
const formatYAxisValue = (value: number): string => {
  if (value >= 1000) {
    return `₦${(value / 1000).toFixed(0)}k`
  }
  return `₦${value}`
}

export default function SpendingChart({ transactions }: Props) {
  // Group by vendor and sum amounts, count transactions
  const vendorData = transactions.reduce(
    (acc, t) => {
      const vendor = t.from
      const amount = parseFloat(t.amount.replace(/[^0-9.]/g, ''))
      const existing = acc.find(item => item.vendor === vendor)

      if (existing) {
        existing.amount += isNaN(amount) ? 0 : amount
        existing.count += 1
      } else {
        acc.push({
          vendor: vendor,
          amount: isNaN(amount) ? 0 : amount,
          count: 1
        })
      }
      return acc
    },
    [] as Array<{ vendor: string; amount: number; count: number }>
  )

  // Sort and take top 8
  const chartData = vendorData
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8)
    .map((item, idx) => ({
      name: item.vendor.substring(0, 12),
      value: parseFloat(item.amount.toFixed(2)),
      vendor: item.vendor,
      count: item.count,
      color: barColors[idx % barColors.length]
    }))

  // Calculate max for bar width normalization
  const maxAmount = Math.max(...chartData.map(d => d.value), 1)

  return (
    <Card className="bg-gradient-to-br from-white/50 to-white/30 dark:from-white/10 dark:to-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 hover:border-white/40 dark:hover:border-white/20 shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 transition-spring">
      <CardContent className="p-4 sm:p-6 md:p-8 lg:p-10 space-y-4 sm:space-y-6 md:space-y-8">
        {chartData.length > 0 ? (
          <>
            {/* Header */}
            <div className="animate-fade-in-up">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">Top Spending</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Vendors consuming your budget</p>
            </div>

            {/* Bar Chart */}
            <div className="w-full animate-fade-in-up overflow-x-auto" style={{ animationDelay: '50ms' }}>
              <ResponsiveContainer width="100%" height={typeof window !== 'undefined' && window.innerWidth >= 1536 ? 280 : typeof window !== 'undefined' && window.innerWidth >= 1024 ? 240 : typeof window !== 'undefined' && window.innerWidth >= 640 ? 200 : 180}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#D1D5DB" 
                    style={{ fontSize: '12px' }}
                    tick={{ fill: '#9CA3AF' }}
                  />
                  <YAxis 
                    stroke="#D1D5DB"
                    style={{ fontSize: '12px' }}
                    tick={{ fill: '#9CA3AF' }}
                    tickFormatter={formatYAxisValue}
                  />
                  <Bar dataKey="value" radius={[12, 12, 0, 0]} isAnimationActive={true}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10" />

            {/* Vendor List with Spending Bars */}
            <div className="space-y-2 sm:space-y-3 md:space-y-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Top Vendors Breakdown</p>
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                {chartData.map((item, idx) => {
                  const barWidth = (item.value / maxAmount) * 100
                  return (
                    <div 
                      key={item.vendor} 
                      className="group p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/30 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/10 border border-white/10 dark:border-white/5 hover:border-white/20 dark:hover:border-white/15 transition-spring animate-fade-in-up cursor-default"
                      style={{ animationDelay: `${150 + idx * 50}ms` }}
                    >
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <VendorAvatar vendor={item.vendor} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-semibold truncate text-gray-900 dark:text-white group-hover:text-color transition-colors">{item.vendor}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">{item.count} txn{item.count !== 1 ? 's' : ''}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white group-hover:text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text transition-all">₦{item.value.toLocaleString().slice(0, 20)}</p>
                          </div>
                        </div>
                        {/* Enhanced spending bar */}
                        <div className="h-1.5 sm:h-2 bg-white/20 dark:bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-700 ease-out shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50"
                            style={{ 
                              width: `${barWidth}%`,
                              background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="h-96 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400 text-center">
              <span className="loading-pulse">No transaction data available</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
