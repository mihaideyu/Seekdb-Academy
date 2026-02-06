import { Link } from 'react-router-dom'
import { useOnboarding } from '@/context/OnboardingContext'
import styles from './OnboardingBanner.module.css'

export function OnboardingBanner() {
  const { showOnboarding, dismissOnboarding } = useOnboarding()
  if (!showOnboarding) return null

  return (
    <div className={styles.banner} role="banner">
      <span>
        👋 第一次使用？从 <Link to="/overview">概述</Link> 开始，了解 SeekDB 的核心功能与两种开发方式。本教程在浏览器中即可学习，代码块点击「运行」可查看模拟结果。
      </span>
      <button type="button" className={styles.dismiss} onClick={dismissOnboarding} aria-label="关闭引导">
        ×
      </button>
    </div>
  )
}
