import React, { createContext, useContext, useCallback, useState, useEffect } from 'react'
import { getProgress } from '@/curriculum'

type ProgressContextType = {
  completedIds: Set<string>
  markComplete: (id: string) => void
  progress: { current: number; total: number; percent: number }
}

const STORAGE_KEY = 'seekdb-tutorial-completed'

const ProgressContext = createContext<ProgressContextType | null>(null)

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const arr = JSON.parse(raw) as string[]
        return new Set(arr)
      }
    } catch (_) {}
    return new Set()
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedIds]))
    } catch (_) {}
  }, [completedIds])

  const markComplete = useCallback((id: string) => {
    setCompletedIds((prev) => new Set(prev).add(id))
  }, [])

  const progress = getProgress(completedIds)

  return (
    <ProgressContext.Provider value={{ completedIds, markComplete, progress }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
