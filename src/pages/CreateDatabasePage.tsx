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
import { getPageText, createDatabaseTexts } from '@/i18n/pages'
import styles from './OverviewPage.module.css'

const meta = getLesson('create-database')

type TaskId = 'intro' | 'create' | 'manage' | 'drop' | 'naming' | 'quiz'

const TASK_IDS: TaskId[] = ['intro', 'create', 'manage', 'drop', 'naming', 'quiz']
const taskStorageKey = (id: TaskId) => `create-database-${id}`

export function CreateDatabasePage() {
  const navigate = useNavigate()
  const { lang, t } = useLanguage()
  const { completedIds, markComplete } = useProgress()
  const { playConfetti } = useConfetti()
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  const [selectedTask, setSelectedTask] = useState<TaskId>('intro')

  const T = useCallback(
    (key: keyof typeof createDatabaseTexts.zh, params?: Record<string, string | number>) =>
      getPageText(createDatabaseTexts, lang, key, params),
    [lang]
  )

  const TASKS = useMemo(
    () => [
      { id: 'intro' as TaskId, title: T('taskDb'), desc: T('taskDbDesc') },
      { id: 'create' as TaskId, title: T('taskCreate'), desc: T('taskCreateDesc') },
      { id: 'manage' as TaskId, title: T('taskView'), desc: T('taskViewDesc') },
      { id: 'drop' as TaskId, title: T('taskDrop'), desc: T('taskDropDesc') },
      { id: 'naming' as TaskId, title: T('taskDesign'), desc: T('taskDesignDesc') },
    ],
    [T]
  )
  const QUIZ_TASK = useMemo(
    () => ({ id: 'quiz' as TaskId, title: T('quizSection'), desc: T('quizDesc') }),
    [T]
  )
  const CREATE_DATABASE_QUIZ = useMemo(
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
      markComplete('create-database')
      navigate(next.path)
    }
  }, [markComplete, navigate, playConfetti])

  const isTaskDone = useCallback(
    (id: TaskId) => completedIds.has(taskStorageKey(id)),
    [completedIds]
  )
  const allTasksDone = TASK_IDS.every((id) => completedIds.has(taskStorageKey(id)))
  const completed = completedIds.has('create-database')

  return (
    <div className={styles.overviewRoot}>
      <div className={styles.colIntro}>
        <div className={styles.colIntroScroll}>
          <span className={styles.lessonLabel}>{T('lessonLabel', { n: getLessonGlobalIndex('create-database') })}</span>
          <h1 className={styles.h1}>{T('h1')}</h1>
          <p>
            {T('intro')}{' '}
            <a href={lang === 'zh' ? 'https://seekdb-playground.vercel.app/zh/create-database' : 'https://seekdb-playground.vercel.app/en/create-database'} target="_blank" rel="noopener noreferrer">{T('introLink')}</a>.
          </p>

          <h2 className={styles.sectionTitle}>{T('basicsTitle')}</h2>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: 1.7 }}>
            <li>{T('basics1')}</li>
            <li>{T('basics2')}</li>
            <li>{T('basics3')}</li>
          </ul>

          <h2 className={styles.sectionTitle}>{T('practiceTitle')}</h2>
          <p className={styles.sectionDesc}>{T('practiceDesc2')}</p>

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
            onMarkComplete={() => markComplete('create-database')}
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
                code={`# 创建数据库

- 数据库是组织数据的**顶层容器**
- 其下包含：表、索引、视图等数据库对象
- 创建库后需 USE 切换当前库，再创建表、写入数据`}
                stepHint={T('intro_stepHint')}
                expectedOutput={`# ${t('codeBlock.docOnlyOutput')}`}
                onRun={() => markComplete(taskStorageKey('intro'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'create' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="create_database.sql"
                language="sql"
                code={`-- 创建新数据库
CREATE DATABASE my_ai_app;

-- 创建数据库（如果不存在，已存在时不报错）
CREATE DATABASE IF NOT EXISTS my_ai_app;

-- 指定字符集与排序规则
CREATE DATABASE my_ai_app
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;`}
                stepHint={T('create_stepHint')}
                expectedOutput={`Query OK, 1 row affected (或 0 rows 若已存在)
# 创建成功后可用 USE my_ai_app 切换`}
                onRun={() => markComplete(taskStorageKey('create'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'manage' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="manage_database.sql"
                language="sql"
                code={`-- 查看所有数据库
SHOW DATABASES;

-- 切换到指定数据库
USE my_ai_app;

-- 查看当前数据库
SELECT DATABASE();

-- 查看数据库定义
SHOW CREATE DATABASE my_ai_app;`}
                stepHint={T('manage_stepHint')}
                expectedOutput={`# SHOW DATABASES 列出库名
# SELECT DATABASE() 返回当前库名
# SHOW CREATE DATABASE 返回创建语句`}
                onRun={() => markComplete(taskStorageKey('manage'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'drop' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="drop_database.sql"
                language="sql"
                code={`-- 删除数据库（谨慎：数据将永久删除，不可恢复）
DROP DATABASE my_ai_app;

-- 删除数据库（如果存在）
DROP DATABASE IF EXISTS my_ai_app;`}
                stepHint={T('drop_stepHint')}
                expectedOutput={`Query OK, 0 rows affected
# 库及其内所有对象被删除`}
                onRun={() => markComplete(taskStorageKey('drop'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'naming' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="命名和设计建议"
                language="markdown"
                code={`## 数据库命名规范

- 使用小写字母和下划线，如 my_ai_app
- 名称应具有描述性，如 ecommerce_prod
- 区分环境：dev、test、prod，如 myapp_dev、myapp_prod
- 避免使用 SQL 保留字

## 环境隔离

为开发、测试和生产环境创建独立数据库，便于隔离与回滚。`}
                stepHint={T('naming_stepHint')}
                expectedOutput={`# ${t('codeBlock.docOnlyOutput')}`}
                onRun={() => markComplete(taskStorageKey('naming'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'quiz' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <QuizSet
                questions={CREATE_DATABASE_QUIZ}
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
