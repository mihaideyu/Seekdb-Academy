import { createContext, useContext, useState, useCallback, useEffect } from 'react'

export interface ConfettiPiece {
  id: number
  left: number
  top: number
  width: number
  height: number
  color: string
  round: boolean
  delay: number
  duration: number
  tx1: number
  ty1: number
  tx2: number
  ty2: number
  rotate: number
}

type ConfettiContextType = {
  pieces: ConfettiPiece[]
  playConfetti: (pieces: ConfettiPiece[]) => void
}

const ConfettiContext = createContext<ConfettiContextType | null>(null)

const CONFETTI_DURATION_MS = 4200

export function ConfettiProvider({ children }: { children: React.ReactNode }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  const playConfetti = useCallback((newPieces: ConfettiPiece[]) => {
    setPieces(newPieces)
  }, [])

  useEffect(() => {
    if (pieces.length === 0) return
    const t = setTimeout(() => setPieces([]), CONFETTI_DURATION_MS)
    return () => clearTimeout(t)
  }, [pieces.length])

  return (
    <ConfettiContext.Provider value={{ pieces, playConfetti }}>
      {children}
    </ConfettiContext.Provider>
  )
}

export function useConfetti() {
  const ctx = useContext(ConfettiContext)
  if (!ctx) throw new Error('useConfetti must be used within ConfettiProvider')
  return ctx
}
