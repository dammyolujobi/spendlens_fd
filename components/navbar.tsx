'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, logout, userName, userEmail, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isActive = (path: string) => pathname === path

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const navItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'Transactions', href: '/transactions' },
    { label: 'Analytics', href: '/analytics' },
    { label: 'Settings', href: '/settings' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 transition-smooth">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:shadow-lg transition-smooth">
              <span className="text-white font-bold text-sm">SL</span>
            </div>
            <span className="font-semibold text-lg hidden sm:inline group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">SpendLens</span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-8">
            {!isLoading && isAuthenticated && (
              <div className="hidden sm:flex gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-smooth ${
                      isActive(item.href)
                        ? 'bg-blue-500/15 dark:bg-blue-500/25 text-blue-700 dark:text-blue-300 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-white/8 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="relative p-2 rounded-lg bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-smooth hover:scale-105"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5 text-yellow-500 transition-transform group-hover:rotate-90" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600 transition-transform group-hover:rotate-90" />
                  )}
                </button>
              )}

              {!isLoading && isAuthenticated && (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {userName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {userEmail}
                    </p>
                  </div>
                  <Button
                    onClick={handleLogout}
                    size="sm"
                    variant="outline"
                    className="ml-4"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
