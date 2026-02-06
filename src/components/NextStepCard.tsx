import { Link } from 'react-router-dom'
import { getLessonByPath } from '@/curriculum'
import styles from './NextStepCard.module.css'

export interface NextStepLink {
  to: string
  label: string
  description?: string
}

interface NextStepCardProps {
  /** 推荐下一步的链接（可多个） */
  links: NextStepLink[]
  title?: string
}

export function NextStepCard({ links, title = '下一课推荐' }: NextStepCardProps) {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.hint}>学完本课后，选一门继续：</p>
      <ul className={styles.list}>
        {links.map((link) => {
          const path = link.to.startsWith('/') ? link.to : `/${link.to}`
          const lesson = getLessonByPath(path)
          return (
            <li key={link.to}>
              <Link to={path} className={styles.card}>
                <span className={styles.cardLabel}>{link.label}</span>
                {(link.description ?? lesson?.title) && (
                  <span className={styles.cardDesc}>{link.description ?? lesson?.title}</span>
                )}
                <span className={styles.arrow}>继续学习 →</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
