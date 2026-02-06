import { Link } from 'react-router-dom'
import { getLesson, getLessonTitle } from '@/curriculum'
import { useLanguage } from '@/context/LanguageContext'
import styles from './LessonNav.module.css'

interface LessonNavProps {
  prevId?: string
  nextId?: string
  onMarkComplete?: () => void
  completed?: boolean
  /** 当提供时，点击「下一节」会调用此回调而非直接跳转（用于概述页祝贺动画等） */
  onNextClick?: () => void
  /** 用于获取「下一节」按钮位置（如概述页撒花起点） */
  nextButtonRef?: React.RefObject<HTMLButtonElement | null>
}

export function LessonNav({ prevId, nextId, onMarkComplete, completed, onNextClick, nextButtonRef }: LessonNavProps) {
  const { lang, t } = useLanguage()
  const prev = prevId ? getLesson(prevId) : null
  const next = nextId ? getLesson(nextId) : null
  const nextLabel = t('lessonNav.next') + ' >'

  return (
    <nav className={styles.wrapper} aria-label="课程导航">
      <div className={styles.left}>
        {prev ? (
          <Link to={prev.path} className={styles.link}>
            ← {t('lessonNav.prev')}: {getLessonTitle(prev, lang)}
          </Link>
        ) : null}
      </div>
      <div className={styles.right}>
        {next ? (
          completed ? (
            onNextClick ? (
              <button
                type="button"
                ref={nextButtonRef}
                className={styles.primaryLink}
                onClick={onNextClick}
              >
                {nextLabel}
              </button>
            ) : (
              <Link to={next.path} className={styles.primaryLink}>
                {nextLabel}
              </Link>
            )
          ) : (
            <span className={styles.nextDisabled} aria-disabled="true">
              {nextLabel}
            </span>
          )
        ) : (
          <span className={styles.noNext}>{t('lessonNav.lastLesson')}</span>
        )}
      </div>
    </nav>
  )
}
