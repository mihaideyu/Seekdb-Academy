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
import { getPageText, vectorSearchTexts } from '@/i18n/pages'
import styles from './OverviewPage.module.css'

const meta = getLesson('vector-search')

type TaskId = 'step1' | 'step2' | 'step3' | 'quiz'

const TASK_IDS: TaskId[] = ['step1', 'step2', 'step3', 'quiz']
const taskStorageKey = (id: TaskId) => `vector-search-${id}`

export function VectorSearchPage() {
  const navigate = useNavigate()
  const { lang, t } = useLanguage()
  const { completedIds, markComplete } = useProgress()
  const { playConfetti } = useConfetti()
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  const [selectedTask, setSelectedTask] = useState<TaskId>('quiz')

  const T = useCallback(
    (key: keyof typeof vectorSearchTexts.zh, params?: Record<string, string | number>) =>
      getPageText(vectorSearchTexts, lang, key, params),
    [lang]
  )

  const TASKS = useMemo(
    () => [
      { id: 'step1' as TaskId, title: T('taskStep1Title'), desc: T('taskStep1Desc') },
      { id: 'step2' as TaskId, title: T('taskStep2Title'), desc: T('taskStep2Desc') },
      { id: 'step3' as TaskId, title: T('taskStep3Title'), desc: T('taskStep3Desc') },
    ],
    [T]
  )
  const QUIZ_TASK = useMemo(
    () => ({ id: 'quiz' as TaskId, title: T('quizTaskTitle'), desc: T('quizDesc') }),
    [T]
  )
  const VECTOR_QUIZ = useMemo(
    () => [
      {
        question: T('quiz1Question'),
        options: [
          { value: 'A', label: T('quiz1A') },
          { value: 'B', label: T('quiz1B') },
          { value: 'C', label: T('quiz1C') },
          { value: 'D', label: T('quiz1D') },
        ],
        correct: 'B' as const,
        explanation: T('quiz1Explanation'),
      },
      {
        question: T('quiz2Question'),
        options: [
          { value: 'A', label: T('quiz2A') },
          { value: 'B', label: T('quiz2B') },
          { value: 'C', label: T('quiz2C') },
          { value: 'D', label: T('quiz2D') },
        ],
        correct: 'B' as const,
        explanation: T('quiz2Explanation'),
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
      markComplete('vector-search')
      navigate(next.path)
    }
  }, [markComplete, navigate, playConfetti])

  const isTaskDone = useCallback(
    (id: TaskId) => completedIds.has(taskStorageKey(id)),
    [completedIds]
  )
  const allTasksDone = TASK_IDS.every((id) => completedIds.has(taskStorageKey(id)))
  const completed = completedIds.has('vector-search')

  return (
    <div className={styles.overviewRoot}>
      <div className={styles.colIntro}>
        <div className={styles.colIntroScroll}>
          <span className={styles.lessonLabel}>{T('lessonLabel', { n: getLessonGlobalIndex('vector-search') })}</span>
          <h1 className={styles.h1}>{T('h1')}</h1>
          <p>
            {lang === 'zh' ? '本课学习 SeekDB 的向量搜索：通过向量相似度找到语义相关的内容，并理解' : 'This lesson covers vector search in SeekDB: finding semantically similar content and understanding '}
            <Term tooltip={T('introTerm')}>{lang === 'zh' ? '语义含义' : 'semantics'}</Term>
            {lang === 'zh' ? '与距离函数、HNSW 索引的用法。' : ', distance functions, and HNSW index.'}
          </p>

          <h2 className={styles.sectionTitle}>{T('conceptsTitle')}</h2>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: 1.6 }}>
            <li><Term tooltip={T('concept1Tip')}>{T('concept1')}</Term></li>
            <li><Term tooltip={T('concept2Tip')}>{T('concept2')}</Term></li>
            <li><Term tooltip={T('concept3Tip')}>{T('concept3')}</Term></li>
            <li><Term tooltip={T('concept4Tip')}>{T('concept4')}</Term></li>
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

          <h3 className={styles.introH3}>{T('distanceTitle')}</h3>
          <table className={styles.introTable}>
            <thead>
              <tr>
                <th>{T('distanceFunc')}</th>
                <th>{T('distanceScene')}</th>
                <th>{T('distanceOrder')}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>{T('cosRow')}</code></td><td>{T('cosScene')}</td><td>{T('cosOrder')}</td></tr>
              <tr><td><code>{T('l2Row')}</code></td><td>{T('l2Scene')}</td><td>{T('l2Order')}</td></tr>
              <tr><td><code>{T('ipRow')}</code></td><td>{T('ipScene')}</td><td>{T('ipOrder')}</td></tr>
            </tbody>
          </table>
        </div>

        <div className={styles.colFooter}>
          <LessonNav
            prevId={meta?.prevId}
            nextId={meta?.nextId}
            onMarkComplete={() => markComplete('vector-search')}
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
                filename="create_table.sql"
                code={`-- 创建文档表，包含向量列
CREATE TABLE articles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  embedding VECTOR(1536),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 创建向量索引以加速搜索（HNSW 为近似最近邻索引）
CREATE INDEX idx_embedding ON articles
USING HNSW (embedding) WITH (M=16, ef_construction=200);`}
                stepHint={T('step1_stepHint')}
                tryIt={T('step1_tryIt')}
                editableSnippet="M=16"
                expectedOutput={`Query OK, 0 rows affected
Query OK, 0 rows affected

# 表 articles 与向量索引 idx_embedding 已创建，可进行插入。`}
                onRun={() => markComplete(taskStorageKey('step1'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'step2' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="insert_data.sql"
                code={`-- 插入数据并自动生成向量嵌入
INSERT INTO articles (title, content, embedding)
VALUES
  ('深度学习入门', '深度学习是机器学习的一个分支，使用多层神经网络学习数据表示。', AI_EMBED('深度学习是机器学习的一个分支，使用多层神经网络学习数据表示。')),
  ('自然语言处理简介', 'NLP 是人工智能的重要领域，研究如何让计算机理解和生成人类语言。', AI_EMBED('NLP 是人工智能的重要领域，研究如何让计算机理解和生成人类语言。')),
  ('计算机视觉应用', 'CV 技术广泛应用于图像识别、目标检测和图像分割等任务。', AI_EMBED('CV 技术广泛应用于图像识别、目标检测和图像分割等任务。'));`}
                stepHint={T('step2_stepHint')}
                tryIt={T('step2_tryIt')}
                editableSnippet="'深度学习入门'"
                expectedOutput={`Query OK, 3 rows affected

# 已插入 3 条文档，embedding 由 AI_EMBED 自动生成。${t('codeBlock.insertTableHint')}`}
                expectedData={[
                  { id: 1, title: '深度学习入门', content: '深度学习是机器学习的一个分支，使用多层神经网络学习数据表示。', embedding: '[0.01, -0.02, ... 1536 dims]' },
                  { id: 2, title: '自然语言处理简介', content: 'NLP 是人工智能的重要领域，研究如何让计算机理解和生成人类语言。', embedding: '[0.01, -0.02, ... 1536 dims]' },
                  { id: 3, title: '计算机视觉应用', content: 'CV 技术广泛应用于图像识别、目标检测和图像分割等任务。', embedding: '[0.01, -0.02, ... 1536 dims]' },
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
                filename="cosine_search.sql"
                code={`-- 使用余弦距离进行向量搜索
SELECT id, title,
  COSINE_DISTANCE(embedding, AI_EMBED('如何学习人工智能')) AS distance
FROM articles
ORDER BY distance ASC
LIMIT 5;`}
                stepHint={T('step3_stepHint')}
                tryIt={T('step3_tryIt')}
                editableSnippet="'如何学习人工智能'"
                expectedOutput={`+----+---------------------+----------+
| id | title               | distance |
+----+---------------------+----------+
|  1 | 深度学习入门        | 0.08     |
|  2 | 自然语言处理简介    | 0.22     |
|  3 | 计算机视觉应用      | 0.35     |
+----+---------------------+----------+
3 rows in set

# distance 越小表示与「如何学习人工智能」越相似。`}
                onRun={() => markComplete(taskStorageKey('step3'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'quiz' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <QuizSet
                questions={VECTOR_QUIZ}
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
