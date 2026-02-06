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
  const { lang, t } = useLanguage()
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
                filename="create.sh"
                language="bash"
                code={T('create_code')}
                stepHint={T('create_stepHint')}
                expectedOutput={T('create_expectedOutput')}
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
                code={T('select_template_code')}
                stepHint={T('select_template_stepHint')}
                expectedOutput={T('select_template_expectedOutput')}
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
                code={T('cd_code')}
                stepHint={T('cd_stepHint')}
                expectedOutput={T('cd_expectedOutput')}
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
                code={T('install_code')}
                stepHint={T('install_stepHint')}
                expectedOutput={T('install_expectedOutput')}
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
                code={T('env_code')}
                stepHint={T('env_stepHint')}
                expectedOutput={T('env_expectedOutput')}
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
                code={T('dev_code')}
                stepHint={T('dev_stepHint')}
                expectedOutput={T('dev_expectedOutput')}
                onRun={() => markComplete(taskStorageKey('dev'))}
              />
            </div>
          </div>
        )}

        {selectedTask === 'templates' && (
          <div className={styles.embedCard}>
            <div className={styles.embedCardInner}>
              <CodeBlock
                filename={lang === 'zh' ? '可用模板' : 'Available templates'}
                language="markdown"
                code={T('templates_code')}
                stepHint={T('templates_stepHint')}
                expectedOutput={`# ${t('codeBlock.docOnlyOutput')}`}
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
