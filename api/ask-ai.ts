/**
 * Ask AI：基于 SeekDB 官网文档内容回答用户问题
 * 拉取文档页文本作为上下文，调用 DeepSeek 生成回答。需配置 DEEPSEEK_API_KEY。
 */
import type { VercelRequest, VercelResponse } from '@vercel/node'

const DOCS_URLS = {
  zh: [
    'https://www.oceanbase.ai/docs/zh-CN/changelog/',
    'https://www.oceanbase.ai/docs/zh-CN/develop-overview',
  ],
  en: [
    'https://www.oceanbase.ai/docs/en/changelog/',
    'https://www.oceanbase.ai/docs/en/develop-overview',
  ],
}

const MAX_DOC_CHARS = 12000
const FALLBACK_CONTEXT_ZH = `SeekDB 是 OceanBase 推出的 AI 原生混合搜索数据库，融合向量、文本、结构化与半结构化数据能力，支持 VECTOR 列、AI_EMBED、HNSW 索引、全文与混合搜索。产品动态与更新见官网：https://www.oceanbase.ai/docs/zh-CN/changelog/`
const FALLBACK_CONTEXT_EN = `SeekDB is an AI-native hybrid search database from OceanBase, with vector, full-text, and structured data support, VECTOR columns, AI_EMBED, HNSW index. Changelog: https://www.oceanbase.ai/docs/en/changelog/`

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function fetchDocText(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'SeekDB-Tutorial-AskAI/1.0' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return ''
    const html = await res.text()
    return stripHtml(html)
  } catch {
    return ''
  }
}

async function buildDocContext(lang: 'zh' | 'en'): Promise<string> {
  const urls = DOCS_URLS[lang]
  const parts: string[] = []
  let total = 0
  for (const url of urls) {
    if (total >= MAX_DOC_CHARS) break
    const text = await fetchDocText(url)
    if (text) {
      const slice = text.slice(0, MAX_DOC_CHARS - total)
      parts.push(`[来源: ${url}]\n${slice}`)
      total += slice.length
    }
  }
  if (parts.length > 0) return parts.join('\n\n')
  return lang === 'zh' ? FALLBACK_CONTEXT_ZH : FALLBACK_CONTEXT_EN
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.DEEPSEEK_API_KEY
  let body: { question?: string; lang?: string }
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' })
  }

  const lang = body.lang === 'en' ? 'en' : 'zh'
  if (!apiKey || typeof apiKey !== 'string') {
    return res.status(503).json({
      error:
        lang === 'zh'
          ? 'Ask AI 未配置：请在 Vercel 环境变量中设置 DEEPSEEK_API_KEY 后使用基于文档的问答。'
          : 'Ask AI not configured: set DEEPSEEK_API_KEY in Vercel environment variables.',
      needConfig: true,
    })
  }

  const question = typeof body.question === 'string' ? body.question.trim() : ''
  if (!question) return res.status(400).json({ error: 'Missing or empty question' })

  const docContext = await buildDocContext(lang)
  const systemContent =
    lang === 'zh'
      ? `你是基于 SeekDB 官方文档的 AI 助手。请仅根据以下文档内容回答用户问题；若文档未涉及，可简要说明并建议查阅官网。

回答格式要求：
- 具备清晰的信息层级：使用二级标题（##）、三级标题（###）区分大段；用编号列表（1. 2. 3.）或要点列表（- ）组织内容；关键术语用**加粗**。
- 段落之间空一行，便于阅读。
- 仅使用 [链接文字](url) 形式的 Markdown 链接，不要使用 *** 或其它无意义的装饰符号。
- 回答简洁专业，避免冗长堆砌。

## 文档内容\n\n${docContext}`
      : `You are an AI assistant based on SeekDB official docs. Answer the user's question using only the documentation below. If not covered, say so and suggest the official site.

Format requirements:
- Use clear hierarchy: ## and ### for sections, numbered (1. 2. 3.) or bullet (- ) lists; **bold** key terms only.
- One blank line between paragraphs.
- Use only [text](url) for links; do not use *** or other decorative symbols.
- Keep answers concise and professional.

## Documentation\n\n${docContext}`

  try {
    const completionRes = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemContent },
          { role: 'user', content: question },
        ],
        max_tokens: 1024,
        temperature: 0.3,
      }),
      signal: AbortSignal.timeout(25000),
    })

    if (!completionRes.ok) {
      const errBody = await completionRes.text()
      const code = completionRes.status
      return res.status(200).json({
        answer:
          lang === 'zh'
            ? `请求 DeepSeek 服务时出错（${code}）。请确认 DEEPSEEK_API_KEY 有效，或稍后重试。`
            : `Error calling DeepSeek (${code}). Please check DEEPSEEK_API_KEY or try again later.`,
        error: errBody.slice(0, 200),
      })
    }

    const data = (await completionRes.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      error?: { message?: string };
    }
    const content = data.choices?.[0]?.message?.content?.trim()
    if (content) {
      return res.status(200).json({ answer: content })
    }
    const errMsg = data.error?.message || 'Empty response'
    return res.status(200).json({
      answer:
        lang === 'zh'
          ? `AI 返回为空。可查阅 [SeekDB 官方文档](https://www.oceanbase.ai/docs/zh-CN/changelog/) 获取更多信息。`
          : `Empty AI response. See [SeekDB Docs](https://www.oceanbase.ai/docs/en/changelog/) for more.`,
      error: errMsg,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return res.status(200).json({
      answer:
        lang === 'zh'
          ? `网络或服务异常，请稍后重试。你也可直接查阅 [SeekDB 官方文档](https://www.oceanbase.ai/docs/zh-CN/changelog/)。`
          : `Network or service error. Try again later or see [SeekDB Docs](https://www.oceanbase.ai/docs/en/changelog/).`,
      error: message,
    })
  }
}
