import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import styles from './AskAIPanel.module.css'

/** SeekDB 官网文档（产品动态等） */
const DOCS_LINK = 'https://www.oceanbase.ai/docs/zh-CN/changelog/'
const ASK_AI_API = '/api/ask-ai'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AskAIPanelProps {
  open?: boolean
  onClose: () => void
  /** 嵌入模式：作为布局一列，不遮挡内容、无遮罩 */
  embedded?: boolean
}

export function AskAIPanel({ onClose, embedded }: AskAIPanelProps) {
  const { lang } = useLanguage()
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      role: 'assistant',
      content:
        lang === 'zh'
          ? '你好，我是基于 SeekDB 官方文档的 AI 助手。学习过程中有任何问题都可以问我，我会结合文档内容为你解答。'
          : 'Hi, I\'m an AI assistant trained on SeekDB docs. Ask me anything about your learning.',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [contentOverflows, setContentOverflows] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages])

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const check = () => setContentOverflows(el.scrollHeight > el.clientHeight)
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setLoading(true)
    const noBackendHint =
      lang === 'zh'
        ? `Ask AI 在本地开发时需要后端支持：请使用 \`vercel dev\` 并配置 DEEPSEEK_API_KEY，或部署到 Vercel 后再使用。你也可直接查阅 [SeekDB 官方文档](${DOCS_LINK})。`
        : `Ask AI needs a backend in local dev: run \`vercel dev\` and set DEEPSEEK_API_KEY, or use it after deploying to Vercel. You can also see [SeekDB Docs](${DOCS_LINK}).`

    try {
      const res = await fetch(ASK_AI_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text, lang }),
      })
      if (!res.ok && res.status === 404) {
        setMessages((prev) => [...prev, { role: 'assistant', content: noBackendHint }])
        return
      }
      let data: { answer?: string; error?: string; needConfig?: boolean }
      try {
        data = (await res.json()) as { answer?: string; error?: string; needConfig?: boolean }
      } catch {
        setMessages((prev) => [...prev, { role: 'assistant', content: noBackendHint }])
        return
      }
      const reply =
        data.answer ||
        (data.needConfig
          ? lang === 'zh'
            ? 'Ask AI 未配置或暂时不可用。请部署时在 Vercel 环境变量中设置 DEEPSEEK_API_KEY。你也可直接查阅 [SeekDB 官方文档](https://www.oceanbase.ai/docs/zh-CN/changelog/)。'
            : 'Ask AI is not configured. Set DEEPSEEK_API_KEY in Vercel environment variables when deploying. You can also see [SeekDB Docs](https://www.oceanbase.ai/docs/en/changelog/).'
          : data.error ||
            (lang === 'zh' ? '回答生成失败，请稍后重试。' : 'Failed to generate answer. Please try again later.'))
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: noBackendHint }])
    } finally {
      setLoading(false)
    }
  }

  const placeholder = lang === 'zh' ? '输入学习中的问题…' : 'Ask a question...'
  const sendAriaLabel = lang === 'zh' ? '发送' : 'Send'

  return (
    <>
      {!embedded && <div className={styles.backdrop} onClick={onClose} aria-hidden />}
      <aside className={`${styles.panel} ${embedded ? styles.panelEmbedded : ''}`} role="dialog" aria-label="Ask AI">
        <div className={styles.header}>
          <h3 className={styles.title}>{lang === 'zh' ? 'Ask AI' : 'Ask AI'}</h3>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label={lang === 'zh' ? '关闭' : 'Close'}>
            ×
          </button>
        </div>
        <div className={styles.list} ref={listRef}>
          {messages.map((m, i) => (
            <div key={i} className={m.role === 'user' ? styles.msgUser : styles.msgBot}>
              <div className={styles.bubble}>{m.role === 'assistant' ? formatMessage(m.content) : m.content}</div>
            </div>
          ))}
          {loading && (
            <div className={styles.msgBot}>
              <div className={styles.bubble}>{lang === 'zh' ? '正在思考…' : 'Thinking...'}</div>
            </div>
          )}
        </div>
        <div className={`${styles.footer} ${contentOverflows ? styles.footerShadow : ''}`}>
          <div className={styles.inputWrap}>
            <textarea
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              rows={2}
              aria-label={placeholder}
            />
            <button
              type="button"
              className={styles.sendBtn}
              onClick={handleSend}
              disabled={loading || !input.trim()}
              aria-label={sendAriaLabel}
              title={sendAriaLabel}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

function formatMessage(content: string) {
  const re = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g
  const nodes: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0
  while ((match = re.exec(content)) !== null) {
    nodes.push(content.slice(lastIndex, match.index))
    nodes.push(
      <a key={key++} href={match[2]} target="_blank" rel="noopener noreferrer" className={styles.docLink}>
        {match[1]}
      </a>
    )
    lastIndex = re.lastIndex
  }
  nodes.push(content.slice(lastIndex))
  return <>{nodes}</>
}
