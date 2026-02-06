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
import { getPageText, seekdbJsTexts } from '@/i18n/pages'
import styles from './OverviewPage.module.css'

const meta = getLesson('seekdb-js')

type TaskId = 'install' | 'connect' | 'create-collection' | 'add-data' | 'query' | 'admin' | 'quiz'

const TASK_IDS: TaskId[] = ['install', 'connect', 'create-collection', 'add-data', 'query', 'admin', 'quiz']
const taskStorageKey = (id: TaskId) => `seekdb-js-${id}`

export function SeekdbJsPage() {
  const { lang } = useLanguage()
  const T = useCallback(
    (key: keyof typeof seekdbJsTexts.zh, params?: Record<string, string | number>) =>
      getPageText(seekdbJsTexts, lang, key, params),
    [lang]
  )
  const TASKS: { id: TaskId; title: string; desc: string }[] = useMemo(
    () => [
      { id: 'install', title: T('taskInstall'), desc: T('taskInstallDesc') },
      { id: 'connect', title: T('taskConnect'), desc: T('taskConnectDesc') },
      { id: 'create-collection', title: T('taskCreate'), desc: T('taskCreateDesc') },
      { id: 'add-data', title: T('taskInsert'), desc: T('taskInsertDesc') },
      { id: 'query', title: T('taskSearch'), desc: T('taskSearchDesc') },
      { id: 'admin', title: T('taskAdmin'), desc: T('taskAdminDesc') },
    ],
    [T]
  )
  const QUIZ_TASK = useMemo(
    () => ({ id: 'quiz' as TaskId, title: T('quizSection'), desc: T('quizDesc') }),
    [T]
  )
  const SEEKDB_JS_QUIZ = useMemo(
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
  const navigate = useNavigate()
  const { completedIds, markComplete } = useProgress()
  const { playConfetti } = useConfetti()
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  const [selectedTask, setSelectedTask] = useState<TaskId>('install')

  const handleNextWithCelebration = useCallback(() => {
    const rect = nextButtonRef.current?.getBoundingClientRect()
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : { x: window.innerWidth * 0.5, y: window.innerHeight * 0.85 }
    playConfetti(generateConfettiPieces(origin))
    const next = meta?.nextId ? getLesson(meta.nextId) : null
    if (next) {
      markComplete('seekdb-js')
      navigate(next.path)
    }
  }, [markComplete, navigate, playConfetti])

  const isTaskDone = useCallback(
    (id: TaskId) => completedIds.has(taskStorageKey(id)),
    [completedIds]
  )
  const allTasksDone = TASK_IDS.every((id) => completedIds.has(taskStorageKey(id)))
  const completed = completedIds.has('seekdb-js')

  return (
    <div className={styles.overviewRoot}>
      <div className={styles.colIntro}>
        <div className={styles.colIntroScroll}>
          <span className={styles.lessonLabel}>{T('lessonLabel', { n: getLessonGlobalIndex('seekdb-js') })}</span>
          <h1 className={styles.h1}>{T('h1')}</h1>
          <p>
            <strong>seekdb-js</strong> {T('intro')}{' '}
            <a href={`https://seekdb-playground.vercel.app/${lang === 'zh' ? 'zh' : 'en'}/seekdb-js`} target="_blank" rel="noopener noreferrer">{T('introLink')}</a>.
          </p>

          <h2 className={styles.sectionTitle}>{T('capabilitiesTitle')}</h2>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: 1.7 }}>
            <li>{T('cap1')}</li>
            <li>{T('cap2')}</li>
            <li>{T('cap3')}</li>
            <li>{T('cap4')}</li>
          </ul>

          <h2 className={styles.sectionTitle}>{T('practiceTitle')}</h2>
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
            onMarkComplete={() => markComplete('seekdb-js')}
            completed={completed || allTasksDone}
            onNextClick={completed || allTasksDone ? handleNextWithCelebration : undefined}
            nextButtonRef={nextButtonRef}
          />
        </div>
      </div>

      <div className={styles.colContent}>
        {selectedTask === 'install' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="install.sh"
                language="bash"
                code={`# 使用 npm / pnpm / yarn 之一安装
npm install seekdb

# 或
pnpm add seekdb

# 或
yarn add seekdb`}
                stepHint={T('install_stepHint')}
                expectedOutput={`# 安装成功后会看到 added 1 package 等提示
# 本地可运行: node -e "require('seekdb')" 验证`}
                onRun={() => markComplete(taskStorageKey('install'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'connect' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="connect.ts"
                language="typescript"
                code={`import { SeekdbClient } from "seekdb";

// 连接到 seekdb
const client = new SeekdbClient({
  host: "127.0.0.1",
  port: 2881,
  user: "root",
  password: "",
  database: "test",
});

// OceanBase 模式需指定 tenant
// const client = new SeekdbClient({
//   host: "127.0.0.1",
//   port: 2881,
//   user: "root",
//   password: "",
//   database: "test",
//   tenant: "sys",
// });`}
                stepHint={T('connect_stepHint')}
                expectedOutput={`# 连接成功后可继续 createCollection、add、query 等操作`}
                onRun={() => markComplete(taskStorageKey('connect'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'create-collection' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="create-collection.ts"
                language="typescript"
                code={`// 创建集合（Collection）—— seekdb-js 中存储与管理数据的基本单位
const collection = await client.createCollection({
  name: "my_collection",
});

console.log("集合创建成功:", collection.name);`}
                stepHint={T('createCollection_stepHint')}
                expectedOutput={`集合创建成功: my_collection`}
                onRun={() => markComplete(taskStorageKey('create-collection'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'add-data' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="add-data.ts"
                language="typescript"
                code={`// 添加数据（自动向量化），可附带 metadatas
await collection.add({
  ids: ["1", "2"],
  documents: ["Hello world", "seekdb is fast"],
  metadatas: [
    { category: "test" },
    { category: "db" },
  ],
});`}
                stepHint={T('addData_stepHint')}
                expectedOutput={`# 写入成功，无报错即可进行下一步 query`}
                onRun={() => markComplete(taskStorageKey('add-data'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'query' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="query.ts"
                language="typescript"
                code={`// 语义搜索：按与 queryTexts 的相似度返回 Top N
const results = await collection.query({
  queryTexts: "Hello",
  nResults: 5,
});

console.log("搜索结果:", results);`}
                stepHint={T('query_stepHint')}
                expectedOutput={`# 返回与 "Hello" 语义相近的文档列表
# 结构包含 ids、documents、metadatas、distances 等`}
                onRun={() => markComplete(taskStorageKey('query'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'admin' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="admin.ts"
                language="typescript"
                code={`import { SeekdbAdminClient } from "seekdb";

const adminClient = new SeekdbAdminClient({
  host: "127.0.0.1",
  port: 2881,
  user: "root",
  password: "",
  // tenant: "sys"  // OceanBase 模式
});

// 创建数据库
await adminClient.createDatabase("new_database");

// 列出所有数据库
const databases = await adminClient.listDatabases();

// 删除数据库
await adminClient.deleteDatabase("new_database");`}
                stepHint={T('admin_stepHint')}
                expectedOutput={`# listDatabases 返回数据库名称列表
# 创建/删除成功无报错`}
                onRun={() => markComplete(taskStorageKey('admin'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'quiz' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <QuizSet
                questions={SEEKDB_JS_QUIZ}
                title={T('quizSection')}
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
