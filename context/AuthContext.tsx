'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  accessToken: string | null
  refreshToken: string | null
  userEmail: string | null
  userName: string | null
  login: (accessToken: string, refreshToken: string, email?: string, name?: string) => void
  logout: () => void
  refreshAccessToken: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedAccessToken = localStorage.getItem('access_token')
        const storedRefreshToken = localStorage.getItem('refresh_token')
        const storedEmail = localStorage.getItem('user_email')
        const storedName = localStorage.getItem('user_name')

        console.log('[AuthContext.init]', { hasAccessToken: !!storedAccessToken, tokenShort: storedAccessToken?.slice(0, 30) + '...' })

        if (storedAccessToken) {
          setAccessToken(storedAccessToken)
          setRefreshToken(storedRefreshToken)
          setUserEmail(storedEmail)
          setUserName(storedName)
          setIsAuthenticated(true)
          console.log('[AuthContext.init] Auth loaded from localStorage')
        } else {
          console.log('[AuthContext.init] No token found in localStorage')
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = useCallback(
    (accessToken: string, refreshToken: string, email?: string, name?: string) => {
      console.log('[AuthContext.login]', { accessToken: accessToken?.slice(0, 30) + '...', email, name })
      setAccessToken(accessToken)
      setRefreshToken(refreshToken)
      setUserEmail(email || null)
      setUserName(name || null)
      setIsAuthenticated(true)

      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('refresh_token', refreshToken)
      if (email) localStorage.setItem('user_email', email)
      if (name) localStorage.setItem('user_name', name)
      console.log('[AuthContext.login] Token stored in localStorage')
    },
    []
  )

  const logout = useCallback(() => {
    setAccessToken(null)
    setRefreshToken(null)
    setUserEmail(null)
    setUserName(null)
    setIsAuthenticated(false)

    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_email')
    localStorage.removeItem('user_name')
  }, [])

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) return false

    try {
      const response = await fetch('http://localhost:8000/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      if (!response.ok) {
        logout()
        return false
      }

      const data = await response.json()
      setAccessToken(data.access_token)
      localStorage.setItem('access_token', data.access_token)

      return true
    } catch (error) {
      console.error('Failed to refresh token:', error)
      logout()
      return false
    }
  }, [refreshToken, logout])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        accessToken,
        refreshToken,
        userEmail,
        userName,
        login,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
