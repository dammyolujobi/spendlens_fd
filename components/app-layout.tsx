'use client'

import { ReactNode } from 'react'
import { useAuth } from '@/context/AuthContext'
import BottomNav from '@/components/navigation/bottom-nav'

export function AppLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="app">
        <div className="page-area flex items-center justify-center">
          <div className="animate-spin">Loading...</div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return children
  }

  return (
    <div className="app">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="wordmark">
          <div className="logo-sq">SL</div>
          <span className="brand">SpendLens</span>
        </div>
        <div className="user-avatar">D</div>
      </div>

      {/* Page Area */}
      <div className="page-area">
        {children}
      </div>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  )
}
