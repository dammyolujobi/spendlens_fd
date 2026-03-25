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
    <div className="flex flex-wrap gap-2 mb-6">
      {ranges.map(range => (
        <Button
          key={range.value}
          onClick={() => onRangeChange(range.value)}
          variant={selectedRange === range.value ? 'default' : 'outline'}
          size="sm"
          className={selectedRange === range.value ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
        >
          {range.label}
        </Button>
      ))}
    </div>
  )
}
