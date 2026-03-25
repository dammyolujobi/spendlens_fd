'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50/30 dark:from-black dark:to-blue-950/20">
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Customize your experience</p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            {mounted ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Choose your preferred color scheme</p>
                <div className="grid grid-cols-3 gap-4">
                  {themes.map((t) => {
                    const Icon = t.icon
                    const isActive = theme === t.value
                    return (
                      <button
                        key={t.value}
                        onClick={() => setTheme(t.value)}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          isActive
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                            : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:border-gray-300 dark:hover:border-white/20'
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`} />
                        <span className={`text-sm font-medium ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                          {t.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="h-32 bg-gray-100 dark:bg-white/5 rounded-lg animate-pulse" />
            )}
          </CardContent>
        </Card>

        <Card className="max-w-2xl mt-6">
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">App Name</p>
                <p className="font-medium">SpendLens</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Version</p>
                <p className="font-medium">1.0.0</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
                <p className="font-medium">Track your spending with ease using an Apple-inspired interface</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
