import { useState, useCallback, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '@/context/ProgressContext'
import { useConfetti } from '@/context/ConfettiContext'
import { useLanguage } from '@/context/LanguageContext'
import { generateConfettiPieces } from '@/utils/confetti'
import { CodeBlock } from '@/components/CodeBlock'
import { QuizSet } from '@/components/Quiz'
import { LessonNav } from '@/components/LessonNav'
import { Term } from '@/components/Term'
import { getLesson, getLessonGlobalIndex } from '@/curriculum'
import { getPageText, aiWorkflowTexts } from '@/i18n/pages'
import styles from './OverviewPage.module.css'
import goalStyles from '@/components/SectionGoal.module.css'

const meta = getLesson('ai-workflow')

type TaskId = 'step1' | 'step2' | 'step3' | 'step4' | 'extra' | 'quiz'

const TASK_IDS: TaskId[] = ['step1', 'step2', 'step3', 'step4', 'extra', 'quiz']
const taskStorageKey = (id: TaskId) => `ai-workflow-${id}`

export function AiWorkflowPage() {
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const { completedIds, markComplete } = useProgress()
  const { playConfetti } = useConfetti()
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  const [selectedTask, setSelectedTask] = useState<TaskId>('quiz')

  const T = useCallback(
    (key: keyof typeof aiWorkflowTexts.zh, params?: Record<string, string | number>) =>
      getPageText(aiWorkflowTexts, lang, key, params),
    [lang]
  )

  const TASKS: { id: TaskId; title: string; desc: string }[] = useMemo(
    () => [
      { id: 'step1', title: T('taskStep1Title'), desc: T('taskStep1Desc') },
      { id: 'step2', title: T('taskStep2Title'), desc: T('taskStep2Desc') },
      { id: 'step3', title: T('taskStep3Title'), desc: T('taskStep3Desc') },
      { id: 'step4', title: T('taskStep4Title'), desc: T('taskStep4Desc') },
      { id: 'extra', title: T('taskExtraTitle'), desc: T('taskExtraDesc') },
    ],
    [T]
  )
  const QUIZ_TASK = useMemo(
    () => ({ id: 'quiz' as TaskId, title: T('quizTaskTitle'), desc: T('quizDesc') }),
    [T]
  )
  const AI_WORKFLOW_QUIZ = useMemo(
    () => [
      {
        question: T('quizQuestion'),
        options: [
          { value: 'A', label: T('quizOptA') },
          { value: 'B', label: T('quizOptB') },
          { value: 'C', label: T('quizOptC') },
          { value: 'D', label: T('quizOptD') },
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
      : { x: typeof window !== 'undefined' ? window.innerWidth * 0.5 : 400, y: 400 }
    playConfetti(generateConfettiPieces(origin))
    const next = meta?.nextId ? getLesson(meta.nextId) : null
    if (next) {
      markComplete('ai-workflow')
      navigate(next.path)
    }
  }, [markComplete, navigate, playConfetti])

  const isTaskDone = useCallback(
    (id: TaskId) => completedIds.has(taskStorageKey(id)),
    [completedIds]
  )
  const allTasksDone = TASK_IDS.every((id) => completedIds.has(taskStorageKey(id)))
  const completed = completedIds.has('ai-workflow')

  return (
    <div className={styles.overviewRoot}>
      <div className={styles.colIntro}>
        <div className={styles.colIntroScroll}>
          <span className={styles.lessonLabel}>{T('lessonLabel', { n: getLessonGlobalIndex('ai-workflow') })}</span>
          <h1 className={styles.h1}>{T('h1')}</h1>
          <div className={`${goalStyles.wrapper} ${styles.introBlock}`} role="region">
          <p>
            {lang === 'zh' ? '本课以' : 'This lesson follows '}
            <Term tooltip={T('termRag')}>RAG</Term>
            {lang === 'zh' ? '（检索增强生成）为主线，带你用 SeekDB 串联数据准备、' : ' (Retrieval-Augmented Generation) with SeekDB: '}
            <Term tooltip={T('termVec')}>{lang === 'zh' ? '向量化' : 'vectorization'}</Term>
            {lang === 'zh' ? '、存储与索引、检索召回与 LLM 生成，走通从建表到生成回答的完整流程。' : ', storage & indexing, retrieval, and LLM generation from table creation to answer generation.'}
          </p>
            <h3 className={goalStyles.heading}>{T('typicalTitle')}</h3>
            <ul className={goalStyles.list}>
              <li>{T('scene1')}</li>
              <li>{T('scene2')}</li>
              <li>{T('scene3')}</li>
              <li>{T('scene4')}</li>
            </ul>
          </div>

          <h2 className={styles.sectionTitle}>{T('ragOverview')}</h2>
          <ul className={styles.ragFlow}>
            <li className={styles.ragFlowStep}>
              <span className={`${styles.ragFlowIcon} ${styles.ragFlowIconStep1}`}>1</span>
              <div className={styles.ragFlowBody}>
                <h3 className={styles.ragFlowTitle}><Term tooltip={T('termDataPrep')}>{T('step1Title')}</Term></h3>
                <p className={styles.ragFlowDesc}>{T('step1Desc')}</p>
                <p className={styles.ragFlowTip}>{T('step1Tip1')}</p>
                <p className={styles.ragFlowTip}>{T('step1Tip2')}</p>
              </div>
            </li>
            <li className={styles.ragFlowStep}>
              <span className={`${styles.ragFlowIcon} ${styles.ragFlowIconStep2}`}>2</span>
              <div className={styles.ragFlowBody}>
                <h3 className={styles.ragFlowTitle}><Term tooltip={T('termVectorization')}>{T('step2Title')}</Term></h3>
                <p className={styles.ragFlowDesc}>{T('step2Desc')}</p>
                <p className={styles.ragFlowTip}>{T('step2Tip')}</p>
              </div>
            </li>
            <li className={styles.ragFlowStep}>
              <span className={`${styles.ragFlowIcon} ${styles.ragFlowIconStep3}`}>3</span>
              <div className={styles.ragFlowBody}>
                <h3 className={styles.ragFlowTitle}><Term tooltip={T('termStorage')}>{T('step3Title')}</Term></h3>
                <p className={styles.ragFlowDesc}>{T('step3Desc')}</p>
              </div>
            </li>
            <li className={styles.ragFlowStep}>
              <span className={`${styles.ragFlowIcon} ${styles.ragFlowIconStep4}`}>4</span>
              <div className={styles.ragFlowBody}>
                <h3 className={styles.ragFlowTitle}><Term tooltip={T('termRetrieval')}>{T('step4Title')}</Term></h3>
                <p className={styles.ragFlowDesc}>{T('step4Desc')}</p>
                <p className={styles.ragFlowTip}>{T('step4Tip')}</p>
              </div>
            </li>
            <li className={styles.ragFlowStep}>
              <span className={`${styles.ragFlowIcon} ${styles.ragFlowIconStep5}`}>5</span>
              <div className={styles.ragFlowBody}>
                <h3 className={styles.ragFlowTitle}><Term tooltip={T('termLlm')}>{T('step5Title')}</Term></h3>
                <p className={styles.ragFlowDesc}>{T('step5Desc')}</p>
              </div>
            </li>
          </ul>

          <h2 className={styles.sectionTitle}>{T('practiceTitle2')}</h2>
          <p className={styles.sectionDesc}>
            {T('practiceDesc')}
          </p>

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
            onMarkComplete={() => markComplete('ai-workflow')}
            completed={completed || allTasksDone}
            onNextClick={completed || allTasksDone ? handleNextWithCelebration : undefined}
            nextButtonRef={nextButtonRef}
          />
        </div>
      </div>

      <div className={styles.colContent}>
        {selectedTask === 'step1' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="create_knowledge_base.sql"
                code={`-- 创建知识库表（向量维度 1536 与默认嵌入模型一致，换模型需改此处）
CREATE TABLE knowledge_base (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255),
  content TEXT,
  source VARCHAR(500),
  embedding VECTOR(1536),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- HNSW 向量索引，加速相似度搜索
CREATE INDEX idx_kb_embedding ON knowledge_base
USING HNSW (embedding) WITH (M = 16, ef_construction = 200);

-- 可选：全文索引，用于后续混合搜索
CREATE FULLTEXT INDEX idx_kb_content ON knowledge_base(title, content);`}
                stepHint={T('step1_hint')}
                tryIt={T('step1_tryIt')}
                editableSnippet="M = 16"
                expectedOutput={`Query OK, 0 rows affected
Query OK, 0 rows affected
Query OK, 0 rows affected

# 表 knowledge_base 与索引已创建，可进行 Step 2 插入。`}
                onRun={() => markComplete(taskStorageKey('step1'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'step2' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="insert_with_embedding.sql"
                code={`-- 插入文档时用 AI_EMBED 自动生成向量（无需单独查 temp_chunks）
INSERT INTO knowledge_base (title, content, embedding)
VALUES
  ('SeekDB 简介', 'SeekDB 是 AI 原生数据库，支持向量搜索和语义搜索。', AI_EMBED('SeekDB 是 AI 原生数据库，支持向量搜索和语义搜索。')),
  ('向量搜索', '向量搜索基于余弦相似度或 L2 距离，需先对文本做嵌入。', AI_EMBED('向量搜索基于余弦相似度或 L2 距离，需先对文本做嵌入。')),
  ('RAG 流程', 'RAG 即检索增强生成：先检索相关文档，再交给 LLM 生成答案。', AI_EMBED('RAG 即检索增强生成：先检索相关文档，再交给 LLM 生成答案。'));`}
                stepHint={T('step2_hint')}
                tryIt={T('step2_tryIt')}
                editableSnippet="'SeekDB 简介'"
                expectedOutput={`Query OK, 3 rows affected

# 已插入 3 条文档，embedding 由 AI_EMBED 自动生成。`}
                onRun={() => markComplete(taskStorageKey('step2'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'step3' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="retrieval.sql"
                code={`-- 先设置用户问题（后续 Step 4 生成回答时也会用到）
SET @query = '如何使用 SeekDB 进行向量搜索？';
SET @query_embedding = AI_EMBED(@query);

-- 按余弦距离排序，取最相关的 5 条
SELECT
  id,
  title,
  content,
  COSINE_DISTANCE(embedding, @query_embedding) AS relevance_score
FROM knowledge_base
ORDER BY relevance_score ASC
LIMIT 5;`}
                stepHint={T('step3_hint')}
                tryIt={T('step3_tryIt')}
                editableSnippet="'如何使用 SeekDB 进行向量搜索？'"
                expectedOutput={`+----+---------------+----------+
| id | title         | content  | relevance_score |
+----+---------------+----------+-----------------+
|  2 | 向量搜索      | 向量搜索... | 0.12           |
|  1 | SeekDB 简介   | SeekDB...  | 0.25           |
...
5 rows in set

# relevance_score 越小表示与问题越相关。`}
                onRun={() => markComplete(taskStorageKey('step3'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'step4' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="generate.sql"
                code={`-- 将 Step 3 中 Top 3 的 content 拼成上下文（需先执行 Step 3 设置 @query）
SET @context = (
  SELECT GROUP_CONCAT(content SEPARATOR '\\n\\n')
  FROM (
    SELECT content
    FROM knowledge_base
    ORDER BY COSINE_DISTANCE(embedding, AI_EMBED(@query)) ASC
    LIMIT 3
  ) AS top_docs
);

SELECT AI_GENERATE(
  CONCAT(
    '基于以下上下文回答问题：\\n\\n',
    '上下文：', @context, '\\n\\n',
    '问题：', @query, '\\n\\n',
    '请用简洁专业的语言回答。'
  )
) AS answer;`}
                stepHint={T('step4_hint')}
                tryIt={T('step4_tryIt')}
                editableSnippet="LIMIT 3"
                expectedOutput={`+------------------------------------------+
| answer                                   |
+------------------------------------------+
| 您可以使用 SeekDB 的 AI_EMBED 将问题...  |
+------------------------------------------+
1 row in set

# 回答应基于上下文，避免幻觉。`}
                onRun={() => markComplete(taskStorageKey('step4'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'extra' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="data_preparation.py"
                language="python"
                code={`# 概念示例：文档分块（实际可在本地跑，再批量 INSERT 到 SeekDB）
from pyseekdb import TextSplitter

splitter = TextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separator="\\n\\n"
)
documents = [
    "SeekDB 是 AI 原生数据库...",
    "它支持向量搜索和语义搜索...",
]
chunks = splitter.split(documents)
print(f"共生成 {len(chunks)} 个文本块")
# 后续可将 chunks 逐条 INSERT INTO knowledge_base (content, embedding) VALUES (%s, AI_EMBED(%s))`}
                stepHint={T('extra_hint')}
                tryIt={T('extra_tryIt')}
                editableSnippet="500"
                expectedOutput={`共生成 2 个文本块

# 实际使用时将各 chunk 插入 knowledge_base 并调用 AI_EMBED。`}
                onRun={() => markComplete(taskStorageKey('extra'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'quiz' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <QuizSet
                questions={AI_WORKFLOW_QUIZ}
                title="章节测试"
                onComplete={() => markComplete(taskStorageKey('quiz'))}
              />
            </div>
          </div>
        )}

        {!selectedTask && (
          <div className={styles.embedPlaceholder}>
            {T('embedPlaceholder')}
          </div>
        )}
      </div>
    </div>
  )
}
