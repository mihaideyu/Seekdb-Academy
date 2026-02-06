import { useLanguage } from '@/context/LanguageContext'
import styles from './EnvNotice.module.css'

interface EnvNoticeProps {
  /** 是否紧凑展示 */
  compact?: boolean
  /** 是否内联（无外框，用于与推荐学习路径等融合在同一卡片内） */
  inline?: boolean
}

export function EnvNotice({ compact, inline }: EnvNoticeProps) {
  const { t } = useLanguage()
  const rootClass = inline
    ? styles.inline
    : compact
      ? styles.wrapperCompact
      : styles.wrapper
  return (
    <div className={rootClass} role="note">
      <span className={styles.icon}>💻</span>
      <div>
        <strong className={styles.title}>{t('home.envNoticeTitle')}</strong>
        <p className={styles.text}>{t('home.envNoticeText')}</p>
      </div>
    </div>
  )
}
