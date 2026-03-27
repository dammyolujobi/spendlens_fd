'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Spinner } from '@/components/ui/spinner'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isLoading: authLoading } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get tokens from URL parameters (backend will set these)
        const accessToken = searchParams.get('access_token')
        const refreshToken = searchParams.get('refresh_token')
        const userEmail = searchParams.get('email')
        const userName = searchParams.get('name')

        // If no tokens in URL, check if backend redirected correctly
        if (!accessToken) {
          throw new Error('No access token received from authentication')
        }

        // Login with the received tokens
        login(accessToken, refreshToken || '', userEmail || undefined, userName || undefined)

        // Wait a moment for state to update, then redirect
        setTimeout(() => {
          router.push('/dashboard')
        }, 100)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Authentication failed'
        setError(errorMessage)
        setIsProcessing(false)
      }
    }

    if (!authLoading) {
      handleCallback()
    }
  }, [searchParams, login, router, authLoading])

  if (isProcessing && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner className="h-8 w-8 mx-auto" />
          <p className="text-gray-600 dark:text-gray-400">
            Completing your login...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              <div className="space-y-2">
                <p className="font-semibold">Authentication Error</p>
                <p className="text-sm">{error}</p>
                <button
                  onClick={() => router.push('/')}
                  className="text-sm underline hover:no-underline mt-4"
                >
                  Return to Login
                </button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return null
}
