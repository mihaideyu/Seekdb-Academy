import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

const ONBOARDING_KEY = 'seekdb-tutorial-onboarding-seen'

const OnboardingContext = createContext<{
  showOnboarding: boolean
  dismissOnboarding: () => void
} | null>(null)

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    try {
      const seen = localStorage.getItem(ONBOARDING_KEY)
      setShowOnboarding(seen !== 'true')
    } catch (_) {
      setShowOnboarding(true)
    }
  }, [])

  const dismissOnboarding = useCallback(() => {
    setShowOnboarding(false)
    try {
      localStorage.setItem(ONBOARDING_KEY, 'true')
    } catch (_) {}
  }, [])

  return (
    <OnboardingContext.Provider value={{ showOnboarding, dismissOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider')
  return ctx
}
