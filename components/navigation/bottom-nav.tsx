'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Home, Settings, Wallet } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export default function BottomNav() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/transactions', label: 'Transactions', icon: Wallet },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 border-t border-white/50 dark:border-white/10">
        <div className="max-w-full px-2 sm:px-4 py-2">
          <div className="flex items-center justify-between gap-1">
            {/* Nav Items */}
            <div className="flex gap-1 flex-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex-1 flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl transition-smooth group ${
                    isActive(href)
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className={`transition-transform duration-300 ${
                    isActive(href) ? 'w-6 h-6' : 'w-5 h-5 group-hover:scale-110'
                  }`} />
                  <span className={`text-xs font-semibold transition-colors ${
                    isActive(href) 
                      ? 'text-white' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Theme Toggle */}
            <div className="ml-1 flex-shrink-0">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
