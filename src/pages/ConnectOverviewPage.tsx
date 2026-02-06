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
import { getPageText, connectOverviewTexts } from '@/i18n/pages'
import styles from './OverviewPage.module.css'

const meta = getLesson('connect-overview')

type TaskId = 'python-demo' | 'node-demo' | 'quiz'

const TASK_IDS: TaskId[] = ['python-demo', 'node-demo', 'quiz']
const taskStorageKey = (id: TaskId) => `connect-overview-${id}`

export function ConnectOverviewPage() {
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const { completedIds, markComplete } = useProgress()
  const { playConfetti } = useConfetti()
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  const [selectedTask, setSelectedTask] = useState<TaskId>('quiz')

  const T = useCallback(
    (key: keyof typeof connectOverviewTexts.zh, params?: Record<string, string | number>) =>
      getPageText(connectOverviewTexts, lang, key, params),
    [lang]
  )

  const TASKS = useMemo(
    () => [
      { id: 'python-demo' as TaskId, title: T('taskPythonTitle'), desc: T('taskPythonDesc') },
      { id: 'node-demo' as TaskId, title: T('taskNodeTitle'), desc: T('taskNodeDesc') },
    ],
    [T]
  )
  const QUIZ_TASK = useMemo(
    () => ({ id: 'quiz' as TaskId, title: T('quizTaskTitle'), desc: T('quizDesc') }),
    [T]
  )
  const CONNECT_QUIZ = useMemo(
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
      markComplete('connect-overview')
      navigate(next.path)
    }
  }, [markComplete, navigate, playConfetti])

  const isTaskDone = useCallback(
    (id: TaskId) => completedIds.has(taskStorageKey(id)),
    [completedIds]
  )
  const allTasksDone = TASK_IDS.every((id) => completedIds.has(taskStorageKey(id)))
  const completed = completedIds.has('connect-overview')

  return (
    <div className={styles.overviewRoot}>
      <div className={styles.colIntro}>
        <div className={styles.colIntroScroll}>
          <span className={styles.lessonLabel}>{T('lessonLabel', { n: getLessonGlobalIndex('connect-overview') })}</span>
          <h1 className={styles.h1}>{T('h1')}</h1>
          <p>{T('intro')}</p>

          <h2 className={styles.sectionTitle}>{T('waysTitle')}</h2>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: 1.6 }}>
            <li>{T('way1')}</li>
            <li>{T('way2')}</li>
            <li>{T('way3')}</li>
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
            onMarkComplete={() => markComplete('connect-overview')}
            completed={completed || allTasksDone}
            onNextClick={completed || allTasksDone ? handleNextWithCelebration : undefined}
            nextButtonRef={nextButtonRef}
          />
        </div>
      </div>

      <div className={styles.colContent}>
        {selectedTask === 'python-demo' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="connect_py.py"
                language="python"
                code={`pip install pyseekdb

from pyseekdb import Client
client = Client(
    host="127.0.0.1",
    port=2881,
    user="root",
    password="your_password"
)
# 测试连接
result = client.query("SELECT 1")
print(result)  # 成功则能执行 SQL`}
                stepHint={T('python_hint')}
                expectedOutput={`# 连接成功时示例输出
[(1,)]
# 表示能正常执行 SQL，连接可用。`}
                onRun={() => markComplete(taskStorageKey('python-demo'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'node-demo' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="connect_node.js"
                language="javascript"
                code={`const mysql = require('mysql2/promise');
const conn = await mysql.createConnection({
  host: '127.0.0.1',
  port: 2881,
  user: 'root',
  password: 'your_password',
  database: 'my_ai_app'
});
const [rows] = await conn.execute('SELECT 1');
console.log(rows);  // [ { '1': 1 } ]`}
                stepHint={T('node_hint')}
                expectedOutput={`# 连接成功时
[ { '1': 1 } ]
# 表示驱动已通过 MySQL 协议连上 SeekDB。`}
                onRun={() => markComplete(taskStorageKey('node-demo'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'quiz' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <QuizSet
                questions={CONNECT_QUIZ}
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
