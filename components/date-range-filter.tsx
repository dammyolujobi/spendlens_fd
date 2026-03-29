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
    <div className="flex gap-2 bg-white/20 dark:bg-white/10 rounded-lg p-1.5 mb-6 animate-fade-in-up overflow-x-auto scrollbar-hide">
      {ranges.map((range, idx) => (
        <button
          key={range.value}
          onClick={() => onRangeChange(range.value)}
          className={`px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm md:text-base font-semibold transition-spring relative group whitespace-nowrap flex-shrink-0 ${
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
