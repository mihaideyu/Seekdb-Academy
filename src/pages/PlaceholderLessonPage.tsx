import { useLocation, Navigate } from 'react-router-dom'
import { getLessonByPath } from '@/curriculum'
import { useLanguage } from '@/context/LanguageContext'
import styles from './PlaceholderLessonPage.module.css'

/** 待开发占位插图：施工栏 + 灯 */
function UnderDevelopmentIcon() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {/* 施工栏主体：黄黑条纹 */}
      <rect x="20" y="44" width="80" height="32" rx="4" fill="url(#stripes)" />
      <defs>
        <pattern id="stripes" patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="4" fill="#EAB308" />
          <rect y="4" width="8" height="4" fill="#1f2937" />
        </pattern>
      </defs>
      {/* 左侧支架 */}
      <rect x="24" y="44" width="4" height="32" fill="#374151" />
      {/* 右侧支架 */}
      <rect x="92" y="44" width="4" height="32" fill="#374151" />
      {/* 顶部两盏灯 */}
      <circle cx="40" cy="38" r="8" fill="#F97316" opacity="0.95" />
      <circle cx="80" cy="38" r="8" fill="#F97316" opacity="0.95" />
      <circle cx="40" cy="38" r="4" fill="#FED7AA" />
      <circle cx="80" cy="38" r="4" fill="#FED7AA" />
      {/* 灯架 */}
      <rect x="36" y="30" width="8" height="8" fill="#4b5563" rx="1" />
      <rect x="76" y="30" width="8" height="8" fill="#4b5563" rx="1" />
    </svg>
  )
}

const PLACEHOLDER_TOPIC_KEYS = ['placeholder.topic1', 'placeholder.topic2', 'placeholder.topic3'] as const

export function PlaceholderLessonPage() {
  const { pathname } = useLocation()
  const { t, lang } = useLanguage()
  const lesson = getLessonByPath(pathname)

  if (!lesson) return <Navigate to="/home" replace />

  const courseUrl = lang === 'zh'
    ? 'https://seekdb-playground.vercel.app/zh/overview'
    : 'https://seekdb-playground.vercel.app/en/overview'

  return (
    <article className={styles.root}>
      <div className={styles.illustration}>
        <UnderDevelopmentIcon />
      </div>

      <h1 className={styles.placeholderTitle}>{t('placeholder.title')}</h1>
      <p className={styles.placeholderDesc}>{t('placeholder.desc')}</p>

      <div className={styles.topicsBox}>
        <h2 className={styles.topicsTitle}>{t('placeholder.topicsTitle')}</h2>
        <ul className={styles.topicsList}>
          {PLACEHOLDER_TOPIC_KEYS.map((key, i) => (
            <li key={i}>{t(key)}</li>
          ))}
        </ul>
      </div>

      <p className={styles.footerLink}>
        {t('placeholder.footerIntro')}{' '}
        <a href={courseUrl} target="_blank" rel="noopener noreferrer">
          {t('placeholder.footerLink')}
        </a>
        {t('placeholder.footerEnd')}
      </p>
    </article>
  )
}
