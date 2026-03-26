'use client'

import { VendorDrainStats } from '@/lib/utils'

interface SilentDrainsBannerProps {
  vendorDrains: VendorDrainStats[]
  isVisible: boolean
}

export default function SilentDrainsBanner({ vendorDrains, isVisible }: SilentDrainsBannerProps) {
  if (!isVisible || vendorDrains.length === 0) return null

  // Show the first vendor with the most drain
  const topVendor = vendorDrains[0]

  return (
    <div className="mb-4 animate-fade-in-up">
      <div className="relative rounded-lg bg-white/20 dark:bg-white/5 p-4 backdrop-blur-sm">
        <p className="text-sm text-gray-900 dark:text-gray-100">
          You've sent{' '}
          <span className="font-bold text-red-600 dark:text-red-400">₦{topVendor.total.toLocaleString()}</span> to{' '}
          <span className="font-semibold">{topVendor.vendor}</span> in small payments this period —{' '}
          <span className="font-semibold">{topVendor.count} times</span> at an average of{' '}
          <span className="font-semibold">₦{Math.round(topVendor.average).toLocaleString()}</span> each.
        </p>
      </div>
    </div>
  )
}
