import React, { createContext, useContext, useCallback, useState, useEffect, useLayoutEffect } from 'react'

const STORAGE_KEY = 'seekdb-tutorial-theme'

export type ThemeMode = 'light' | 'dark' | 'system'

export type ResolvedTheme = 'light' | 'dark'

type ThemeContextType = {
  theme: ThemeMode
  setTheme: (mode: ThemeMode) => void
  /** 实际生效的主题（system 时根据 prefers-color-scheme 解析） */
  resolvedTheme: ResolvedTheme
}

const ThemeContext = createContext<ThemeContextType | null>(null)

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  return mode === 'system' ? getSystemTheme() : mode
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
      return s === 'light' || s === 'dark' || s === 'system' ? s : 'system'
    } catch (_) {}
    return 'system'
  })

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme(theme))

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch (_) {}
  }, [theme])

  useLayoutEffect(() => {
    const next = resolveTheme(theme)
    setResolvedTheme(next)
    document.documentElement.setAttribute('data-theme', next)
  }, [theme])

  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handle = () => {
      const next = getSystemTheme()
      setResolvedTheme(next)
      document.documentElement.setAttribute('data-theme', next)
    }
    mq.addEventListener('change', handle)
    return () => mq.removeEventListener('change', handle)
  }, [theme])

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
