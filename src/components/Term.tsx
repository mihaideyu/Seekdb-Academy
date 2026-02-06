import { useState, useRef, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'

const TOOLTIP_Z_INDEX = 99999

/** 带 Tooltip 的术语，用于易学性改进；tooltip 通过 Portal 渲染到 body，避免被侧栏/代码列遮挡 */
export function Term({ children, tooltip }: { children: React.ReactNode; tooltip: string }) {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [placeAbove, setPlaceAbove] = useState(true)
  const spanRef = useRef<HTMLSpanElement>(null)

  const updatePosition = useCallback(() => {
    const el = spanRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const padding = 6
    const tooltipMaxWidth = 400
    const tooltipHeight = 60
    const preferAbove = rect.top > tooltipHeight + 20
    setPlaceAbove(preferAbove)
    let left = rect.left
    const maxLeft = typeof window !== 'undefined' ? window.innerWidth - tooltipMaxWidth - 16 : 0
    if (left > maxLeft) left = maxLeft
    if (left < 16) left = 16
    if (preferAbove) {
      setPosition({
        left,
        top: rect.top - padding,
      })
    } else {
      setPosition({
        left,
        top: rect.bottom + padding,
      })
    }
  }, [])

  const handleMouseEnter = useCallback(() => {
    updatePosition()
    setVisible(true)
  }, [updatePosition])

  const handleMouseLeave = useCallback(() => {
    setVisible(false)
  }, [])

  useEffect(() => {
    if (!visible || !spanRef.current) return
    const el = spanRef.current
    const onScrollOrResize = () => {
      updatePosition()
    }
    const scrollParents = new Set<Node>()
    let parent: Node | null = el.parentNode
    while (parent && parent !== document.body) {
      scrollParents.add(parent)
      parent = parent.parentNode
    }
    scrollParents.forEach((node) => {
      node.addEventListener('scroll', onScrollOrResize, true)
    })
    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)
    return () => {
      scrollParents.forEach((node) => {
        node.removeEventListener('scroll', onScrollOrResize, true)
      })
      window.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [visible, updatePosition])

  const tooltipEl = visible && (
    <div
      className="term-tooltip-portal"
      role="tooltip"
      style={{
        position: 'fixed',
        left: position.left,
        top: placeAbove ? position.top : position.top,
        transform: placeAbove ? 'translateY(-100%)' : 'none',
        padding: '8px 12px',
        minWidth: '180px',
        maxWidth: '400px',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        fontSize: '13px',
        lineHeight: 1.5,
        color: 'var(--text)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        zIndex: TOOLTIP_Z_INDEX,
        pointerEvents: 'none',
      }}
    >
      {tooltip}
    </div>
  )

  return (
    <>
      <span
        ref={spanRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          borderBottom: '1px dotted var(--text-muted)',
          cursor: 'help',
        }}
      >
        {children}
      </span>
      {typeof document !== 'undefined' && tooltipEl && createPortal(tooltipEl, document.body)}
    </>
  )
}
