import { Link } from 'react-router-dom'
import { useRef, useEffect } from 'react'
import { getLessonsBySection, getLesson, getSectionTitle, getLessonTitle, getFirstUnlearnedLessonId } from '@/curriculum'
import { useLanguage } from '@/context/LanguageContext'
import { useProgress } from '@/context/ProgressContext'
import { EnvNotice } from '@/components/EnvNotice'
import styles from './HomePage.module.css'

export function HomePage() {
  const { lang, t } = useLanguage()
  const { completedIds } = useProgress()
  const sections = getLessonsBySection()
  const firstUnlearnedId = getFirstUnlearnedLessonId(completedIds)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (firstUnlearnedId && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [firstUnlearnedId])

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.h1}>{t('home.h1')}</h1>
      <p className={styles.subtitle}>{t('home.subtitle')}</p>
      <div className={styles.introBlock}>
        <EnvNotice compact inline />
        <h3 className={styles.pathTitle}>{t('home.pathTitle')}</h3>
        <ol className={styles.pathList}>
          <li>
            {t('home.pathItem1Intro')}
            <Link to="/overview">{t('home.pathLesson1')}</Link>
            {' → '}{t('home.pathConnect')}{' → '}{t('home.pathCreateDb')}
          </li>
          <li>
            {t('home.pathItem2Intro')}
            {t('home.pathEmbed')}{' → '}
            <Link to="/vector-search">{t('home.pathVectorSearch')}</Link>
            {' → '}{t('home.pathSemantic')}{' → '}{t('home.pathHybrid')}
          </li>
          <li>
            {t('home.pathItem3Intro')}
            {t('home.pathLlm')}{' → '}{t('home.pathAiFunc')}{' → '}{t('home.pathTextGen')}
          </li>
        </ol>
      </div>
      <h3 className={styles.sectionTitle}>{t('home.sectionTitle')}</h3>
      <div className={styles.sectionList}>
        {sections.map(({ sectionId, lessons: sectionLessons }) => {
          const isFirstUnlearnedSection = firstUnlearnedId != null && sectionLessons.some((l) => l.id === firstUnlearnedId)
          return (
            <div
              key={sectionId}
              ref={isFirstUnlearnedSection ? sectionRef : undefined}
              className={styles.sectionBlock}
            >
              <h4 className={styles.sectionBlockTitle}>{getSectionTitle(sectionId, lang)}</h4>
              <ul className={styles.lessonList}>
                {sectionLessons.map((lesson) => {
                  const isPending = lesson.fullContent !== true
                  const isCompleted = lesson.fullContent === true && completedIds.has(lesson.id)
                  const cardContent = (
                    <>
                      <span className={styles.lessonTitle}>{getLessonTitle(lesson, lang)}</span>
                      {lesson.prerequisites && lesson.prerequisites.length > 0 && (
                        <span className={styles.prereq}>
                          {t('home.prereqLabel')}{lesson.prerequisites.map((id) => { const L = getLesson(id); return L ? getLessonTitle(L, lang) : id; }).join(lang === 'zh' ? '、' : ', ')}
                        </span>
                      )}
                      {isCompleted && <span className={styles.completedBadge}>{t('home.completed')}</span>}
                      {isPending && <span className={styles.pendingBadge}>{t('layout.pending')}</span>}
                      {!isPending && !isCompleted && <span className={styles.arrow}>{t('home.enterCourse')}</span>}
                    </>
                  )
                  return (
                    <li key={lesson.id}>
                      {isPending ? (
                        <div className={`${styles.lessonCard} ${styles.lessonCardDisabled}`} aria-disabled="true">
                          {cardContent}
                        </div>
                      ) : (
                        <Link to={lesson.path} className={styles.lessonCard}>
                          {cardContent}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
