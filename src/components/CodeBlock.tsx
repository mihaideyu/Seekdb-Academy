import { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import styles from './CodeBlock.module.css'

export type ResultViewMode = 'raw' | 'table' | 'chart'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  /** 试试看提示，鼓励用户改代码再运行 */
  tryIt?: string
  /** 代码中可编辑的片段（需与 code 中出现的字符串完全一致），其它部分只读 */
  editableSnippet?: string
  /** 步骤说明（上一步完成了什么） */
  stepHint?: string
  /** 点击运行后展示的预期/模拟结果（原始文本），便于用户自我校验 */
  expectedOutput?: string
  /** 可选：结构化结果数据，用于表格与图表演示。若不传则尝试从 expectedOutput 解析 JSON 数组 */
  expectedData?: Record<string, unknown>[]
  /** 运行完成后回调（如用于概述页步骤完成标记） */
  onRun?: () => void
}

const DEFAULT_OUTPUT = 'Query OK (Demo 模拟结果)\n\n在实际 Playground 中会执行真实语句并返回结果。'

function tryParseResultData(raw: string): Record<string, unknown>[] | null {
  const trimmed = raw.trim()
  // 尝试提取 JSON 数组（可能被注释包裹）
  const jsonMatch = trimmed.match(/\[[\s\S]*\]/)
  if (jsonMatch) {
    try {
      const arr = JSON.parse(jsonMatch[0]) as unknown
      return Array.isArray(arr) ? (arr as Record<string, unknown>[]) : null
    } catch {
      return null
    }
  }
  return null
}

/** 取第一个可做数值的列用于图表 Y 轴 */
function getNumericColumnKeys(data: Record<string, unknown>[]): string[] {
  if (data.length === 0) return []
  const keys = Object.keys(data[0])
  return keys.filter((k) => {
    const v = data[0][k]
    return typeof v === 'number' || (typeof v === 'string' && /^-?\d+(\.\d+)?$/.test(v))
  })
}

/** 取第一个适合做标签的列（字符串或短数字） */
function getLabelKey(data: Record<string, unknown>[]): string | null {
  if (data.length === 0) return null
  const keys = Object.keys(data[0])
  const prefer = keys.find((k) => typeof data[0][k] === 'string')
  return prefer ?? keys[0] ?? null
}

export function CodeBlock({
  code,
  language = 'sql',
  filename,
  tryIt,
  editableSnippet,
  stepHint,
  expectedOutput,
  expectedData,
  onRun,
}: CodeBlockProps) {
  const [result, setResult] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [execTimeMs, setExecTimeMs] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<ResultViewMode>('raw')

  const hasEditable = editableSnippet != null && editableSnippet.length > 0 && code.includes(editableSnippet)
  const [editableValue, setEditableValue] = useState(hasEditable ? editableSnippet : '')
  const measureRef = useRef<HTMLSpanElement>(null)
  const [inlayWidthPx, setInlayWidthPx] = useState(120)
  useEffect(() => {
    if (hasEditable && editableSnippet != null) setEditableValue(editableSnippet)
  }, [editableSnippet, code, hasEditable])
  useLayoutEffect(() => {
    if (!hasEditable || !measureRef.current) return
    const w = measureRef.current.scrollWidth
    setInlayWidthPx(Math.max(w + 20, 80))
  }, [hasEditable, editableValue])
  const codeBefore = hasEditable ? code.slice(0, code.indexOf(editableSnippet)) : code
  const codeAfter = hasEditable ? code.slice(code.indexOf(editableSnippet) + editableSnippet.length) : ''
  const effectiveCode = hasEditable ? codeBefore + editableValue + codeAfter : code

  const resultData = useMemo(() => {
    if (expectedData && expectedData.length > 0) return expectedData
    if (result) return tryParseResultData(result)
    return null
  }, [result, expectedData])

  const handleRun = () => {
    setRunning(true)
    setResult(null)
    setExecTimeMs(null)
    const start = Date.now()
    setTimeout(() => {
      setResult(expectedOutput ?? DEFAULT_OUTPUT)
      setExecTimeMs(Math.max(1, Math.round(Date.now() - start)))
      setRunning(false)
      onRun?.()
    }, 500)
  }

  const { t } = useLanguage()
  const canTable = resultData != null && resultData.length > 0
  const canChart = canTable && getNumericColumnKeys(resultData).length > 0 && getLabelKey(resultData) != null

  return (
    <div className={styles.wrapper}>
      {/* 脚本卡片：仅包含提示、标题栏、代码与试试看 */}
      <div className={styles.scriptCard}>
        {stepHint && (
          <div className={styles.stepHint}>
            <span className={styles.stepHintIcon} aria-hidden>{t('codeBlock.hint')}</span>
            {stepHint}
          </div>
        )}
        <div className={styles.header}>
          {filename && <span className={styles.filename}>{filename}</span>}
          <button type="button" className={styles.runBtn} onClick={handleRun} disabled={running}>
            {running ? t('codeBlock.running') : '▶ ' + t('codeBlock.run')}
          </button>
        </div>
        <pre className={styles.pre}>
          <code className={`language-${language}`}>
            {codeBefore}
            {hasEditable ? (
              <span className={styles.editableInlayWrap}>
                <span ref={measureRef} className={styles.editableInlayMeasure} aria-hidden>
                  {editableValue || '\u200b'}
                </span>
                <input
                  type="text"
                  className={styles.editableInlay}
                  value={editableValue}
                  onChange={(e) => setEditableValue(e.target.value)}
                  spellCheck={false}
                  aria-label="可编辑代码片段"
                  style={{ width: inlayWidthPx }}
                />
              </span>
            ) : null}
            {codeAfter}
          </code>
        </pre>
        {tryIt && (
          <div className={styles.tryIt}>
            <span className={styles.tryItLabel}>{t('codeBlock.tryIt')}</span>
            {tryIt}
          </div>
        )}
      </div>

      {/* 执行结果独立卡片：展示在脚本卡片下方，支持 Raw / 表格 / 图表 */}
      <div className={styles.resultCard}>
        <div className={styles.resultHeader}>
          <span className={styles.resultTitle}>{t('codeBlock.result')}</span>
          <div className={styles.resultMeta}>
            {execTimeMs !== null && <span className={styles.resultTime}>✓ {execTimeMs}ms</span>}
            {result !== null && (
              <div className={styles.viewTabs}>
                <button
                  type="button"
                  className={`${styles.viewTab} ${viewMode === 'raw' ? styles.viewTabActive : ''}`}
                  onClick={() => setViewMode('raw')}
                >
                  {t('codeBlock.raw')}
                </button>
                {canTable && (
                  <button
                    type="button"
                    className={`${styles.viewTab} ${viewMode === 'table' ? styles.viewTabActive : ''}`}
                    onClick={() => setViewMode('table')}
                  >
                    {t('codeBlock.table')}
                  </button>
                )}
                {canChart && (
                  <button
                    type="button"
                    className={`${styles.viewTab} ${viewMode === 'chart' ? styles.viewTabActive : ''}`}
                    onClick={() => setViewMode('chart')}
                  >
                    {t('codeBlock.chart')}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <div className={styles.resultBody}>
          {result === null ? (
            <div className={styles.resultPlaceholder}>{t('codeBlock.runToSeeResult')}</div>
          ) : viewMode === 'raw' ? (
            <pre className={styles.resultPre}>{result}</pre>
          ) : viewMode === 'table' && resultData && resultData.length > 0 ? (
            <div className={styles.resultTableWrap}>
              <table className={styles.resultTable}>
                <thead>
                  <tr>
                    {Object.keys(resultData[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {resultData.map((row, i) => (
                    <tr key={i}>
                      {Object.keys(resultData[0]).map((key) => (
                        <td key={key}>
                          {row[key] != null ? String(row[key]) : '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : viewMode === 'chart' && resultData && resultData.length > 0 ? (
            <ChartView data={resultData} />
          ) : (
            <pre className={styles.resultPre}>{result}</pre>
          )}
        </div>
      </div>
    </div>
  )
}

function ChartView({ data }: { data: Record<string, unknown>[] }) {
  const labelKey = getLabelKey(data)
  const numKeys = getNumericColumnKeys(data)
  const valueKey = numKeys[0] ?? labelKey
  if (!labelKey || !valueKey) return null

  const maxVal = Math.max(
    ...data.map((row) => {
      const v = row[valueKey]
      const n = typeof v === 'number' ? v : Number(v)
      return Number.isFinite(n) ? n : 0
    })
  )
  const safeMax = maxVal > 0 ? maxVal : 1

  return (
    <div className={styles.chartWrap}>
      {data.map((row, i) => {
        const label = row[labelKey] != null ? String(row[labelKey]) : `#${i + 1}`
        const rawVal = row[valueKey]
        const num = typeof rawVal === 'number' ? rawVal : Number(rawVal)
        const value = Number.isFinite(num) ? num : 0
        const pct = (value / safeMax) * 100
        return (
          <div key={i} className={styles.chartBar}>
            <span className={styles.chartLabel} title={label}>
              {label}
            </span>
            <div className={styles.chartBarTrack}>
              <div className={styles.chartBarFill} style={{ width: `${pct}%` }} />
            </div>
            <span className={styles.chartValue}>{value}</span>
          </div>
        )
      })}
    </div>
  )
}
