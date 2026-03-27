'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface SettingsContextType {
  microThreshold: number
  setMicroThreshold: (value: number) => void
  isLoading: boolean
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [microThreshold, setMicroThresholdState] = useState<number>(2000)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize from localStorage
  useEffect(() => {
    const initializeSettings = () => {
      try {
        const stored = localStorage.getItem('microThreshold')
        if (stored) {
          setMicroThresholdState(parseInt(stored))
        }
      } catch (error) {
        console.error('Failed to initialize settings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeSettings()
  }, [])

  // Update threshold and persist to localStorage
  const setMicroThreshold = useCallback((value: number) => {
    setMicroThresholdState(value)
    try {
      localStorage.setItem('microThreshold', value.toString())
    } catch (error) {
      console.error('Failed to save threshold:', error)
    }
  }, [])

  return (
    <SettingsContext.Provider value={{ microThreshold, setMicroThreshold, isLoading }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
