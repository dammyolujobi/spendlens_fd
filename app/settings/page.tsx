'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useSettings } from '@/context/SettingsContext'
import { useToast } from '@/components/ui/use-toast'
import { ProtectedRoute } from '@/components/ProtectedRoute'

function SettingsPageContent() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const { microThreshold, setMicroThreshold } = useSettings()
  const [mounted, setMounted] = useState(false)
  const [microThresholdInput, setMicroThresholdInput] = useState<number | string>(microThreshold)
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    setMounted(true)
    setMicroThresholdInput(microThreshold)
  }, [microThreshold])

  const handleMicroThresholdChange = (value: string) => {
    // Allow empty input or numeric input only
    if (value === '' || /^\d+$/.test(value)) {
      setMicroThresholdInput(value === '' ? '' : parseInt(value))
    }
  }

  const handleMicroThresholdBlur = () => {
    const numValue = typeof microThresholdInput === 'string' ? parseInt(microThresholdInput) : microThresholdInput
    if (numValue > 0) {
      setMicroThresholdInput(numValue)
      setMicroThreshold(numValue)
      setShowConfirmation(true)
      toast({
        title: 'Amount set',
        description: `Threshold updated to ₦${numValue.toLocaleString()}`,
      })
      setTimeout(() => setShowConfirmation(false), 2000)
    } else if (microThresholdInput === '') {
      setMicroThresholdInput(2000)
      setMicroThreshold(2000)
    }
  }

  const themes = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ]

  return (
    <div className="page active">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-sub">Customize your experience</p>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="settings-section">
        <div className="settings-head">
          <div>
            <div className="settings-title">Appearance</div>
            <div className="settings-desc">Choose your preferred color scheme</div>
          </div>
        </div>
        <div className="settings-body">
          {mounted ? (
            <div className="theme-grid">
              {themes.map((t, idx) => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={`theme-opt ${theme === t.value ? 'active' : ''}`}
                >
                  {t.value === 'light' ? (
                    <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                  ) : t.value === 'dark' ? (
                    <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  ) : (
                    <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="2" y1="20" x2="22" y2="20" />
                    </svg>
                  )}
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div style={{ height: '80px', background: 'var(--surface2)', borderRadius: '8px' }} />
          )}
        </div>
      </div>

      {/* Threshold Section */}
      <div className="settings-section">
        <div className="settings-head">
          <div>
            <div className="settings-title">Micro Transaction Threshold</div>
            <div className="settings-desc">Define what counts as a small transaction</div>
          </div>
        </div>
        <div className="settings-body">
          {mounted ? (
            <div>
              <label className="field-label">Amount (₦)</label>
              <input
                type="text"
                inputMode="numeric"
                value={microThresholdInput}
                onChange={(e) => handleMicroThresholdChange(e.target.value)}
                onBlur={handleMicroThresholdBlur}
                className="field-input"
                placeholder="2000"
              />
              <div className="field-hint">
                Amounts below this threshold will be marked as micro transactions
              </div>
              {showConfirmation && (
                <div style={{ marginTop: '8px', color: 'var(--green)', fontSize: '12px' }}>
                  ✓ Threshold updated
                </div>
              )}
            </div>
          ) : (
            <div style={{ height: '80px', background: 'var(--surface2)', borderRadius: '8px' }} />
          )}
        </div>
      </div>

      {/* About Section */}
      <div className="settings-section">
        <div className="settings-head">
          <div>
            <div className="settings-title">About SpendLens</div>
            <div className="settings-desc">Learn more about this app</div>
          </div>
        </div>
        <div className="settings-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '12px', borderRadius: '8px', background: 'var(--surface2)', border: '1px solid var(--border-soft)' }}>
              <div style={{ fontSize: '10px', fontFamily: "'DM Mono', monospace", color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Version</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--paper)' }}>1.0.0</div>
            </div>
            <div style={{ padding: '12px', borderRadius: '8px', background: 'var(--surface2)', border: '1px solid var(--border-soft)' }}>
              <div style={{ fontSize: '10px', fontFamily: "'DM Mono', monospace", color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Status</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--green)' }}>Active</div>
            </div>
          </div>
          <div style={{ padding: '12px', borderRadius: '8px', background: 'var(--surface2)', border: '1px solid var(--border-soft)', color: 'var(--muted)', lineHeight: '1.6', fontSize: '13px' }}>
            <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>SpendLens</span> analyzes your email transactions to detect vendors, categorize spending, and alert you to silent drains.
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsPageContent />
    </ProtectedRoute>
  )
}
