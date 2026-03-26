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
    <div className="inline-flex bg-white/20 dark:bg-white/10 rounded-lg p-1.5 mb-6 animate-fade-in-up">
      {ranges.map((range, idx) => (
        <button
          key={range.value}
          onClick={() => onRangeChange(range.value)}
          className={`px-6 py-2.5 text-base font-semibold transition-spring relative group ${
            selectedRange === range.value
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md shadow-lg'
              : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
          style={{ animationDelay: `${idx * 50}ms` }}
        >
          {range.label}
        </button>
      ))}
    </div>
  )
}
