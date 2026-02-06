import React, { createContext, useContext, useCallback, useState, useEffect } from 'react'

const STORAGE_KEY = 'seekdb-tutorial-sidebar-expanded'
const SIDEBAR_OPEN_KEY = 'seekdb-tutorial-sidebar-open'

/** 仅支持展开一个专题：当前展开的专题名，null 表示全部折叠；侧边栏整体显隐 */
type SidebarContextType = {
  expandedSection: string | null
  /** 点击专题：若当前已展开则折叠，否则展开该专题并折叠其他 */
  toggleSection: (section: string) => void
  isExpanded: (section: string) => boolean
  /** 确保某专题展开（当前页所在分组自动展开时调用，会折叠其他） */
  expandSection: (section: string) => void
  /** 侧边目录导航是否展开（顶导左侧 icon 控制） */
  sidebarOpen: boolean
  toggleSidebarOpen: () => void
}

const SidebarContext = createContext<SidebarContextType | null>(null)

/** 首次访问默认展开「入门概览」 */
const DEFAULT_EXPANDED = '入门概览'

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [expandedSection, setExpandedSection] = useState<string | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const s = JSON.parse(raw) as string | null
        return s
      }
      return DEFAULT_EXPANDED
    } catch (_) {}
    return DEFAULT_EXPANDED
  })

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(SIDEBAR_OPEN_KEY)
      if (raw !== null) return raw === 'true'
      return true
    } catch (_) {}
    return true
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expandedSection))
    } catch (_) {}
  }, [expandedSection])

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_OPEN_KEY, String(sidebarOpen))
    } catch (_) {}
  }, [sidebarOpen])

  const toggleSection = useCallback((section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section))
  }, [])

  const isExpanded = useCallback(
    (section: string) => expandedSection === section,
    [expandedSection]
  )

  const expandSection = useCallback((section: string) => {
    setExpandedSection(section)
  }, [])

  const toggleSidebarOpen = useCallback(() => {
    setSidebarOpen((prev) => !prev)
  }, [])

  return (
    <SidebarContext.Provider value={{ expandedSection, toggleSection, isExpanded, expandSection, sidebarOpen, toggleSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider')
  return ctx
}
