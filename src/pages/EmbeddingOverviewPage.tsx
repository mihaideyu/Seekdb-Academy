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
import { getPageText, embeddingOverviewTexts } from '@/i18n/pages'
import styles from './OverviewPage.module.css'

const meta = getLesson('embedding-overview')

type TaskId = 'intro' | 'concepts' | 'ai-embed' | 'models' | 'best-practice' | 'quiz'

const TASK_IDS: TaskId[] = ['intro', 'concepts', 'ai-embed', 'models', 'best-practice', 'quiz']
const taskStorageKey = (id: TaskId) => `embedding-overview-${id}`

export function EmbeddingOverviewPage() {
  const navigate = useNavigate()
  const { lang, t } = useLanguage()
  const { completedIds, markComplete } = useProgress()
  const { playConfetti } = useConfetti()
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  const [selectedTask, setSelectedTask] = useState<TaskId>('intro')

  const T = useCallback(
    (key: keyof typeof embeddingOverviewTexts.zh, params?: Record<string, string | number>) =>
      getPageText(embeddingOverviewTexts, lang, key, params),
    [lang]
  )

  const TASKS = useMemo(
    () => [
      { id: 'intro' as TaskId, title: T('taskIntro'), desc: T('taskIntroDesc') },
      { id: 'concepts' as TaskId, title: T('taskConcepts'), desc: T('taskConceptsDesc') },
      { id: 'ai-embed' as TaskId, title: T('taskAiEmbed'), desc: T('taskAiEmbedDesc') },
      { id: 'models' as TaskId, title: T('taskModels'), desc: T('taskModelsDesc') },
      { id: 'best-practice' as TaskId, title: T('taskBest'), desc: T('taskBestDesc') },
    ],
    [T]
  )
  const QUIZ_TASK = useMemo(
    () => ({ id: 'quiz' as TaskId, title: T('quizSection'), desc: T('quizDesc') }),
    [T]
  )
  const EMBEDDING_OVERVIEW_QUIZ = useMemo(
    () => [
      {
        question: T('quizQuestion'),
        options: [
          { value: 'A', label: T('quizA') },
          { value: 'B', label: T('quizB') },
          { value: 'C', label: T('quizC') },
          { value: 'D', label: T('quizD') },
        ],
        correct: 'C' as const,
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
      markComplete('embedding-overview')
      navigate(next.path)
    }
  }, [markComplete, navigate, playConfetti])

  const isTaskDone = useCallback(
    (id: TaskId) => completedIds.has(taskStorageKey(id)),
    [completedIds]
  )
  const allTasksDone = TASK_IDS.every((id) => completedIds.has(taskStorageKey(id)))
  const completed = completedIds.has('embedding-overview')

  return (
    <div className={styles.overviewRoot}>
      <div className={styles.colIntro}>
        <div className={styles.colIntroScroll}>
          <span className={styles.lessonLabel}>{T('lessonLabel', { n: getLessonGlobalIndex('embedding-overview') })}</span>
          <h1 className={styles.h1}>{T('h1')}</h1>
          <p>
            {T('intro')}{' '}
            <a href={lang === 'zh' ? 'https://seekdb-playground.vercel.app/zh/embedding-overview' : 'https://seekdb-playground.vercel.app/en/embedding-overview'} target="_blank" rel="noopener noreferrer">{T('introLink')}</a>.
          </p>

          <h2 className={styles.sectionTitle}>{T('conceptsTitle')}</h2>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: 1.7 }}>
            <li>{T('concept1')}</li>
            <li>{T('concept2')}</li>
            <li>{T('concept3')}</li>
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
                  <span className={styles.taskCardIcon}>{done ? <span className={styles.taskCardCheck}>✓</span> : ''}</span>
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
              <span className={styles.taskCardIcon}>{isTaskDone('quiz') ? <span className={styles.taskCardCheck}>✓</span> : ''}</span>
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
            onMarkComplete={() => markComplete('embedding-overview')}
            completed={completed || allTasksDone}
            onNextClick={completed || allTasksDone ? handleNextWithCelebration : undefined}
            nextButtonRef={nextButtonRef}
          />
        </div>
      </div>

      <div className={styles.colContent}>
        {selectedTask === 'intro' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="README.md"
                language="markdown"
                code={`# 向量嵌入概述

- 将**文本、图像**等非结构化数据 → **高维数值向量**
- 向量能**捕获语义**：语义相似的文本在向量空间中距离更近
- 例如："手机没电了" 与 "手机电量不足" 关键词不同，但向量相近
- 常见维度：384, 768, 1536, 3072（维度越高表达能力越强，成本也更高）`}
                stepHint={T('intro_stepHint')}
                expectedOutput={`# ${t('codeBlock.docOnlyOutput')}`}
                onRun={() => markComplete(taskStorageKey('intro'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'concepts' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="核心概念"
                language="markdown"
                code={`## 嵌入模型
- OpenAI: text-embedding-3-small/large
- Cohere: embed-multilingual-v3
- 通义千问: text-embedding-v3
- 本地: BGE-M3, M3E 等

## 向量维度
- 维度越高，表达能力越强；常见 384/768/1536/3072
- 维度影响存储与计算成本，需权衡精度与效率

## 为什么需要向量嵌入？
关键词匹配无法理解语义。向量嵌入能捕获语义相似性，使搜索更智能。`}
                stepHint={T('concepts_stepHint')}
                expectedOutput={`# ${t('codeBlock.docOnlyOutput')}`}
                onRun={() => markComplete(taskStorageKey('concepts'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'ai-embed' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="ai_embed.sql"
                language="sql"
                code={`-- 使用 AI_EMBED 生成嵌入向量
SELECT AI_EMBED('人工智能是计算机科学的一个分支') AS embedding;

-- 在 INSERT 中使用
INSERT INTO documents (content, embedding)
VALUES (
    '深度学习是机器学习的子领域',
    AI_EMBED('深度学习是机器学习的子领域')
);

-- 在查询中使用：按与问题的向量距离排序
SELECT * FROM documents
ORDER BY COSINE_DISTANCE(embedding, AI_EMBED('什么是深度学习'))
LIMIT 5;`}
                stepHint={T('aiEmbed_stepHint')}
                expectedOutput={`# SELECT 返回一列 embedding（向量）；INSERT 写入一行；查询返回与问题最相似的前 5 条`}
                onRun={() => markComplete(taskStorageKey('ai-embed'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'models' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="主流嵌入模型对比"
                language="markdown"
                code={`| 模型                     | 维度   | 特点           |
| ---------------------- | ------ | -------------- |
| text-embedding-3-small | 1536   | 性价比高，通用 |
| text-embedding-3-large | 3072   | 最高精度       |
| BGE-M3                 | 1024   | 开源，多语言   |
| M3E-base               | 768    | 中文优化，轻量 |`}
                stepHint={T('models_stepHint')}
                expectedOutput={`# ${t('codeBlock.docOnlyOutput')}`}
                onRun={() => markComplete(taskStorageKey('models'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'best-practice' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="batch_embed.sql"
                language="sql"
                code={`-- 最佳实践 1：选合适模型（语言、精度、成本）
-- 最佳实践 2：存储与查询用同一模型，否则向量不可比

-- 最佳实践 3：批量生成嵌入以提高效率
INSERT INTO documents (content, embedding)
SELECT content, AI_EMBED(content)
FROM source_data
WHERE embedding IS NULL
LIMIT 1000;   -- 分批处理，避免超时`}
                stepHint={T('bestPractice_stepHint')}
                expectedOutput={`# 批量 INSERT ... SELECT 可一次为多行生成 embedding`}
                onRun={() => markComplete(taskStorageKey('best-practice'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'quiz' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <QuizSet
                questions={EMBEDDING_OVERVIEW_QUIZ}
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
