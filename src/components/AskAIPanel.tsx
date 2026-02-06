import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import styles from './AskAIPanel.module.css'

/** 接入真实 API 时可将 SeekDB 官方文档全文或摘要作为 RAG/system 上下文 */
const DOCS_LINK = 'https://www.oceanbase.ai/docs/develop-overview'

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
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setLoading(true)
    try {
      // 模拟基于文档上下文的回答（实际可接入 LLM API，将 SEEKDB_DOCS_CONTEXT 作为 system/context）
      await new Promise((r) => setTimeout(r, 800))
      const docHint =
        lang === 'zh'
          ? '根据 SeekDB 文档：SeekDB 是 AI 原生数据库，基于 OceanBase，支持向量/语义/全文/混合搜索，支持 VECTOR 列与 AI_EMBED、HNSW 索引等。'
          : 'Per SeekDB docs: SeekDB is an AI-native DB on OceanBase, with vector/semantic/full-text/hybrid search, VECTOR columns, AI_EMBED, and HNSW index.'
      const reply =
        lang === 'zh'
          ? `${docHint}\n\n你问的是：「${text}」。\n\n更多细节可查阅 [官方文档](${DOCS_LINK})。生产环境可将完整文档作为 RAG 上下文接入大模型，获得更精准解答。`
          : `${docHint}\n\nYou asked: "${text}". See [SeekDB Docs](${DOCS_LINK}) for more. In production, feed the full docs as RAG context for accurate answers.`
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
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
        <div className={styles.footer}>
          <div className={styles.inputWrap}>
            <textarea
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder={placeholder}
              rows={2}
              aria-label={placeholder}
            />
            <button
              type="button"
              className={styles.sendBtn}
              onClick={handleSend}
              disabled={loading}
              aria-label={sendAriaLabel}
              title={sendAriaLabel}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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
