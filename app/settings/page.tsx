'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor, Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getMicroThreshold, setMicroThreshold } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [microThreshold, setMicroThresholdLocal] = useState<number | string>(2000)
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    setMounted(true)
    setMicroThresholdLocal(getMicroThreshold())
  }, [])

  const handleMicroThresholdChange = (value: string) => {
    // Allow empty input or numeric input only
    if (value === '' || /^\d+$/.test(value)) {
      setMicroThresholdLocal(value === '' ? '' : parseInt(value))
    }
  }

  const handleMicroThresholdBlur = () => {
    const numValue = typeof microThreshold === 'string' ? parseInt(microThreshold) : microThreshold
    if (numValue > 0) {
      setMicroThresholdLocal(numValue)
      setMicroThreshold(numValue)
      setShowConfirmation(true)
      toast({
        title: 'Amount set',
        description: `Threshold updated to ₦${numValue.toLocaleString()}`,
      })
      setTimeout(() => setShowConfirmation(false), 2000)
    } else if (microThreshold === '') {
      setMicroThresholdLocal(2000)
      setMicroThreshold(2000)
    }
  }

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50/30 dark:from-black dark:to-blue-950/5">
      <div className="px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 pb-20 pt-12 w-full">
        {/* Header */}
        <div className="mb-16 animate-fade-in-up">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">Customize your spending experience</p>
        </div>

        <div className="space-y-12">
          {/* Appearance Card */}
          <Card className="bg-gradient-to-br from-white/50 to-white/30 dark:from-white/10 dark:to-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 hover:border-white/40 dark:hover:border-white/20 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-spring animate-fade-in-up" style={{ animationDelay: '50ms' }}>
            <CardHeader className="pb-8 border-b border-white/10">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Appearance</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Choose your preferred color scheme</p>
            </CardHeader>
            <CardContent className="pt-8">
              {mounted ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    {themes.map((t, idx) => {
                      const Icon = t.icon
                      const isActive = theme === t.value
                      return (
                        <button
                          key={t.value}
                          onClick={() => setTheme(t.value)}
                          className={`relative overflow-hidden p-6 rounded-2xl border transition-spring group animate-fade-in-up flex flex-col items-center gap-3 ${
                            isActive
                              ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-950/40 dark:to-blue-950/20 shadow-lg shadow-blue-500/20'
                              : 'border-gray-200/50 dark:border-white/10 bg-white/40 dark:bg-white/5 hover:border-blue-300/50 dark:hover:border-blue-700/30 hover:bg-white/60 dark:hover:bg-white/10 hover:shadow-lg'
                          }`}
                          style={{ animationDelay: `${100 + idx * 50}ms` }}
                        >
                          <div className="relative z-10">
                            <Icon 
                              className={`w-8 h-8 transition-all duration-500 ${
                                isActive 
                                  ? 'text-blue-600 dark:text-blue-400 scale-110' 
                                  : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-110'
                              }`} 
                            />
                          </div>
                          <span className={`text-sm font-semibold transition-all ${
                            isActive 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : 'text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                          }`}>
                            {t.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="h-32 bg-gradient-to-r from-gray-200/40 to-gray-100/40 dark:from-white/10 dark:to-white/5 rounded-lg loading-pulse" />
              )}
            </CardContent>
          </Card>

          {/* Spending Thresholds Card */}
          <Card className="bg-gradient-to-br from-white/50 to-white/30 dark:from-white/10 dark:to-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 hover:border-white/40 dark:hover:border-white/20 shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 transition-spring animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <CardHeader className="pb-8 border-b border-white/10">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Spending Thresholds</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Define what counts as a "micro" transaction</p>
            </CardHeader>
            <CardContent className="pt-8">
              {mounted ? (
                <div className="space-y-7">
                  <div>
                    <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 block">
                      What amount feels small to you?
                    </label>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-700 dark:text-gray-300">₦</span>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={microThreshold}
                          onChange={(e) => handleMicroThresholdChange(e.target.value)}
                          onBlur={handleMicroThresholdBlur}
                          className="w-full px-5 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-white/30 dark:border-white/10 focus:border-white/50 dark:focus:border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-0 transition-spring font-semibold text-lg"
                        />
                        {showConfirmation && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-fade-in-up">
                            <Check className="w-5 h-5 text-green-500 dark:text-green-400" />
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">
                      Transactions below this amount will be highlighted as micro payments, helping you notice small recurring drains
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-24 bg-gradient-to-r from-gray-200/40 to-gray-100/40 dark:from-white/10 dark:to-white/5 rounded-lg loading-pulse" />
              )}
            </CardContent>
          </Card>

          {/* About Card */}
          <Card className="bg-gradient-to-br from-white/50 to-white/30 dark:from-white/10 dark:to-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 hover:border-white/40 dark:hover:border-white/20 shadow-lg hover:shadow-2xl hover:shadow-green-500/10 transition-spring animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <CardHeader className="pb-8 border-b border-white/10">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">About SpendLens</CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50/50 to-blue-50/30 dark:from-blue-950/30 dark:to-blue-950/10 border border-blue-100/50 dark:border-blue-900/20 animate-fade-in-up group hover:shadow-lg hover:shadow-blue-500/20 transition-spring hover:border-blue-200/50 dark:hover:border-blue-800/30" style={{ animationDelay: '200ms' }}>
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Version</p>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">1.0.0</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-50/50 to-green-50/30 dark:from-green-950/30 dark:to-green-950/10 border border-green-100/50 dark:border-green-900/20 animate-fade-in-up group hover:shadow-lg hover:shadow-green-500/20 transition-spring hover:border-green-200/50 dark:hover:border-green-800/30" style={{ animationDelay: '250ms' }}>
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Status</p>
                  <p className="font-bold text-green-600 dark:text-green-400 text-lg">Active</p>
                </div>
              </div>
              <div className="p-5 rounded-xl bg-gradient-to-br from-white/40 to-white/20 dark:from-white/10 dark:to-white/5 border border-white/20 dark:border-white/10 hover:border-white/30 dark:hover:border-white/20 transition-spring animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  <span className="font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">SpendLens</span> is your intelligent financial companion, analyzing email transactions to detect vendors, categorize spending patterns, and alert you to silent spending drains before they accumulate.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
