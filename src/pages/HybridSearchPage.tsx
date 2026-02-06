import { useState, useCallback, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '@/context/ProgressContext'
import { useConfetti } from '@/context/ConfettiContext'
import { useLanguage } from '@/context/LanguageContext'
import { generateConfettiPieces } from '@/utils/confetti'
import { CodeBlock } from '@/components/CodeBlock'
import { QuizSet } from '@/components/Quiz'
import { LessonNav } from '@/components/LessonNav'
import { getLesson, getLessonGlobalIndex } from '@/curriculum'
import { getPageText, hybridSearchTexts } from '@/i18n/pages'
import styles from './OverviewPage.module.css'

const meta = getLesson('hybrid-search')

type TaskId = 'why' | 'create-table' | 'insert' | 'hybrid-query' | 'strategy' | 'best-practice' | 'quiz'

const TASK_IDS: TaskId[] = ['why', 'create-table', 'insert', 'hybrid-query', 'strategy', 'best-practice', 'quiz']
const taskStorageKey = (id: TaskId) => `hybrid-search-${id}`

export function HybridSearchPage() {
  const navigate = useNavigate()
  const { lang, t } = useLanguage()
  const { completedIds, markComplete } = useProgress()
  const { playConfetti } = useConfetti()
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  const [selectedTask, setSelectedTask] = useState<TaskId>('why')

  const T = useCallback(
    (key: keyof typeof hybridSearchTexts.zh, params?: Record<string, string | number>) =>
      getPageText(hybridSearchTexts, lang, key, params),
    [lang]
  )

  const TASKS = useMemo(
    () => [
      { id: 'why' as TaskId, title: T('taskWhy'), desc: T('taskWhyDesc') },
      { id: 'create-table' as TaskId, title: T('taskCreate'), desc: T('taskCreateDesc') },
      { id: 'insert' as TaskId, title: T('taskInsert'), desc: T('taskInsertDesc') },
      { id: 'hybrid-query' as TaskId, title: T('taskQuery'), desc: T('taskQueryDesc') },
      { id: 'strategy' as TaskId, title: T('taskStrategy'), desc: T('taskStrategyDesc') },
      { id: 'best-practice' as TaskId, title: T('taskBest'), desc: T('taskBestDesc') },
    ],
    [T]
  )
  const QUIZ_TASK = useMemo(
    () => ({ id: 'quiz' as TaskId, title: T('quizSection'), desc: T('quizDesc') }),
    [T]
  )
  const HYBRID_SEARCH_QUIZ = useMemo(
    () => [
      {
        question: T('quizQuestion'),
        options: [
          { value: 'A', label: T('quizA') },
          { value: 'B', label: T('quizB') },
          { value: 'C', label: T('quizC') },
          { value: 'D', label: T('quizD') },
        ],
        correct: 'B' as const,
        explanation: T('quizExplanation'),
      },
    ],
    [T]
  )

  const handleNextWithCelebration = useCallback(() => {
    const rect = nextButtonRef.current?.getBoundingClientRect()
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : { x: window.innerWidth * 0.5, y: window.innerHeight * 0.85 }
    playConfetti(generateConfettiPieces(origin))
    const next = meta?.nextId ? getLesson(meta.nextId) : null
    if (next) {
      markComplete('hybrid-search')
      navigate(next.path)
    }
  }, [markComplete, navigate, playConfetti])

  const isTaskDone = useCallback(
    (id: TaskId) => completedIds.has(taskStorageKey(id)),
    [completedIds]
  )
  const allTasksDone = TASK_IDS.every((id) => completedIds.has(taskStorageKey(id)))
  const completed = completedIds.has('hybrid-search')

  return (
    <div className={styles.overviewRoot}>
      <div className={styles.colIntro}>
        <div className={styles.colIntroScroll}>
          <span className={styles.lessonLabel}>{T('lessonLabel', { n: getLessonGlobalIndex('hybrid-search') })}</span>
          <h1 className={styles.h1}>{T('h1')}</h1>
          <p>
            {T('intro')}{' '}
            <a href={lang === 'zh' ? 'https://seekdb-playground.vercel.app/zh/hybrid-search' : 'https://seekdb-playground.vercel.app/en/hybrid-search'} target="_blank" rel="noopener noreferrer">{T('introLink')}</a>.
          </p>

          <h2 className={styles.sectionTitle}>{T('whyTitle')}</h2>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: 1.6 }}>
            <li>{T('whyVec')}</li>
            <li>{T('whyFull')}</li>
            <li>{T('whyHybrid')}</li>
          </ul>

          <h2 className={styles.sectionTitle}>{T('practiceTitle')}</h2>
          <p className={styles.sectionDesc}>{T('practiceDesc')}</p>

          <div className={styles.taskList}>
            {TASKS.map((task) => {
              const done = isTaskDone(task.id)
              return (
                <button
                  key={task.id}
                  type="button"
                  className={`${styles.taskCard} ${selectedTask === task.id ? styles.taskCardSelected : ''} ${done ? styles.taskCardDone : ''}`}
                  onClick={() => setSelectedTask(task.id)}
                >
                  <span className={styles.taskCardIcon}>
                    {done ? <span className={styles.taskCardCheck}>✓</span> : ''}
                  </span>
                  <div className={styles.taskCardBody}>
                    <div className={styles.taskCardTitle}>{task.title}</div>
                    <p className={styles.taskCardDesc}>{task.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>

          <h2 className={styles.sectionTitle}>{T('quizSection')}</h2>
          <div className={styles.taskList}>
            <button
              type="button"
              className={`${styles.taskCard} ${selectedTask === 'quiz' ? styles.taskCardSelected : ''} ${isTaskDone('quiz') ? styles.taskCardDone : ''}`}
              onClick={() => setSelectedTask('quiz')}
            >
              <span className={styles.taskCardIcon}>
                {isTaskDone('quiz') ? <span className={styles.taskCardCheck}>✓</span> : ''}
              </span>
              <div className={styles.taskCardBody}>
                <div className={styles.taskCardTitle}>{QUIZ_TASK.title}</div>
                <p className={styles.taskCardDesc}>{QUIZ_TASK.desc}</p>
              </div>
            </button>
          </div>
        </div>

        <div className={styles.colFooter}>
          <LessonNav
            prevId={meta?.prevId}
            nextId={meta?.nextId}
            onMarkComplete={() => markComplete('hybrid-search')}
            completed={completed || allTasksDone}
            onNextClick={completed || allTasksDone ? handleNextWithCelebration : undefined}
            nextButtonRef={nextButtonRef}
          />
        </div>
      </div>

      <div className={styles.colContent}>
        {selectedTask === 'why' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="README.md"
                language="markdown"
                code={`# 为什么需要混合搜索？

## 单独使用向量搜索的局限
- 可能忽略重要的精确关键词匹配
- 对专有名词、产品型号处理不佳
- 需要嵌入模型支持

## 单独使用全文搜索的局限
- 无法理解同义词和语义
- 依赖用户输入准确的关键词
- 难以处理自然语言查询

## 混合搜索的优势
结合两者：既能理解「手机卡顿」和「手机运行慢」相似（语义），又能精确匹配「iPhone 15」（关键词）。`}
                stepHint={T('taskWhy_stepHint')}
                expectedOutput={`# ${t('codeBlock.docOnlyOutput')}`}
                onRun={() => markComplete(taskStorageKey('why'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'create-table' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="create_hybrid_table.sql"
                code={`-- 创建产品表：同时包含全文索引和向量索引
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    embedding VECTOR(1536),
    FULLTEXT INDEX ft_idx (name, description)
);

-- 创建向量索引
CREATE INDEX vec_idx ON products
USING HNSW (embedding);`}
                stepHint={T('taskCreate_stepHint')}
                tryIt={T('taskCreate_tryIt')}
                expectedOutput={`Query OK, 0 rows affected
Query OK, 0 rows affected

# 表 products 与全文索引 ft_idx、向量索引 vec_idx 已创建。`}
                onRun={() => markComplete(taskStorageKey('create-table'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'insert' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="insert_products.sql"
                code={`INSERT INTO products (name, description, category, embedding)
VALUES
    ('iPhone 15 Pro Max',
     '苹果最新旗舰手机，搭载 A17 Pro 芯片',
     '手机',
     AI_EMBED('苹果最新旗舰手机，搭载 A17 Pro 芯片')),
    ('华为 Mate 60 Pro',
     '华为新一代商务旗舰，卫星通讯',
     '手机',
     AI_EMBED('华为新一代商务旗舰，卫星通讯')),
    ('MacBook Pro 16',
     '专业级笔记本电脑，M3 Max 芯片',
     '电脑',
     AI_EMBED('专业级笔记本电脑，M3 Max 芯片'));`}
                stepHint={T('taskInsert_stepHint')}
                tryIt={T('taskInsert_tryIt')}
                expectedOutput={`Query OK, 3 rows affected

# 已插入 3 条产品，embedding 由 AI_EMBED 生成。${t('codeBlock.insertTableHint')}`}
                expectedData={[
                  { id: 1, name: 'iPhone 15 Pro Max', description: '苹果最新旗舰手机，搭载 A17 Pro 芯片', category: '手机', embedding: '[0.01, -0.02, ... 1536 dims]' },
                  { id: 2, name: '华为 Mate 60 Pro', description: '华为新一代商务旗舰，卫星通讯', category: '手机', embedding: '[0.01, -0.02, ... 1536 dims]' },
                  { id: 3, name: 'MacBook Pro 16', description: '专业级笔记本电脑，M3 Max 芯片', category: '电脑', embedding: '[0.01, -0.02, ... 1536 dims]' },
                ]}
                onRun={() => markComplete(taskStorageKey('insert'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'hybrid-query' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="weighted_hybrid.sql"
                code={`-- 混合搜索：加权融合（向量 60% + 全文 40%）
WITH vector_results AS (
    SELECT id, name,
           COSINE_DISTANCE(embedding, AI_EMBED('高性能手机')) AS vec_score
    FROM products
),
text_results AS (
    SELECT id, name,
           MATCH(name, description) AGAINST('iPhone Pro' IN BOOLEAN MODE) AS text_score
    FROM products
)
SELECT
    v.id,
    v.name,
    (0.6 * (1 - v.vec_score) + 0.4 * COALESCE(t.text_score, 0)) AS hybrid_score
FROM vector_results v
LEFT JOIN text_results t ON v.id = t.id
ORDER BY hybrid_score DESC
LIMIT 10;`}
                stepHint={T('taskQuery_stepHint')}
                tryIt={T('taskQuery_tryIt')}
                expectedOutput={`# 返回 id、name、hybrid_score，按 hybrid_score 降序，兼顾「高性能手机」语义与「iPhone Pro」关键词。`}
                onRun={() => markComplete(taskStorageKey('hybrid-query'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'strategy' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="融合策略对比.md"
                language="markdown"
                code={`| 策略     | 优点           | 缺点         | 适用场景     |
| -------- | -------------- | ------------ | ------------ |
| 加权融合 | 简单直观，易调优 | 需手动调权重   | 已知偏好场景 |
| RRF 融合 | 无需调参，稳定 | 对得分差异不敏感 | 通用搜索场景 |
| Rerank   | 效果最佳       | 需额外模型，延迟高 | 高精度场景   |`}
                stepHint={T('taskStrategy_stepHint')}
                expectedOutput={`# ${t('codeBlock.docOnlyOutput')}`}
                onRun={() => markComplete(taskStorageKey('strategy'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'best-practice' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="最佳实践.md"
                language="markdown"
                code={`## 权重选择建议
- 短查询（1–3 词）：向量权重可提高到 70%
- 长查询（句子级）：可 50:50 平衡
- 含专有名词：全文权重可提高到 60%

## 性能优化
- 先用向量搜索召回候选集（如 Top 100）
- 再用全文搜索在候选集内精排
- 最终返回 Top K`}
                stepHint={T('taskBest_stepHint')}
                expectedOutput={`# ${t('codeBlock.docOnlyOutput')}`}
                onRun={() => markComplete(taskStorageKey('best-practice'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'quiz' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <QuizSet
                questions={HYBRID_SEARCH_QUIZ}
                title="章节测试"
                onComplete={() => markComplete(taskStorageKey('quiz'))}
              />
            </div>
          </div>
        )}

        {!selectedTask && (
          <div className={styles.embedPlaceholder}>{T('embedPlaceholder')}</div>
        )}
      </div>
    </div>
  )
}
