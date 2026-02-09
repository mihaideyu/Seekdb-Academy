import React, { createContext, useContext, useCallback, useState, useEffect } from 'react'
import { getProgress, getLesson } from '@/curriculum'

type ProgressContextType = {
  completedIds: Set<string>
  markComplete: (id: string) => void
  progress: { current: number; total: number; percent: number }
  lastVisitedLessonId: string | null
  setLastVisitedLessonId: (id: string) => void
}

const STORAGE_KEY = 'seekdb-tutorial-completed'
const LAST_LESSON_KEY = 'seekdb-tutorial-last-lesson'

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

  const [lastVisitedLessonId, setLastVisitedLessonIdState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LAST_LESSON_KEY)
    } catch (_) {}
    return null
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedIds]))
    } catch (_) {}
  }, [completedIds])

  const setLastVisitedLessonId = useCallback((id: string) => {
    setLastVisitedLessonIdState(id)
    try {
      localStorage.setItem(LAST_LESSON_KEY, id)
    } catch (_) {}
  }, [])

  useEffect(() => {
    if (lastVisitedLessonId != null) {
      try {
        localStorage.setItem(LAST_LESSON_KEY, lastVisitedLessonId)
      } catch (_) {}
    }
  }, [lastVisitedLessonId])

  /** 支持课程 id（如 overview）与任务 id（如 overview-dev-mode）。仅拒绝「已知课程且未开发」的 id */
  const markComplete = useCallback((id: string) => {
    const lesson = getLesson(id)
    if (lesson != null && lesson.fullContent !== true) return
    setCompletedIds((prev) => new Set(prev).add(id))
  }, [])

  const progress = getProgress(completedIds)

  return (
    <ProgressContext.Provider value={{ completedIds, markComplete, progress, lastVisitedLessonId, setLastVisitedLessonId }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
