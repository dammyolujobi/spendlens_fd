'use client'

import { useEffect, useState, useRef } from 'react'

interface AnimatedNumberProps {
  value: number
  format?: (n: number) => string
  className?: string
  duration?: number // milliseconds
}

export function AnimatedNumber({
  value,
  format = (n) => n.toLocaleString('en-NG', { maximumFractionDigits: 0 }),
  className = '',
  duration = 800
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const animationRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (displayValue === value) return

    const startValue = displayValue
    const diff = value - startValue
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function: ease-out-cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(startValue + diff * eased)
      
      setDisplayValue(current)

      if (progress < 1) {
        animationRef.current = setTimeout(animate, 16) // ~60fps
      }
    }

    animationRef.current = setTimeout(animate, 16)

    return () => {
      if (animationRef.current) clearTimeout(animationRef.current)
    }
  }, [value, displayValue, duration])

  return <span className={className}>{format(displayValue)}</span>
}
