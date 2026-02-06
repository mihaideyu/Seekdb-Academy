import styles from './EnvNotice.module.css'

interface EnvNoticeProps {
  /** 是否紧凑展示 */
  compact?: boolean
}

export function EnvNotice({ compact }: EnvNoticeProps) {
  return (
    <div className={compact ? styles.wrapperCompact : styles.wrapper} role="note">
      <span className={styles.icon}>💻</span>
      <div>
        <strong className={styles.title}>环境说明</strong>
        <p className={styles.text}>
          本课程在浏览器中即可学习，无需本地安装。代码块点击「运行」可查看<strong>模拟结果</strong>，用于自检；在真实环境会执行实际 SQL/SDK 并返回真实数据。
        </p>
      </div>
    </div>
  )
}
