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
import { getPageText, nextjsSeekdbTemplateTexts } from '@/i18n/pages'
import styles from './OverviewPage.module.css'

const meta = getLesson('nextjs-seekdb-template')

type TaskId = 'intro' | 'create' | 'select-template' | 'env' | 'dev' | 'api-route' | 'quiz'

const TASK_IDS: TaskId[] = ['intro', 'create', 'select-template', 'env', 'dev', 'api-route', 'quiz']
const taskStorageKey = (id: TaskId) => `nextjs-seekdb-template-${id}`

export function NextjsSeekdbTemplatePage() {
  const { lang } = useLanguage()
  const T = useCallback(
    (key: keyof typeof nextjsSeekdbTemplateTexts.zh, params?: Record<string, string | number>) =>
      getPageText(nextjsSeekdbTemplateTexts, lang, key, params),
    [lang]
  )
  const TASKS: { id: TaskId; title: string; desc: string }[] = useMemo(
    () => [
      { id: 'intro', title: T('taskIntro'), desc: T('taskIntroDesc') },
      { id: 'create', title: T('taskCreate'), desc: T('taskCreateDesc') },
      { id: 'select-template', title: T('taskSelect'), desc: T('taskSelectDesc') },
      { id: 'env', title: T('taskEnv'), desc: T('taskEnvDesc') },
      { id: 'dev', title: T('taskDev'), desc: T('taskDevDesc') },
      { id: 'api-route', title: T('taskApi'), desc: T('taskApiDesc') },
    ],
    [T]
  )
  const QUIZ_TASK = useMemo(
    () => ({ id: 'quiz' as TaskId, title: T('quizSection'), desc: T('quizDesc') }),
    [T]
  )
  const NEXTJS_SEEKDB_QUIZ = useMemo(
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
  const navigate = useNavigate()
  const { completedIds, markComplete } = useProgress()
  const { playConfetti } = useConfetti()
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  const [selectedTask, setSelectedTask] = useState<TaskId>('intro')

  const handleNextWithCelebration = useCallback(() => {
    const rect = nextButtonRef.current?.getBoundingClientRect()
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : { x: window.innerWidth * 0.5, y: window.innerHeight * 0.85 }
    playConfetti(generateConfettiPieces(origin))
    const next = meta?.nextId ? getLesson(meta.nextId) : null
    if (next) {
      markComplete('nextjs-seekdb-template')
      navigate(next.path)
    }
  }, [markComplete, navigate, playConfetti])

  const isTaskDone = useCallback(
    (id: TaskId) => completedIds.has(taskStorageKey(id)),
    [completedIds]
  )
  const allTasksDone = TASK_IDS.every((id) => completedIds.has(taskStorageKey(id)))
  const completed = completedIds.has('nextjs-seekdb-template')

  return (
    <div className={styles.overviewRoot}>
      <div className={styles.colIntro}>
        <div className={styles.colIntroScroll}>
          <span className={styles.lessonLabel}>{T('lessonLabel', { n: getLessonGlobalIndex('nextjs-seekdb-template') })}</span>
          <h1 className={styles.h1}>{T('h1')}</h1>
          <p>
            {T('intro')}{' '}
            <a href={`https://seekdb-playground.vercel.app/${lang === 'zh' ? 'zh' : 'en'}/nextjs-seekdb-template`} target="_blank" rel="noopener noreferrer">{T('introLink')}</a>.
          </p>

          <h2 className={styles.sectionTitle}>{T('featuresTitle')}</h2>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: 1.7 }}>
            <li>{T('feature1')}</li>
            <li>{T('feature2')}</li>
            <li>{T('feature3')}</li>
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
            onMarkComplete={() => markComplete('nextjs-seekdb-template')}
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
                code={`# Next.js + seekdb 模板

- **Next.js 14+**：App Router、Server Components、API Routes
- **seekdb-js**：在服务端连接 SeekDB，实现向量搜索与数据操作
- **TypeScript**：完整类型支持

适用场景：需要服务端渲染或 API 的 Web 应用，结合向量/语义搜索。`}
                stepHint="模板开箱即用，创建后配置环境变量即可连接 SeekDB。"
                expectedOutput={`# 说明文档，无执行输出`}
                onRun={() => markComplete(taskStorageKey('intro'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'create' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="create-app.sh"
                language="bash"
                code={`npx create-seekdb-app@latest my-app

# 或使用 pnpm
pnpm create seekdb-app my-app

# 或使用 yarn
yarn create seekdb-app my-app`}
                stepHint="将 my-app 替换为你的项目名称；工具会自动创建项目目录并安装依赖。"
                expectedOutput={`# 创建完成后会进入交互式提示，选择模板`}
                onRun={() => markComplete(taskStorageKey('create'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'select-template' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="select-template.txt"
                language="text"
                code={`? Select a template: (Use arrow keys)
❯ Next.js + seekdb
  Electron + Next.js + seekdb
  Express + seekdb
  Fastify + seekdb`}
                stepHint="在交互式提示中用方向键选择「Next.js + seekdb」后回车。"
                expectedOutput={`# 选择后继续生成项目文件`}
                onRun={() => markComplete(taskStorageKey('select-template'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'env' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename=".env.local"
                language="bash"
                code={`# .env.local
SEEKDB_HOST=127.0.0.1
SEEKDB_PORT=2881
SEEKDB_USER=root
SEEKDB_PASSWORD=
SEEKDB_DATABASE=test`}
                stepHint="在项目根目录创建 .env.local；请先安装并启动 seekdb 服务，再按实际修改连接参数。"
                expectedOutput={`# 保存后应用会读取这些环境变量连接 SeekDB`}
                onRun={() => markComplete(taskStorageKey('env'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'dev' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="dev.sh"
                language="bash"
                code={`pnpm dev

# 默认运行在 http://localhost:3000`}
                stepHint="在项目目录执行；首次可先 pnpm install。"
                expectedOutput={`# 开发服务器启动后，在浏览器打开 http://localhost:3000`}
                onRun={() => markComplete(taskStorageKey('dev'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'api-route' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="app/api/search/route.ts"
                language="typescript"
                code={`// app/api/search/route.ts
import { SeekdbClient } from 'seekdb';

const client = new SeekdbClient({
  host: process.env.SEEKDB_HOST,
  port: parseInt(process.env.SEEKDB_PORT || '2881'),
  user: process.env.SEEKDB_USER,
  password: process.env.SEEKDB_PASSWORD,
  database: process.env.SEEKDB_DATABASE,
});

export async function POST(request: Request) {
  const { query } = await request.json();

  const collection = await client.getCollection('documents');
  const results = await collection.query({
    queryTexts: query,
    nResults: 10,
  });

  return Response.json(results);
}`}
                stepHint="在 API Route 中从环境变量读取连接配置，接收 POST 请求后做语义搜索并返回 JSON。"
                expectedOutput={`# 前端可 fetch('/api/search', { method: 'POST', body: JSON.stringify({ query: '...' }) }) 调用`}
                onRun={() => markComplete(taskStorageKey('api-route'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'quiz' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <QuizSet
                questions={NEXTJS_SEEKDB_QUIZ}
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
