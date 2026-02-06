import { useEffect, useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useProgress } from '@/context/ProgressContext'
import { useSidebar } from '@/context/SidebarContext'
import { useLanguage } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'
import { useConfetti } from '@/context/ConfettiContext'
import { getLessonsBySection, getLessonByPath, getSectionTitle, getLessonTitle } from '@/curriculum'
import { AskAIPanel } from '@/components/AskAIPanel'
import { ConfettiOverlay } from '@/components/ConfettiOverlay'
import styles from './Layout.module.css'

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { progress, completedIds, setLastVisitedLessonId } = useProgress()
  const { pieces: confettiPieces } = useConfetti()
  const { isExpanded, toggleSection, expandSection, sidebarOpen, toggleSidebarOpen } = useSidebar()
  const { lang, setLang, t } = useLanguage()
  const { resolvedTheme, setTheme } = useTheme()
  const [askAIOpen, setAskAIOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const langDropdownRef = useRef<HTMLDivElement>(null)
  const current = getLessonByPath(location.pathname)
  const sections = getLessonsBySection()
  const isHomePage = location.pathname === '/home'

  // 当前页所在专题自动展开
  useEffect(() => {
    if (current?.sectionId) expandSection(current.sectionId)
  }, [current?.sectionId, expandSection])

  // 记录最近学习的课时（用于首页「最近学习」）
  useEffect(() => {
    if (current?.id) setLastVisitedLessonId(current.id)
  }, [current?.id, setLastVisitedLessonId])

  // 点击外部关闭语言下拉
  useEffect(() => {
    if (!langMenuOpen) return
    const handle = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false)
      }
    }
    document.addEventListener('click', handle)
    return () => document.removeEventListener('click', handle)
  }, [langMenuOpen])

  return (
    <div className={styles.app}>
      <header className={styles.topNav}>
        {!isHomePage && (
          <button
            type="button"
            className={styles.topNavMenu}
            onClick={toggleSidebarOpen}
            aria-label={sidebarOpen ? t('layout.menuClose') : t('layout.menu')}
            aria-expanded={sidebarOpen}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        )}
        <Link to="/home" className={styles.topNavLogo}>
          {t('app.title')}
        </Link>
        {current && (
          <>
            <span className={styles.topNavDivider} aria-hidden />
            <nav className={styles.topNavBreadcrumb} aria-label="Breadcrumb">
            <Link to="/home">{t('nav.home')}</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <span>{current && getSectionTitle(current.sectionId, lang)}</span>
            <span className={styles.breadcrumbSep}>/</span>
            <span>{current && getLessonTitle(current, lang)}</span>
          </nav>
          </>
        )}
        <div className={styles.topNavRight}>
          <button
            type="button"
            className={styles.topNavAskAi}
            onClick={() => setAskAIOpen(true)}
          >
            {t('nav.askAi')}
          </button>
          <span className={styles.topNavRightSep} aria-hidden />
          <button
            type="button"
            className={styles.themeToggle}
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            title={resolvedTheme === 'dark' ? t('theme.light') : t('theme.dark')}
            aria-label={t('theme.aria')}
          >
            <span className={styles.themeIcon} aria-hidden>
              {resolvedTheme === 'dark' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </span>
          </button>
          <div className={styles.langDropdown} ref={langDropdownRef}>
            <button
              type="button"
              className={styles.langTrigger}
              onClick={() => setLangMenuOpen((o) => !o)}
              aria-expanded={langMenuOpen}
              aria-haspopup="listbox"
              aria-label={lang === 'zh' ? '中文' : 'English'}
            >
              <span>{lang === 'zh' ? '中文' : 'EN'}</span>
              <span className={styles.langChevron} aria-hidden>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 4.5 L6 8 L9 4.5" />
                </svg>
              </span>
            </button>
            {langMenuOpen && (
              <div className={styles.langMenu} role="listbox" aria-label="选择语言">
                <button
                  type="button"
                  role="option"
                  aria-selected={lang === 'zh'}
                  className={lang === 'zh' ? styles.langItemActive : styles.langItem}
                  onClick={() => { setLang('zh'); setLangMenuOpen(false); }}
                >
                  中文
                </button>
                <button
                  type="button"
                  role="option"
                  aria-selected={lang === 'en'}
                  className={lang === 'en' ? styles.langItemActive : styles.langItem}
                  onClick={() => { setLang('en'); setLangMenuOpen(false); }}
                >
                  EN
                </button>
              </div>
            )}
          </div>
          <a href="https://www.oceanbase.ai/docs/zh-CN/changelog" target="_blank" rel="noopener noreferrer" className={styles.topNavDoc}>
            {t('nav.doc')}
          </a>
        </div>
      </header>
      <div className={`${styles.wrapper} ${!sidebarOpen ? styles.sidebarCollapsed : ''} ${isHomePage ? styles.wrapperHome : ''}`}>
        <aside className={styles.sidebar} aria-hidden={!sidebarOpen || isHomePage}>
          <div className={styles.sidebarNavScroll}>
            <nav className={styles.nav} aria-label="课程目录">
              {sections.map(({ sectionId, lessons: sectionLessons }) => {
                const sectionTitle = getSectionTitle(sectionId, lang)
                const expanded = isExpanded(sectionId)
                const developedInSection = sectionLessons.filter((l) => l.fullContent === true)
                const allCompleted = developedInSection.length > 0 && developedInSection.every((l) => completedIds.has(l.id))
                return (
                  <div key={sectionId} className={styles.section}>
                    <button
                      type="button"
                      className={`${styles.sectionHeader} ${expanded ? styles.sectionHeaderExpanded : ''}`}
                      onClick={() => toggleSection(sectionId)}
                      aria-expanded={expanded}
                      aria-controls={`section-${sectionId}`}
                    >
                      {allCompleted ? (
                        <span className={`${styles.navItemIcon} ${styles.navItemIconDone}`} aria-hidden title={t('layout.sectionDone')}>
                          <span className={styles.navItemCheck}>✓</span>
                        </span>
                      ) : (
                        <span className={styles.sectionHeaderIconPlaceholder} aria-hidden />
                      )}
                      <span className={styles.sectionTitleText}>{sectionTitle}</span>
                  <span className={styles.sectionChevron} aria-hidden>
                    {expanded ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 4.5 L6 8 L9 4.5" />
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4.5 3 L8 6 L4.5 9" />
                      </svg>
                    )}
                  </span>
                </button>
                <div
                  id={`section-${sectionId}`}
                  className={styles.sectionContent}
                  data-expanded={expanded}
                  role="region"
                  aria-label={sectionTitle}
                >
                  {sectionLessons.map((lesson) => {
                    const isActive = location.pathname === lesson.path
                    const done = lesson.fullContent === true && completedIds.has(lesson.id)
                    return (
                      <Link
                        key={lesson.id}
                        to={lesson.path}
                        className={`${styles.navItem} ${isActive ? styles.navItemActive : ''} ${done ? styles.navItemDone : ''}`}
                      >
                        <span className={`${styles.navItemIcon} ${done ? styles.navItemIconDone : ''}`} aria-hidden>
                          {done && <span className={styles.navItemCheck}>✓</span>}
                        </span>
                        <span className={styles.navTitle}>{getLessonTitle(lesson, lang)}</span>
                        {lesson.fullContent === true && lesson.estimatedMinutes != null && (
                          <span className={styles.navDuration} aria-label={t('layout.estimatedMinutes', { n: lesson.estimatedMinutes })}>
                            {t('layout.minutesShort', { n: lesson.estimatedMinutes })}
                          </span>
                        )}
                        {lesson.fullContent !== true && (
                          <span className={styles.navPendingText} title={t('layout.pending')}>
                            {t('layout.pending')}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
            </nav>
          </div>
          <div className={styles.progressWrap}>
            <div className={styles.progressLabel}>
              <span>{t('nav.learningProgress')}</span>
              <span className={styles.progressValue}>{progress.percent}%</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress.percent}%` }} />
            </div>
          </div>
        </aside>
        <main className={styles.main}>
          <div className={`${styles.content} ${['/overview', '/ai-workflow', '/connect-overview', '/seekdb-js', '/electron-nextjs-template', '/nextjs-seekdb-template', '/create-seekdb-app', '/create-database', '/embedding-overview', '/vector-search', '/semantic-search', '/hybrid-search'].includes(location.pathname) ? styles.contentOverview : ''}`}>
            {children}
          </div>
        </main>
        {askAIOpen && <AskAIPanel onClose={() => setAskAIOpen(false)} embedded />}
      </div>
      <ConfettiOverlay pieces={confettiPieces} />
    </div>
  )
}
