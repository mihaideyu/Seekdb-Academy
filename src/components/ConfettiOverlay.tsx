import type { ConfettiPiece } from '@/context/ConfettiContext'
import styles from './ConfettiOverlay.module.css'

export function ConfettiOverlay({ pieces }: { pieces: ConfettiPiece[] }) {
  if (pieces.length === 0) return null
  return (
    <div className={styles.overlay} aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className={styles.piece}
          style={{
            left: p.left,
            top: p.top,
            width: p.width,
            height: p.height,
            backgroundColor: p.color,
            borderRadius: p.round ? '50%' : '1px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            ['--confetti-tx1' as string]: `${p.tx1}px`,
            ['--confetti-ty1' as string]: `${p.ty1}px`,
            ['--confetti-tx2' as string]: `${p.tx2}px`,
            ['--confetti-ty2' as string]: `${p.ty2}px`,
            ['--confetti-rotate' as string]: `${p.rotate}deg`,
          }}
        />
      ))}
    </div>
  )
}
