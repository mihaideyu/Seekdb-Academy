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
  const { lang, t } = useLanguage()
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
                code={T('intro_code')}
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
                filename="terminal"
                language="bash"
                code={T('create_code')}
                stepHint={T('create_stepHint')}
                expectedOutput={T('create_expectedOutput')}
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
                code={T('run_code')}
                stepHint={T('run_stepHint')}
                expectedOutput={T('run_expectedOutput')}
                onRun={() => markComplete(taskStorageKey('run'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'structure' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename={lang === 'zh' ? '项目结构示意' : 'Project structure'}
                language="text"
                code={T('structure_code')}
                stepHint={T('structure_stepHint')}
                expectedOutput={T('structure_expectedOutput')}
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
                code={T('seekdb_config_code')}
                stepHint={T('seekdb_config_stepHint')}
                expectedOutput={T('seekdb_config_expectedOutput')}
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
