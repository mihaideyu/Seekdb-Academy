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
import { getPageText, createSeekdbAppTexts } from '@/i18n/pages'
import styles from './OverviewPage.module.css'

const meta = getLesson('create-seekdb-app')

type TaskId = 'intro' | 'create' | 'select-template' | 'cd' | 'install' | 'env' | 'dev' | 'templates' | 'quiz'

const TASK_IDS: TaskId[] = ['intro', 'create', 'select-template', 'cd', 'install', 'env', 'dev', 'templates', 'quiz']
const taskStorageKey = (id: TaskId) => `create-seekdb-app-${id}`

export function CreateSeekdbAppPage() {
  const { lang } = useLanguage()
  const T = useCallback(
    (key: keyof typeof createSeekdbAppTexts.zh, params?: Record<string, string | number>) =>
      getPageText(createSeekdbAppTexts, lang, key, params),
    [lang]
  )
  const TASKS: { id: TaskId; title: string; desc: string }[] = useMemo(
    () => [
      { id: 'intro', title: T('taskIntro'), desc: T('taskIntroDesc') },
      { id: 'create', title: T('taskCreate'), desc: T('taskCreateDesc') },
      { id: 'select-template', title: T('taskSelect'), desc: T('taskSelectDesc') },
      { id: 'cd', title: T('taskCd'), desc: T('taskCdDesc') },
      { id: 'install', title: T('taskInstall'), desc: T('taskInstallDesc') },
      { id: 'env', title: T('taskEnv'), desc: T('taskEnvDesc') },
      { id: 'dev', title: T('taskRun'), desc: T('taskRunDesc') },
      { id: 'templates', title: T('taskTemplates'), desc: T('taskTemplatesDesc') },
    ],
    [T]
  )
  const QUIZ_TASK = useMemo(
    () => ({ id: 'quiz' as TaskId, title: T('quizSection'), desc: T('quizDesc') }),
    [T]
  )
  const CREATE_SEEKDB_APP_QUIZ = useMemo(
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
      markComplete('create-seekdb-app')
      navigate(next.path)
    }
  }, [markComplete, navigate, playConfetti])

  const isTaskDone = useCallback(
    (id: TaskId) => completedIds.has(taskStorageKey(id)),
    [completedIds]
  )
  const allTasksDone = TASK_IDS.every((id) => completedIds.has(taskStorageKey(id)))
  const completed = completedIds.has('create-seekdb-app')

  return (
    <div className={styles.overviewRoot}>
      <div className={styles.colIntro}>
        <div className={styles.colIntroScroll}>
          <span className={styles.lessonLabel}>{T('lessonLabel', { n: getLessonGlobalIndex('create-seekdb-app') })}</span>
          <h1 className={styles.h1}>{T('h1')}</h1>
          <p>
            {T('intro')}{' '}
            <a href={`https://seekdb-playground.vercel.app/${lang === 'zh' ? 'zh' : 'en'}/create-seekdb-app`} target="_blank" rel="noopener noreferrer">{T('introLink')}</a>.
          </p>

          <h2 className={styles.sectionTitle}>{T('featuresTitle')}</h2>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: 1.7 }}>
            <li>{T('feature1')}</li>
            <li>{T('feature2')}</li>
            <li>{T('feature3')}</li>
            <li>{T('feature4')}</li>
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
            onMarkComplete={() => markComplete('create-seekdb-app')}
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
                code={`# create-seekdb-app

- 一条命令创建完整的 seekdb 应用项目
- 支持 Next.js、Electron、Express、Fastify 等多种模板
- 自动生成项目结构和配置文件，开箱即用
- 所有模板均提供完整 TypeScript 支持`}
                stepHint="与 create-react-app、create-next-app 类似，专为 seekdb 应用定制的脚手架。"
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
                filename="create.sh"
                language="bash"
                code={`# 使用 npm
npm create seekdb-app@latest my-app

# 使用 pnpm
pnpm create seekdb-app my-app

# 使用 yarn
yarn create seekdb-app my-app`}
                stepHint="将 my-app 替换为你的项目名称；工具会自动创建新目录。"
                expectedOutput={`# 执行后会进入交互式提示，选择模板`}
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
                stepHint="用方向键选择模板后回车，即可生成对应项目。"
                expectedOutput={`# 选择后继续生成项目文件`}
                onRun={() => markComplete(taskStorageKey('select-template'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'cd' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="navigate.sh"
                language="bash"
                code={`cd my-app`}
                stepHint="若创建时使用了其他项目名，此处改为对应目录名。"
                expectedOutput={`# 进入项目根目录后即可执行 install、dev 等`}
                onRun={() => markComplete(taskStorageKey('cd'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'install' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="install.sh"
                language="bash"
                code={`# 使用 pnpm
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install`}
                stepHint="在项目根目录执行，安装模板所需依赖。"
                expectedOutput={`# 安装完成后可配置 .env.local 并运行 dev`}
                onRun={() => markComplete(taskStorageKey('install'))}
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
                stepHint="请勿将 .env.local 提交到 Git，其包含敏感连接信息。"
                expectedOutput={`# 根据模板提示配置；保存后应用会读取这些变量`}
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

# 或
npm run dev

# 或
yarn dev`}
                stepHint="启动开发服务器后，按模板不同可访问对应地址（如 Next.js 默认 http://localhost:3000）。"
                expectedOutput={`# 开发服务器启动，可开始开发与调试`}
                onRun={() => markComplete(taskStorageKey('dev'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'templates' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="可用模板"
                language="markdown"
                code={`## 可用模板

- **Next.js + seekdb**：构建现代化 Web 应用，支持 SSR 和 API 路由
- **Electron + Next.js + seekdb**：跨平台桌面应用，集成向量搜索
- **Express + seekdb**：使用 Express 构建 RESTful API 服务
- **Fastify + seekdb**：使用 Fastify 构建高性能 API 服务`}
                stepHint="按技术栈与部署形态选择；学院内另有 Next.js / Electron 模板单独课程可深入。"
                expectedOutput={`# 说明文档，无执行输出`}
                onRun={() => markComplete(taskStorageKey('templates'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'quiz' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <QuizSet
                questions={CREATE_SEEKDB_APP_QUIZ}
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
