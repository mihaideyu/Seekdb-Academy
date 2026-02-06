/**
 * Vercel Serverless: 执行教程中的 SQL，连接 SeekDB/MySQL 返回真实结果。
 * 需在 Vercel 环境变量中配置 DATABASE_URL（或 SEEKDB_DEMO_URL），格式：mysql://user:password@host:port/database
 */
import type { VercelRequest, VercelResponse } from '@vercel/node'

const MAX_PAYLOAD = 32 * 1024 // 32KB
const EXEC_TIMEOUT_MS = 15000

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const url = process.env.DATABASE_URL || process.env.SEEKDB_DEMO_URL
  if (!url || typeof url !== 'string') {
    return res.status(503).json({
      success: false,
      error: 'Execution not configured: set DATABASE_URL or SEEKDB_DEMO_URL in environment.',
    })
  }

  let body: { language?: string; code?: string }
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
  } catch {
    return res.status(400).json({ success: false, error: 'Invalid JSON body' })
  }

  const { language, code } = body
  if (language !== 'sql' || typeof code !== 'string') {
    return res.status(400).json({ success: false, error: 'Expected { language: "sql", code: string }' })
  }

  const trimmed = code.trim()
  if (!trimmed.length || trimmed.length > MAX_PAYLOAD) {
    return res.status(400).json({ success: false, error: 'Code empty or too long' })
  }

  try {
    const mysql = await import('mysql2/promise')
    const conn = await mysql.createConnection({
      uri: url,
      connectTimeout: 8000,
    })

    try {
      const statements = splitSqlStatements(trimmed)
      let lastRows: unknown[] = []
      let lastFields: { name: string }[] = []
      let affectedRows = 0

      for (const stmt of statements) {
        if (!stmt.length) continue
        const [rows, fields] = await Promise.race([
          conn.execute(stmt),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Query timeout')), EXEC_TIMEOUT_MS)
          ),
        ])
        const rowArray = Array.isArray(rows) ? rows : []
        if (rowArray.length > 0 || (rowArray.length === 0 && fields && (fields as unknown[]).length > 0)) {
          lastRows = rowArray as unknown[]
          lastFields = (fields as { name: string }[]) || []
        }
        const r = rows as { affectedRows?: number }
        if (typeof r?.affectedRows === 'number') affectedRows = r.affectedRows
      }

      const output = formatResult(lastRows, lastFields, affectedRows, statements.length)
      return res.status(200).json({
        success: true,
        output,
        rows: lastRows.length > 0 ? (lastRows as Record<string, unknown>[]) : undefined,
      })
    } finally {
      await conn.end()
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return res.status(200).json({
      success: false,
      error: message,
      output: `Error: ${message}`,
    })
  }
}

function splitSqlStatements(sql: string): string[] {
  const out: string[] = []
  let current = ''
  let inString: string | null = null
  let i = 0
  while (i < sql.length) {
    const c = sql[i]
    if (inString) {
      if (c === '\\' && i + 1 < sql.length) {
        current += c + sql[i + 1]
        i += 2
        continue
      }
      if (c === inString) {
        inString = null
        current += c
        i++
        continue
      }
      current += c
      i++
      continue
    }
    if (c === "'" || c === '"' || c === '`') {
      inString = c
      current += c
      i++
      continue
    }
    if (c === '-' && sql[i + 1] === '-') {
      const end = sql.indexOf('\n', i)
      i = end === -1 ? sql.length : end + 1
      continue
    }
    if (c === '/' && sql[i + 1] === '*') {
      const end = sql.indexOf('*/', i + 2)
      i = end === -1 ? sql.length : end + 2
      continue
    }
    if (c === ';') {
      const stmt = current.trim()
      if (stmt) out.push(stmt)
      current = ''
      i++
      continue
    }
    current += c
    i++
  }
  const stmt = current.trim()
  if (stmt) out.push(stmt)
  return out
}

function formatResult(
  rows: unknown[],
  fields: { name: string }[],
  affectedRows: number,
  statementCount: number
): string {
  if (rows.length === 0 && statementCount > 0) {
    return `Query OK, ${affectedRows} row(s) affected`
  }
  if (rows.length === 0) return '(empty result)'
  const headers = fields.length ? fields.map((f) => f.name) : Object.keys((rows[0] as Record<string, unknown>) || {})
  const colWidths = headers.map((h) => Math.max(String(h).length, 2))
  for (const row of rows as Record<string, unknown>[]) {
    headers.forEach((h, i) => {
      const val = row[h] != null ? String(row[h]) : 'NULL'
      colWidths[i] = Math.max(colWidths[i], Math.min(val.length, 40))
    })
  }
  const sep = colWidths.map((w) => '─'.repeat(w)).join('─┬─')
  const headerLine = headers.map((h, i) => String(h).padEnd(colWidths[i])).join(' │ ')
  const lines = [headerLine, '─'.repeat(headerLine.length)]
  for (const row of rows as Record<string, unknown>[]) {
    const line = headers
      .map((h, i) => {
        const v = row[h]
        const s = v != null ? String(v) : 'NULL'
        return s.slice(0, 40).padEnd(colWidths[i])
      })
      .join(' │ ')
    lines.push(line)
  }
  lines.push(`${rows.length} row(s) in set`)
  return lines.join('\n')
}
