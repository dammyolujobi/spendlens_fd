'use client'

import { useMemo } from 'react'

interface Transaction {
  date: string
  amount: string
  type: 'credit' | 'debit'
}

interface WeeklyHeatmapProps {
  transactions: Transaction[]
}

export default function WeeklyHeatmap({ transactions }: WeeklyHeatmapProps) {
  const heatmapData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    // Build daily spend map
    const dailySpend: Record<string, number> = {}
    transactions
      .filter(t => t.type === 'debit')
      .forEach(t => {
        const amount = parseFloat(t.amount.replace(/[^0-9.]/g, '')) || 0
        const dateKey = t.date.split('T')[0]
        dailySpend[dateKey] = (dailySpend[dateKey] || 0) + amount
      })

    // Find max spend for scaling
    const maxSpend = Math.max(...Object.values(dailySpend), 1)

    // Generate weeks + days
    const weeks = []
    let currentDate = new Date(startOfMonth)

    // Add padding for first week
    const firstDayOfWeek = startOfMonth.getDay()
    if (firstDayOfWeek !== 0) {
      const paddingWeek = Array(firstDayOfWeek).fill(null)
      weeks.push(paddingWeek)
    }

    while (currentDate.getMonth() === startOfMonth.getMonth()) {
      const weekStart = weeks.length === 0 ? firstDayOfWeek : 0
      const week = []

      for (let i = 0; i < 7; i++) {
        if (weeks.length === 0 && i < firstDayOfWeek) {
          week.push(null)
        } else if (currentDate.getMonth() === startOfMonth.getMonth()) {
          const dateStr = currentDate.toISOString().split('T')[0]
          const amount = dailySpend[dateStr] || 0
          week.push({
            date: currentDate.toLocaleDateString('en-US', { day: 'numeric' }),
            amount,
            intensity: amount > 0 ? Math.ceil((amount / maxSpend) * 6) : 0,
          })
          currentDate.setDate(currentDate.getDate() + 1)
        } else {
          week.push(null)
        }
      }

      weeks.push(week)
    }

    return { weeks, days, maxSpend }
  }, [transactions])

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Weekly Spend Pattern
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
          Darker purple = higher spending day
        </p>
      </div>

      {/* Heatmap grid */}
      <div className="space-y-1">
        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {heatmapData.days.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-600 dark:text-gray-400"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Weeks */}
        {heatmapData.weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 gap-1">
            {week.map((cell, dayIdx) => (
              <div
                key={`${weekIdx}-${dayIdx}`}
                className={`aspect-square rounded relative group cursor-pointer transition-all hover:scale-110 hover:shadow-lg ${
                  cell === null
                    ? 'bg-transparent'
                    : cell.intensity === 0
                    ? 'heatmap-level-0'
                    : `heatmap-level-${cell.intensity}`
                }`}
              >
                {cell && (
                  <>
                    <div className="flex items-center justify-center h-full text-xs font-semibold text-gray-700 dark:text-gray-200">
                      {cell.date}
                    </div>
                    {cell.amount > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 dark:bg-black/70 text-white text-xs py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-center">
                        ₦{cell.amount.toLocaleString()}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mt-4 pt-4 border-t border-white/20 dark:border-white/10">
        <span>Less</span>
        <div className="flex gap-0.5">
          {[0, 1, 2, 3, 4, 5, 6].map((level) => (
            <div
              key={level}
              className={`w-2 h-2 rounded-sm heatmap-level-${level}`}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  )
}
