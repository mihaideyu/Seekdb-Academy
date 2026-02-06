import { useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '@/context/ProgressContext'
import { useConfetti } from '@/context/ConfettiContext'
import { useLanguage } from '@/context/LanguageContext'
import { generateConfettiPieces } from '@/utils/confetti'
import { LessonNav } from '@/components/LessonNav'
import { getLesson, getLessonGlobalIndex } from '@/curriculum'
import { getPageText, semanticSearchTexts } from '@/i18n/pages'
import styles from './OverviewPage.module.css'

const meta = getLesson('semantic-search')

export function SemanticSearchPage() {
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const { completedIds, markComplete } = useProgress()
  const T = useCallback(
    (key: keyof typeof semanticSearchTexts.zh, params?: Record<string, string | number>) =>
      getPageText(semanticSearchTexts, lang, key, params),
    [lang]
  )
  const { playConfetti } = useConfetti()
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  const completed = completedIds.has('semantic-search')

  const handleNextWithCelebration = useCallback(() => {
    const rect = nextButtonRef.current?.getBoundingClientRect()
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : { x: typeof window !== 'undefined' ? window.innerWidth * 0.5 : 400, y: 400 }
    playConfetti(generateConfettiPieces(origin))
    const next = meta?.nextId ? getLesson(meta.nextId) : null
    if (next) {
      markComplete('semantic-search')
      navigate(next.path)
    }
  }, [markComplete, navigate, playConfetti])

  return (
    <div className={styles.overviewRoot}>
      <div className={styles.colIntro}>
        <div className={styles.colIntroScroll}>
          <span className={styles.lessonLabel}>{T('lessonLabel', { n: getLessonGlobalIndex('semantic-search') })}</span>
          <h1 className={styles.h1}>{T('h1')}</h1>
          <p>{T('intro')}</p>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: 8 }}>{T('note')}</p>
        </div>

        <div className={styles.colFooter}>
          <LessonNav
            prevId={meta?.prevId}
            nextId={meta?.nextId}
            onMarkComplete={() => markComplete('semantic-search')}
            completed={completed}
            onNextClick={completed ? handleNextWithCelebration : undefined}
            nextButtonRef={nextButtonRef}
          />
        </div>
      </div>

      <div className={styles.colContent}>
        <div className={styles.embedPlaceholder}>{T('placeholder')}</div>
      </div>
    </div>
  )
}
