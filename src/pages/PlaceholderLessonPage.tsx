import { useLocation, Navigate } from 'react-router-dom'
import { getLessonByPath } from '@/curriculum'
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

const PLACEHOLDER_TOPICS = [
  '核心概念与原理',
  '实操步骤与示例代码',
  '最佳实践与常见问题',
]

export function PlaceholderLessonPage() {
  const { pathname } = useLocation()
  const lesson = getLessonByPath(pathname)

  if (!lesson) return <Navigate to="/" replace />

  return (
    <article className={styles.root}>
      <div className={styles.illustration}>
        <UnderDevelopmentIcon />
      </div>

      <h1 className={styles.placeholderTitle}>课程内容开发中</h1>
      <p className={styles.placeholderDesc}>
        这个课程模块正在紧张制作中，我们将尽快为您呈现高质量的交互式学习内容。
      </p>

      <div className={styles.topicsBox}>
        <h2 className={styles.topicsTitle}>即将涵盖的主题：</h2>
        <ul className={styles.topicsList}>
          {PLACEHOLDER_TOPICS.map((topic, i) => (
            <li key={i}>{topic}</li>
          ))}
        </ul>
      </div>

      <p className={styles.footerLink}>
        完整内容与交互式代码可参考{' '}
        <a href="https://seekdb-playground.vercel.app/zh/overview" target="_blank" rel="noopener noreferrer">
          官方 SeekDB 交互式课程
        </a>
        。
      </p>
    </article>
  )
}
