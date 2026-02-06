import type { ConfettiPiece } from '@/context/ConfettiContext'

const CONFETTI_COLORS = [
  '#fff',
  '#60a5fa',
  '#38bdf8',
  '#4ade80',
  '#22d3ee',
  '#fb923c',
  '#facc15',
  '#f472b6',
  '#e879f9',
  '#a78bfa',
  '#fb7185',
  '#a3e635',
]

/** 从起点向上喷射烟花，顶点与落点参差有致，与概述页「下一节」动效一致 */
export function generateConfettiPieces(origin: { x: number; y: number }): ConfettiPiece[] {
  const H = typeof window !== 'undefined' ? window.innerHeight : 700
  const upCenter = H * 0.5 + Math.random() * H * 0.2
  const halfSpread = 92 + upCenter * 0.4
  const count = 195

  return Array.from({ length: count }, (_, i) => {
    let tx1 = (Math.random() - 0.5) * halfSpread * 2
    tx1 += (Math.random() - 0.5) * 36
    const t = Math.min(1, (tx1 / halfSpread) ** 2)
    const heightFactor = 1 - 0.42 * t
    const peakVariation = 0.68 + Math.random() * 0.52
    const ty1 = -upCenter * Math.max(0.4, heightFactor * peakVariation)
    const fall = 100 + Math.random() * 420
    const ty2 = ty1 + fall
    const outward = (Math.random() - 0.5) * 200 + (Math.random() - 0.5) * 72
    const tx2 = tx1 + outward
    const duration = 2 + Math.random() * 1.2
    return {
      id: i,
      left: origin.x,
      top: origin.y,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      width: 6 + Math.random() * 11,
      height: 4 + Math.random() * 10,
      round: Math.random() > 0.55,
      delay: Math.random() * 0.04,
      duration,
      tx1,
      ty1,
      tx2,
      ty2,
      rotate: (Math.random() - 0.5) * 1080,
    }
  })
}
