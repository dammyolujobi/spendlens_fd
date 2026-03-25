'use client'

import { DateRangeType, formatDateForDisplay } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface DateRangeFilterProps {
  selectedRange: DateRangeType
  onRangeChange: (range: DateRangeType) => void
}

export default function DateRangeFilter({ selectedRange, onRangeChange }: DateRangeFilterProps) {
  const ranges: { value: DateRangeType; label: string }[] = [
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'quarter', label: 'Quarter' },
    { value: 'year', label: 'Year' },
    { value: 'all', label: 'All Time' }
  ]

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {ranges.map(range => (
        <button
          key={range.value}
          onClick={() => onRangeChange(range.value)}
          className={`px-4 py-2 rounded-lg font-medium transition-smooth relative overflow-hidden group ${
            selectedRange === range.value
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800'
              : 'bg-white/50 dark:bg-white/5 border border-white/30 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-white/10 hover:border-white/50 dark:hover:border-white/20'
          }`}
        >
          <span className="relative z-10">{range.label}</span>
          {selectedRange === range.value && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-smooth -z-10" />
          )}
        </button>
      ))}
    </div>
  )
}
