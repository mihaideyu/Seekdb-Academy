import styles from './StepBadge.module.css'

export function StepBadge({ step, total, label }: { step: number; total: number; label?: string }) {
  return (
    <div className={styles.wrap}>
      <span className={styles.badge}>
        步骤 {step}/{total}
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  )
}
