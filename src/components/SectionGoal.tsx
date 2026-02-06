import styles from './SectionGoal.module.css'

interface SectionGoalProps {
  /** 本节结束后你将能... */
  goals: string[]
  /** 需先学（前置课程 ID 或标题） */
  prerequisites?: string[]
}

export function SectionGoal({ goals, prerequisites: _prerequisites }: SectionGoalProps) {
  return (
    <div className={styles.wrapper} role="status">
      <h3 className={styles.heading}>本课目标</h3>
      <ul className={styles.list}>
        {goals.map((g, i) => (
          <li key={i}>{g}</li>
        ))}
      </ul>
    </div>
  )
}
