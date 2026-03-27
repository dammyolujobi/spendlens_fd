'use client'

import { useEffect, useState } from 'react'

interface VelocityRingProps {
  spent: number
  budget: number
  received: number
}

export default function VelocityRing({ spent, budget, received }: VelocityRingProps) {
  const [mounted, setMounted] = useState(false)
  
  // Calculate percentages
  const spentPercent = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0
  const receivedPercent = received > 0 ? Math.min((received / budget) * 100, 100) : 0
  
  // SVG path calculations
  const radius = 90
  const circumference = 2 * Math.PI * radius
  const spentOffset = circumference - (spentPercent / 100) * circumference
  const receivedOffset = circumference - (receivedPercent / 100) * circumference
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="w-64 h-64 rounded-full bg-white/20 dark:bg-white/10 animate-pulse" />

  return (
    <div className="flex flex-col items-center gap-6">
      {/* SVG Ring */}
      <div className="relative w-64 h-64">
        <svg
          width="256"
          height="256"
          viewBox="0 0 256 256"
          className="transform -rotate-90"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}
        >
          {/* Background ring */}
          <circle
            cx="128"
            cy="128"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-white/30 dark:text-white/10 transition-colors"
          />

          {/* Spent arc (red) */}
          <circle
            cx="128"
            cy="128"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-red-500 dark:text-red-400 transition-colors"
            strokeDasharray={circumference}
            strokeDashoffset={mounted ? spentOffset : circumference}
            strokeLinecap="round"
            style={{
              animation: mounted ? `fillRing 1.2s ease-out-quad forwards` : 'none',
            }}
          />

          {/* Received arc (green, offset) */}
          <circle
            cx="128"
            cy="128"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-green-500 dark:text-green-400 transition-colors"
            strokeDasharray={circumference}
            strokeDashoffset={receivedOffset}
            strokeLinecap="round"
            style={{
              animation: mounted ? `fillRing 1.2s ease-out-quad forwards 0.2s` : 'none',
              transformOrigin: '128px 128px',
              transform: `rotateZ(${(spentPercent / 100) * 360}deg)`,
            }}
          />

          {/* Center text */}
          <text
            x="128"
            y="140"
            textAnchor="middle"
            className="text-3xl font-bold fill-gray-900 dark:fill-white"
            style={{ fontSize: '28px', fontWeight: 'bold' }}
          >
            {spentPercent.toFixed(0)}%
          </text>
          <text
            x="128"
            y="158"
            textAnchor="middle"
            className="text-lg fill-gray-600 dark:fill-gray-400"
            style={{ fontSize: '12px' }}
          >
            through month
          </text>
        </svg>

        {/* Pulsing indicator */}
        <div
          className="absolute inset-0 rounded-full border-2 border-red-500/20 dark:border-red-400/20 animate-pulse-ring"
        />
      </div>

      {/* Legend */}
      <div className="flex gap-8 text-sm font-medium">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 dark:bg-red-400" />
          <span className="text-gray-700 dark:text-gray-300">Spent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-400" />
          <span className="text-gray-700 dark:text-gray-300">Received</span>
        </div>
      </div>

      {/* Micro-insight */}
      <div className="text-center text-xs text-gray-600 dark:text-gray-400 max-w-xs">
        {spentPercent < 25 && "You're pacing well — only a quarter through!"}
        {spentPercent >= 25 && spentPercent < 50 && "You're halfway through the month."}
        {spentPercent >= 50 && spentPercent < 75 && "Three quarters spent — watch the drain."}
        {spentPercent >= 75 && "Entering the final stretch. Tighten up now."}
      </div>
    </div>
  )
}
