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
import { getPageText, electronNextjsTemplateTexts } from '@/i18n/pages'
import styles from './OverviewPage.module.css'

const meta = getLesson('electron-nextjs-template')

type TaskId = 'intro' | 'create' | 'run' | 'structure' | 'seekdb-config' | 'quiz'

const TASK_IDS: TaskId[] = ['intro', 'create', 'run', 'structure', 'seekdb-config', 'quiz']
const taskStorageKey = (id: TaskId) => `electron-nextjs-template-${id}`

export function ElectronNextjsTemplatePage() {
  const { lang } = useLanguage()
  const T = useCallback(
    (key: keyof typeof electronNextjsTemplateTexts.zh, params?: Record<string, string | number>) =>
      getPageText(electronNextjsTemplateTexts, lang, key, params),
    [lang]
  )
  const TASKS: { id: TaskId; title: string; desc: string }[] = useMemo(
    () => [
      { id: 'intro', title: T('taskIntro'), desc: T('taskIntroDesc') },
      { id: 'create', title: T('taskCreate'), desc: T('taskCreateDesc') },
      { id: 'run', title: T('taskInstall'), desc: T('taskInstallDesc') },
      { id: 'structure', title: T('taskStructure'), desc: T('taskStructureDesc') },
      { id: 'seekdb-config', title: T('taskConfig'), desc: T('taskConfigDesc') },
    ],
    [T]
  )
  const QUIZ_TASK = useMemo(
    () => ({ id: 'quiz' as TaskId, title: T('quizSection'), desc: T('quizDesc') }),
    [T]
  )
  const ELECTRON_NEXTJS_QUIZ = useMemo(
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
      markComplete('electron-nextjs-template')
      navigate(next.path)
    }
  }, [markComplete, navigate, playConfetti])

  const isTaskDone = useCallback(
    (id: TaskId) => completedIds.has(taskStorageKey(id)),
    [completedIds]
  )
  const allTasksDone = TASK_IDS.every((id) => completedIds.has(taskStorageKey(id)))
  const completed = completedIds.has('electron-nextjs-template')

  return (
    <div className={styles.overviewRoot}>
      <div className={styles.colIntro}>
        <div className={styles.colIntroScroll}>
          <span className={styles.lessonLabel}>{T('lessonLabel', { n: getLessonGlobalIndex('electron-nextjs-template') })}</span>
          <h1 className={styles.h1}>{T('h1')}</h1>
          <p>
            {T('intro')}
          </p>

          <h2 className={styles.sectionTitle}>{T('stackTitle')}</h2>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: 1.7 }}>
            <li>{T('stack1')}</li>
            <li>{T('stack2')}</li>
            <li>{T('stack3')}</li>
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
            onMarkComplete={() => markComplete('electron-nextjs-template')}
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
                code={`# Electron + Next.js + seekdb 模板

- **Electron**：桌面应用壳，主进程管理窗口与系统集成。
- **Next.js**：渲染进程中的 Web 应用，负责页面与路由。
- **seekdb-js**：在 Node/渲染进程中连接 SeekDB，实现向量与语义搜索。

适用场景：需要打包成桌面客户端的 AI 应用（如本地知识库、离线检索工具）。`}
                stepHint="模板将三者整合为一套可运行的脚手架，开箱即用。"
                expectedOutput={`# 仅说明文档，无执行输出`}
                onRun={() => markComplete(taskStorageKey('intro'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'create' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="terminal"
                language="bash"
                code={`# 使用 create-seekdb-app 创建项目（推荐）
npx create-seekdb-app@latest my-electron-seekdb --template electron-nextjs

# 或从官方模板仓库克隆
# git clone https://github.com/seekdb/electron-nextjs-seekdb-template.git my-app
# cd my-app`}
                stepHint="执行后会在当前目录生成 my-electron-seekdb（或你指定的目录），内含 Electron + Next.js + seekdb 配置。"
                expectedOutput={`# 创建完成后进入目录: cd my-electron-seekdb`}
                onRun={() => markComplete(taskStorageKey('create'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'run' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="package.json (scripts)"
                language="json"
                code={`{
  "scripts": {
    "dev": "concurrently \"next dev\" \"wait-on http://localhost:3000 && electron .\"",
    "build": "next build && electron-builder",
    "start": "next start"
  }
}`}
                stepHint="dev 会先启动 Next.js，再启动 Electron 并加载本地页面；本地请在该模板项目中执行 pnpm install && pnpm dev。"
                expectedOutput={`# 终端中 Next 与 Electron 启动后，会弹出桌面窗口并打开应用`}
                onRun={() => markComplete(taskStorageKey('run'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'structure' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="项目结构示意"
                language="text"
                code={`my-electron-seekdb/
├── main/           # Electron 主进程（创建窗口、加载 URL）
├── preload/         # 预加载脚本（安全桥接 main 与 renderer）
├── src/             # Next.js 应用
│   ├── app/         # App Router 页面
│   ├── lib/         # 可放 seekdb 客户端封装
│   └── ...
├── package.json
└── next.config.js`}
                stepHint="seekdb-js 可在 Next.js 的 Server Component、API Route 或通过 preload 暴露给渲染进程使用。"
                expectedOutput={`# 了解结构后，在 lib 或 API 中接入 SeekdbClient 即可`}
                onRun={() => markComplete(taskStorageKey('structure'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'seekdb-config' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename="src/lib/seekdb.ts"
                language="typescript"
                code={`import { SeekdbClient } from "seekdb";

// 从环境变量读取，便于区分开发/生产
const client = new SeekdbClient({
  host: process.env.SEEKDB_HOST ?? "127.0.0.1",
  port: Number(process.env.SEEKDB_PORT) || 2881,
  user: process.env.SEEKDB_USER ?? "root",
  password: process.env.SEEKDB_PASSWORD ?? "",
  database: process.env.SEEKDB_DATABASE ?? "test",
});

export async function getCollection(name: string) {
  return client.getOrCreateCollection(name);
}

export { client };`}
                stepHint="在 Next.js API Route 或 Server Action 中调用 getCollection/createCollection/query，避免在浏览器中暴露连接信息。"
                expectedOutput={`# 封装后可在页面或 API 中 import { client, getCollection } from '@/lib/seekdb'`}
                onRun={() => markComplete(taskStorageKey('seekdb-config'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'quiz' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <QuizSet
                questions={ELECTRON_NEXTJS_QUIZ}
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
