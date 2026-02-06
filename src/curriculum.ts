/**
 * 课程大纲：与官方 SeekDB 教程结构一致
 * https://seekdb-playground.vercel.app/zh/overview
 */
export type Lang = 'zh' | 'en'

export interface LessonMeta {
  id: string
  path: string
  title: string
  /** 英文标题（用于切换语言） */
  titleEn?: string
  section: string
  /** 章节 id，用于多语言查 section 标题 */
  sectionId: string
  /** 章节顺序（用于侧边栏分组） */
  sectionOrder: number
  /** 同章节内顺序 */
  order: number
  prerequisites?: string[]
  nextId?: string
  prevId?: string
  /** 是否有完整优化内容（非占位） */
  fullContent?: boolean
  /** 预计学习时间（分钟），用于引导 */
  estimatedMinutes?: number
}

/** 章节列表（与官方菜单一致） */
export const sectionTitles: { order: number; id: string; title: string; titleEn: string }[] = [
  { order: 1, id: 'intro', title: '入门概览', titleEn: 'Getting Started' },
  { order: 2, id: 'connect', title: '连接 seekdb', titleEn: 'Connect SeekDB' },
  { order: 3, id: 'seekdb-js', title: 'seekdb-js', titleEn: 'seekdb-js' },
  { order: 4, id: 'schema', title: 'Schema 设计', titleEn: 'Schema Design' },
  { order: 5, id: 'readwrite', title: '数据读写', titleEn: 'Read & Write' },
  { order: 6, id: 'llm', title: 'LLM 集成', titleEn: 'LLM Integration' },
  { order: 7, id: 'embedding', title: '向量嵌入', titleEn: 'Vector Embedding' },
  { order: 8, id: 'search', title: '搜索功能', titleEn: 'Search' },
  { order: 9, id: 'ai-functions', title: 'AI 函数', titleEn: 'AI Functions' },
]

const S = (sectionOrder: number) => sectionOrder

export const lessons: LessonMeta[] = [
  // 1. 入门概览
  { id: 'overview', path: '/overview', title: '概述', titleEn: 'Overview', section: '入门概览', sectionId: 'intro', sectionOrder: S(1), order: 1, nextId: 'ai-workflow', fullContent: true, estimatedMinutes: 10 },
  { id: 'ai-workflow', path: '/ai-workflow', title: 'AI 工作流', titleEn: 'AI Workflow', section: '入门概览', sectionId: 'intro', sectionOrder: S(1), order: 2, prevId: 'overview', nextId: 'connect-overview', fullContent: true, estimatedMinutes: 15 },
  // 2. 连接 seekdb
  { id: 'connect-overview', path: '/connect-overview', title: '连接概览', titleEn: 'Overview', section: '连接 seekdb', sectionId: 'connect', sectionOrder: S(2), order: 1, prerequisites: ['overview'], prevId: 'ai-workflow', nextId: 'connect-client', fullContent: true, estimatedMinutes: 8 },
  { id: 'connect-client', path: '/connect-client', title: '客户端连接', titleEn: 'Client', section: '连接 seekdb', sectionId: 'connect', sectionOrder: S(2), order: 2, prevId: 'connect-overview', nextId: 'connect-driver', estimatedMinutes: 6 },
  { id: 'connect-driver', path: '/connect-driver', title: '驱动/ORM', titleEn: 'Driver/ORM', section: '连接 seekdb', sectionId: 'connect', sectionOrder: S(2), order: 3, prevId: 'connect-client', nextId: 'connection-pool', estimatedMinutes: 6 },
  { id: 'connection-pool', path: '/connection-pool', title: '使用连接池', titleEn: 'Connection Pool', section: '连接 seekdb', sectionId: 'connect', sectionOrder: S(2), order: 4, prevId: 'connect-driver', nextId: 'seekdb-js', estimatedMinutes: 5 },
  // 3. seekdb-js
  { id: 'seekdb-js', path: '/seekdb-js', title: 'seekdb-js SDK', titleEn: 'seekdb-js SDK', section: 'seekdb-js', sectionId: 'seekdb-js', sectionOrder: S(3), order: 1, prevId: 'connection-pool', nextId: 'electron-nextjs-template', fullContent: true, estimatedMinutes: 15 },
  { id: 'electron-nextjs-template', path: '/electron-nextjs-template', title: 'Electron 模板', titleEn: 'Electron Template', section: 'seekdb-js', sectionId: 'seekdb-js', sectionOrder: S(3), order: 2, prevId: 'seekdb-js', nextId: 'nextjs-seekdb-template', fullContent: true, estimatedMinutes: 12 },
  { id: 'nextjs-seekdb-template', path: '/nextjs-seekdb-template', title: 'Next.js 模板', titleEn: 'Next.js Template', section: 'seekdb-js', sectionId: 'seekdb-js', sectionOrder: S(3), order: 3, prevId: 'electron-nextjs-template', nextId: 'create-seekdb-app', fullContent: true, estimatedMinutes: 12 },
  { id: 'create-seekdb-app', path: '/create-seekdb-app', title: 'create-seekdb-app', titleEn: 'create-seekdb-app', section: 'seekdb-js', sectionId: 'seekdb-js', sectionOrder: S(3), order: 4, prevId: 'nextjs-seekdb-template', nextId: 'schema-overview', fullContent: true, estimatedMinutes: 10 },
  // 4. 数据库 Schema 设计
  { id: 'schema-overview', path: '/schema-overview', title: '概述', titleEn: 'Overview', section: '数据库 Schema 设计', sectionId: 'schema', sectionOrder: S(4), order: 1, prevId: 'create-seekdb-app', nextId: 'create-database', estimatedMinutes: 5 },
  { id: 'create-database', path: '/create-database', title: '创建数据库', titleEn: 'Create Database', section: '数据库 Schema 设计', sectionId: 'schema', sectionOrder: S(4), order: 2, prevId: 'schema-overview', nextId: 'create-table', fullContent: true, estimatedMinutes: 10 },
  { id: 'create-table', path: '/create-table', title: '创建表', titleEn: 'Create Table', section: '数据库 Schema 设计', sectionId: 'schema', sectionOrder: S(4), order: 3, prevId: 'create-database', nextId: 'multi-model-data', estimatedMinutes: 10 },
  { id: 'multi-model-data', path: '/multi-model-data', title: '多模态数据', titleEn: 'Multimodal Data', section: '数据库 Schema 设计', sectionId: 'schema', sectionOrder: S(4), order: 4, prevId: 'create-table', nextId: 'create-index', estimatedMinutes: 8 },
  { id: 'create-index', path: '/create-index', title: '创建索引', titleEn: 'Create Index', section: '数据库 Schema 设计', sectionId: 'schema', sectionOrder: S(4), order: 5, prevId: 'multi-model-data', nextId: 'vector-index', estimatedMinutes: 8 },
  { id: 'vector-index', path: '/vector-index', title: '向量索引选型', titleEn: 'Vector Index', section: '数据库 Schema 设计', sectionId: 'schema', sectionOrder: S(4), order: 6, prevId: 'create-index', nextId: 'write-data', estimatedMinutes: 6 },
  // 5. 数据读写
  { id: 'write-data', path: '/write-data', title: '写入数据', titleEn: 'Write Data', section: '数据读写', sectionId: 'readwrite', sectionOrder: S(5), order: 1, prevId: 'vector-index', nextId: 'read-data', estimatedMinutes: 10 },
  { id: 'read-data', path: '/read-data', title: '读取数据', titleEn: 'Read Data', section: '数据读写', sectionId: 'readwrite', sectionOrder: S(5), order: 2, prevId: 'write-data', nextId: 'llm-overview', estimatedMinutes: 8 },
  // 6. LLM 集成
  { id: 'llm-overview', path: '/llm-overview', title: 'LLM 概述', titleEn: 'LLM Overview', section: 'LLM 集成', sectionId: 'llm', sectionOrder: S(6), order: 1, prevId: 'read-data', nextId: 'ai-model-permissions', estimatedMinutes: 5 },
  { id: 'ai-model-permissions', path: '/ai-model-permissions', title: 'AI 模型权限', titleEn: 'AI Permissions', section: 'LLM 集成', sectionId: 'llm', sectionOrder: S(6), order: 2, prevId: 'llm-overview', nextId: 'register-ai-model', estimatedMinutes: 6 },
  { id: 'register-ai-model', path: '/register-ai-model', title: '注册 AI 模型', titleEn: 'Register AI Model', section: 'LLM 集成', sectionId: 'llm', sectionOrder: S(6), order: 3, prevId: 'ai-model-permissions', nextId: 'embedding-overview', estimatedMinutes: 8 },
  // 7. 向量嵌入
  { id: 'embedding-overview', path: '/embedding-overview', title: '向量嵌入概述', titleEn: 'Overview', section: '向量嵌入', sectionId: 'embedding', sectionOrder: S(7), order: 1, prevId: 'register-ai-model', nextId: 'ai-embed-function', fullContent: true, estimatedMinutes: 10 },
  { id: 'ai-embed-function', path: '/ai-embed-function', title: 'AI_EMBED 函数', titleEn: 'AI_EMBED', section: '向量嵌入', sectionId: 'embedding', sectionOrder: S(7), order: 2, prevId: 'embedding-overview', nextId: 'external-embedding', estimatedMinutes: 8 },
  { id: 'external-embedding', path: '/external-embedding', title: '外部嵌入模型', titleEn: 'External Models', section: '向量嵌入', sectionId: 'embedding', sectionOrder: S(7), order: 3, prevId: 'ai-embed-function', nextId: 'vector-search', estimatedMinutes: 6 },
  // 8. 搜索功能
  { id: 'vector-search', path: '/vector-search', title: '向量搜索', titleEn: 'Vector Search', section: '搜索功能', sectionId: 'search', sectionOrder: S(8), order: 1, prerequisites: ['embedding-overview'], prevId: 'external-embedding', nextId: 'semantic-search', fullContent: true, estimatedMinutes: 12 },
  { id: 'semantic-search', path: '/semantic-search', title: '语义搜索', titleEn: 'Semantic Search', section: '搜索功能', sectionId: 'search', sectionOrder: S(8), order: 2, prerequisites: ['vector-search'], prevId: 'vector-search', nextId: 'fulltext-search', fullContent: true, estimatedMinutes: 10 },
  { id: 'fulltext-search', path: '/fulltext-search', title: '全文搜索', titleEn: 'Full-Text Search', section: '搜索功能', sectionId: 'search', sectionOrder: S(8), order: 3, prevId: 'semantic-search', nextId: 'hybrid-search', estimatedMinutes: 8 },
  { id: 'hybrid-search', path: '/hybrid-search', title: '混合搜索', titleEn: 'Hybrid Search', section: '搜索功能', sectionId: 'search', sectionOrder: S(8), order: 4, prevId: 'fulltext-search', nextId: 'rerank-search', fullContent: true, estimatedMinutes: 12 },
  { id: 'rerank-search', path: '/rerank-search', title: 'Rerank 搜索', titleEn: 'Rerank Search', section: '搜索功能', sectionId: 'search', sectionOrder: S(8), order: 5, prevId: 'hybrid-search', nextId: 'ai-functions-overview', estimatedMinutes: 6 },
  // 9. AI 函数
  { id: 'ai-functions-overview', path: '/ai-functions-overview', title: 'AI 函数概述', titleEn: 'Overview', section: 'AI 函数', sectionId: 'ai-functions', sectionOrder: S(9), order: 1, prevId: 'rerank-search', nextId: 'ai-function-permissions', estimatedMinutes: 5 },
  { id: 'ai-function-permissions', path: '/ai-function-permissions', title: 'AI 函数权限', titleEn: 'Call Permissions', section: 'AI 函数', sectionId: 'ai-functions', sectionOrder: S(9), order: 2, prevId: 'ai-functions-overview', nextId: 'text-generation', estimatedMinutes: 6 },
  { id: 'text-generation', path: '/text-generation', title: '文本生成', titleEn: 'Text Generation', section: 'AI 函数', sectionId: 'ai-functions', sectionOrder: S(9), order: 3, prevId: 'ai-function-permissions', estimatedMinutes: 8 },
]

/** 按章节分组的课程（用于侧边栏） */
export function getLessonsBySection(): { sectionId: string; sectionOrder: number; lessons: LessonMeta[] }[] {
  const bySection = new Map<string, LessonMeta[]>()
  for (const lesson of lessons) {
    const key = lesson.sectionId
    if (!bySection.has(key)) bySection.set(key, [])
    bySection.get(key)!.push(lesson)
  }
  for (const arr of bySection.values()) {
    arr.sort((a, b) => a.order - b.order)
  }
  const sectionOrderMap = new Map<string, number>()
  lessons.forEach((l) => sectionOrderMap.set(l.sectionId, l.sectionOrder))
  return Array.from(bySection.entries())
    .map(([sectionId, lessonList]) => ({
      sectionId,
      sectionOrder: sectionOrderMap.get(sectionId) ?? 0,
      lessons: lessonList,
    }))
    .sort((a, b) => a.sectionOrder - b.sectionOrder)
}

export function getSectionTitle(sectionId: string, lang: Lang): string {
  const s = sectionTitles.find((x) => x.id === sectionId)
  if (!s) return sectionId
  return lang === 'en' ? s.titleEn : s.title
}

export function getLessonTitle(lesson: LessonMeta, lang: Lang): string {
  return lang === 'en' && lesson.titleEn ? lesson.titleEn : lesson.title
}

export function getLesson(id: string): LessonMeta | undefined {
  return lessons.find((l) => l.id === id)
}

export function getLessonByPath(path: string): LessonMeta | undefined {
  return lessons.find((l) => l.path === path)
}

/** 课程全局序号（1-based），用于展示「第 N 课」 */
export function getLessonGlobalIndex(id: string): number {
  const i = lessons.findIndex((l) => l.id === id)
  return i >= 0 ? i + 1 : 0
}

export function getProgress(completedIds: Set<string>): { current: number; total: number; percent: number } {
  const total = lessons.length
  const current = lessons.filter((l) => completedIds.has(l.id)).length
  return { current, total, percent: total ? Math.round((current / total) * 100) : 0 }
}
