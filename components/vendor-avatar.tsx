import { getVendorInitials, getVendorColorClass } from '@/lib/utils'

interface VendorAvatarProps {
  vendorName: string
  size?: 'sm' | 'md' | 'lg'
}

export function VendorAvatar({ vendorName, size = 'md' }: VendorAvatarProps) {
  const initials = getVendorInitials(vendorName)
  const colorClass = getVendorColorClass(vendorName)

  const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  }

  return (
    <div
      className={`flex items-center justify-center rounded-lg font-semibold text-white shadow-md bg-gradient-to-br ${colorClass} ${sizeMap[size]}`}
    >
      {initials}
    </div>
  )
}
