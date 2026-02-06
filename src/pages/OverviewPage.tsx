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
import { getPageText, overviewTexts } from '@/i18n/pages'
import styles from './OverviewPage.module.css'

const meta = getLesson('overview')

type TaskId = 'dev-mode' | 'sql-mode' | 'step1' | 'step2' | 'step3' | 'step4' | 'quiz'

const OVERVIEW_TASK_IDS: TaskId[] = ['step1', 'step2', 'step3', 'step4', 'quiz']
const taskStorageKey = (id: TaskId) => `overview-${id}`

export function OverviewPage() {
  const navigate = useNavigate()
  const { lang, t } = useLanguage()
  const { completedIds, markComplete } = useProgress()
  const { playConfetti } = useConfetti()
  const [selectedTask, setSelectedTask] = useState<TaskId>('quiz')
  const nextButtonRef = useRef<HTMLButtonElement>(null)

  const T = useCallback(
    (key: keyof typeof overviewTexts.zh, params?: Record<string, string | number>) =>
      getPageText(overviewTexts, lang, key, params),
    [lang]
  )

  const TASKS: { id: TaskId; title: string; tag: 'Python' | 'SQL'; desc: string }[] = useMemo(
    () => [
      { id: 'step1', title: T('step1Title'), tag: 'SQL' as const, desc: T('step1Desc') },
      { id: 'step2', title: T('step2Title'), tag: 'SQL' as const, desc: T('step2Desc') },
      { id: 'step3', title: T('step3Title'), tag: 'SQL' as const, desc: T('step3Desc') },
      { id: 'step4', title: T('step4Title'), tag: 'SQL' as const, desc: T('step4Desc') },
    ],
    [T]
  )
  const QUIZ_TASK = useMemo(
    () => ({ id: 'quiz' as TaskId, title: T('quizSection'), desc: T('quizDesc') }),
    [T]
  )
  const OVERVIEW_QUIZ = useMemo(
    () => [
      {
        question: T('quizQuestion'),
        options: [
          { value: 'A', label: T('quizOptA') },
          { value: 'B', label: T('quizOptB') },
          { value: 'C', label: T('quizOptC') },
          { value: 'D', label: T('quizOptD') },
        ],
        correct: 'C' as const,
        explanation: T('quizExplanation'),
      },
    ],
    [T]
  )

  const isTaskDone = useCallback(
    (id: TaskId) => completedIds.has(taskStorageKey(id)),
    [completedIds]
  )
  const allTasksDone = OVERVIEW_TASK_IDS.every((id) => completedIds.has(taskStorageKey(id)))

  const handleNextWithCelebration = useCallback(() => {
    const rect = nextButtonRef.current?.getBoundingClientRect()
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : { x: window.innerWidth * 0.5, y: window.innerHeight * 0.85 }
    playConfetti(generateConfettiPieces(origin))
    const next = meta?.nextId ? getLesson(meta.nextId) : null
    if (next) {
      markComplete('overview')
      navigate(next.path)
    }
  }, [markComplete, navigate, playConfetti])

  return (
    <div className={styles.overviewRoot}>
      {/* 第二列：章节介绍、目标、选择开发方式、任务列表（可滚动）+ 下一步固定底部 */}
      <div className={styles.colIntro}>
        <div className={styles.colIntroScroll}>
          <span className={styles.lessonLabel}>{T('lessonLabel', { n: getLessonGlobalIndex('overview') })}</span>
          <h1 className={styles.h1}>{T('h1')}</h1>
          <p>{T('intro')}</p>

          <h2 className={styles.sectionTitle}>{T('chooseDev')}</h2>
          <div className={styles.taskList}>
            <button
              type="button"
              className={`${styles.taskCard} ${selectedTask === 'dev-mode' ? styles.taskCardSelected : ''} ${isTaskDone('dev-mode') ? styles.taskCardDone : ''}`}
              onClick={() => setSelectedTask('dev-mode')}
            >
              <span className={styles.taskCardIcon}>
                {isTaskDone('dev-mode') ? <span className={styles.taskCardCheck}>✓</span> : ''}
              </span>
              <div className={styles.taskCardBody}>
                <div className={styles.taskCardTitle}>{T('devPython')}</div>
                <p className={styles.taskCardDesc}>{T('devPythonDesc')}</p>
              </div>
            </button>
            <button
              type="button"
              className={`${styles.taskCard} ${selectedTask === 'sql-mode' ? styles.taskCardSelected : ''} ${isTaskDone('sql-mode') ? styles.taskCardDone : ''}`}
              onClick={() => setSelectedTask('sql-mode')}
            >
              <span className={styles.taskCardIcon}>
                {isTaskDone('sql-mode') ? <span className={styles.taskCardCheck}>✓</span> : ''}
              </span>
              <div className={styles.taskCardBody}>
                <div className={styles.taskCardTitle}>{T('devSql')}</div>
                <p className={styles.taskCardDesc}>{T('devSqlDesc')}</p>
              </div>
            </button>
          </div>

          <h2 className={styles.sectionTitle}>{T('startTitle')}</h2>
          <p className={styles.sectionDesc}>{T('startDesc')}</p>

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
            onMarkComplete={() => markComplete('overview')}
            completed={allTasksDone}
            onNextClick={allTasksDone ? handleNextWithCelebration : undefined}
            nextButtonRef={nextButtonRef}
          />
        </div>
      </div>

      {/* 第三列：当前任务对应的内嵌卡片（代码或测试题） */}
      <div className={styles.colContent}>
        {selectedTask === 'dev-mode' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="quick_start.py"
                language="python"
                code={`# 本 Playground 中可直接运行；本地环境请先 pip install pyseekdb
# 连接时：嵌入式实例可用空密码，远程实例请填写实际密码
from pyseekdb import Client
client = Client(
    host="localhost",
    port=2881,
    user="root",
    password=''   # 本 Demo 环境可留空；远程实例请填实际密码
)
# 执行向量搜索（embedding 需事先通过嵌入模型得到）
results = client.vector_search(
    table="documents",
    vector=embedding,
    limit=10
)`}
                stepHint={T('devMode_stepHint')}
                tryIt={T('devMode_tryIt')}
                editableSnippet="limit=10"
                onRun={() => markComplete(taskStorageKey('dev-mode'))}
                expectedOutput={`# 模拟输出（真实环境会返回相似文档列表）
[
  {"id": 1, "title": "AI 入门", "score": 0.92},
  {"id": 2, "title": "机器学习简介", "score": 0.88},
  ...
]
# 共 10 条（或你设置的 limit 条）`}
              />
            </div>
          </div>
        )}

        {selectedTask === 'sql-mode' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="workflow.sql"
                code={`-- 标准 SQL 工作流示意
-- 1. 创建向量表
CREATE TABLE documents (id INT, embedding VECTOR(1536));

-- 2. 插入数据 (AI_EMBED 自动生成向量)
INSERT INTO documents VALUES (1, AI_EMBED('text'));

-- 3. 向量搜索
SELECT * FROM documents ORDER BY embedding ↔ AI_EMBED('query') LIMIT 5;`}
                stepHint={T('sqlMode_stepHint')}
                onRun={() => markComplete(taskStorageKey('sql-mode'))}
                expectedOutput={`# 1. 建表成功
# 2. 插入 1 行
# 3. 返回与 'query' 最相似的前 5 条文档`}
              />
            </div>
          </div>
        )}

        {selectedTask === 'step1' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="schema.sql"
                code={`CREATE DATABASE my_ai_app;
USE my_ai_app;
CREATE TABLE documents (
  id INT PRIMARY KEY,
  title VARCHAR(255),
  content TEXT,
  embedding VECTOR(1536)
);`}
                stepHint={T('step1_stepHint')}
                expectedOutput={`Query OK, 0 rows affected
Query OK, 0 rows affected
Query OK, 0 rows affected

# 表示数据库、表已创建成功，可进行下一步插入数据。`}
                onRun={() => markComplete(taskStorageKey('step1'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'step2' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="data.sql"
                code={`-- 写入数据（使用完整示例文本，便于理解语义搜索效果）
INSERT INTO documents (id, title, content, embedding)
VALUES (
  1,
  'AI 入门',
  '人工智能是计算机科学的一个分支，致力于创建能够执行通常需要人类智能的任务的系统，包括机器学习、自然语言处理和计算机视觉。',
  AI_EMBED('人工智能是计算机科学的一个分支，致力于创建能够执行通常需要人类智能的任务的系统。')
);
-- 读取数据
SELECT * FROM documents WHERE id = 1;`}
                stepHint={T('step2_stepHint')}
                tryIt={T('step2_tryIt')}
                editableSnippet="'AI 入门'"
                expectedOutput={`Query OK, 1 row affected

+----+---------+------------------------------------------+------------------+
| id | title   | content                                  | embedding        |
+----+---------+------------------------------------------+------------------+
|  1 | AI 入门 | 人工智能是计算机科学的一个分支...          | [1536 dims]      |
+----+---------+------------------------------------------+------------------+
1 row in set`}
                expectedData={[
                  { id: 1, title: 'AI 入门', content: '人工智能是计算机科学的一个分支...', embedding: '[1536 dims]' },
                ]}
                onRun={() => markComplete(taskStorageKey('step2'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'step3' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="data_more.sql"
                code={`-- 插入更多文档，便于搜索时有更多结果
INSERT INTO documents (id, title, content, embedding)
VALUES
  (2, '机器学习简介', '机器学习使计算机能够从数据中学习并做出预测，无需显式编程。', AI_EMBED('机器学习使计算机能够从数据中学习并做出预测。')),
  (3, '深度学习入门', '深度学习使用多层神经网络处理复杂模式，广泛应用于图像和语音识别。', AI_EMBED('深度学习使用多层神经网络处理复杂模式。'));`}
                expectedOutput={`Query OK, 2 rows affected

# 现在 documents 表中共有 3 条数据，步骤 4 的搜索将返回更丰富的结果。${t('codeBlock.insertTableHint')}`}
                expectedData={[
                  { id: 2, title: '机器学习简介', content: '机器学习使计算机能够从数据中学习并做出预测，无需显式编程。', embedding: '[0.01, -0.02, ... 1536 dims]' },
                  { id: 3, title: '深度学习入门', content: '深度学习使用多层神经网络处理复杂模式，广泛应用于图像和语音识别。', embedding: '[0.01, -0.02, ... 1536 dims]' },
                ]}
                onRun={() => markComplete(taskStorageKey('step3'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'step4' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="search.sql"
                code={`-- 向量搜索：找到与「什么是机器学习」最相似的文档
SELECT id, title,
  COSINE_DISTANCE(embedding, AI_EMBED('什么是机器学习')) AS similarity
FROM documents
ORDER BY similarity
LIMIT 5;`}
                stepHint={T('step4_stepHint')}
                tryIt={T('step4_tryIt')}
                editableSnippet="'什么是机器学习'"
                expectedOutput={`+----+------------------+------------+
| id | title            | similarity |
+----+------------------+------------+
|  2 | 机器学习简介     | 0.12       |
|  1 | AI 入门          | 0.25       |
|  3 | 深度学习入门     | 0.31       |
+----+------------------+------------+
3 rows in set

# similarity 越小表示与问题越相似。`}
                expectedData={[
                  { id: 2, title: '机器学习简介', similarity: 0.12 },
                  { id: 1, title: 'AI 入门', similarity: 0.25 },
                  { id: 3, title: '深度学习入门', similarity: 0.31 },
                ]}
                onRun={() => markComplete(taskStorageKey('step4'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'quiz' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <QuizSet
                questions={OVERVIEW_QUIZ}
                title={T('quizSection')}
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
