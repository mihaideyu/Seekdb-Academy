import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import styles from './Quiz.module.css'

export interface QuizOption {
  value: string
  label: string
}

export interface QuizQuestion {
  question: string
  options: QuizOption[]
  correct: string
  /** 解析：为什么选这个、相关知识点 */
  explanation: string
}

interface SingleQuizProps extends QuizQuestion {
  name: string
  onSubmit?: (correct: boolean) => void
  /** 多题统一提交时由父组件控制 */
  controlledValue?: string | null
  onControlledChange?: (value: string) => void
  submittedOverride?: boolean
  correctResult?: boolean
  hideSubmitButton?: boolean
}

function SingleQuiz({
  question,
  options,
  correct,
  explanation,
  name,
  onSubmit,
  controlledValue,
  onControlledChange,
  submittedOverride,
  correctResult,
  hideSubmitButton,
}: SingleQuizProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : selected
  const submitted_ = isControlled ? !!submittedOverride : submitted
  const isCorrect = isControlled && submittedOverride ? !!correctResult : value === correct

  const handleSubmit = () => {
    if (value === null) return
    if (isControlled) return
    setSubmitted(true)
    onSubmit?.(value === correct)
  }

  const setValue = (v: string) => {
    if (isControlled) onControlledChange?.(v)
    else setSelected(v)
  }

  const { t } = useLanguage()

  return (
    <div className={styles.singleWrapper}>
      <p className={styles.question}>{question}</p>
      <ul className={styles.options}>
        {options.map((opt) => {
          let state = ''
          if (submitted_) {
            if (opt.value === correct) state = styles.optionCorrect
            else if (opt.value === value && !isCorrect) state = styles.optionWrong
          }
          return (
            <li key={opt.value}>
              <label className={`${styles.option} ${state}`}>
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={() => setValue(opt.value)}
                  disabled={submitted_}
                />
                <span className={styles.optionLetter}>{opt.value}</span>
                <span>{opt.label}</span>
              </label>
            </li>
          )
        })}
      </ul>
      {!hideSubmitButton && !submitted_ ? (
        <button
          type="button"
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={value === null}
        >
          {t('quiz.submit')}
        </button>
      ) : null}
      {submitted_ ? (
        <div className={styles.feedback}>
          <div className={isCorrect ? styles.feedbackCorrect : styles.feedbackWrong}>
            {isCorrect ? '✓ ' + t('quiz.correct') : '✗ ' + t('quiz.wrong')}
          </div>
          <div className={styles.explanation}>
            <strong>{t('quiz.explanation')}：</strong>
            {explanation}
          </div>
        </div>
      ) : null}
    </div>
  )
}

/** 单题模式：与原有用法兼容 */
export function Quiz(props: QuizQuestion) {
  return (
    <div className={styles.wrapper}>
      <h4 className={styles.title}>本课小测</h4>
      <SingleQuiz {...props} name="quiz-single" />
    </div>
  )
}

/** 用 ref 保存最新 onComplete，避免依赖 useEffect 闭包导致完成态未触发 */
function useOnCompleteRef(onComplete: (() => void) | undefined) {
  const ref = useRef(onComplete)
  ref.current = onComplete
  return ref
}

/** 多题模式：多道题 + 正确数汇总；多题时仅在最后一题底部显示一个【提交答案】按钮 */
export function QuizSet({
  questions,
  title = '本课小测',
  onComplete,
}: {
  questions: QuizQuestion[]
  title?: string
  /** 全部题目提交完成后回调 */
  onComplete?: () => void
}) {
  const isMulti = questions.length > 1
  const [selected, setSelected] = useState<(string | null)[]>(() => questions.map(() => null))
  const [allSubmitted, setAllSubmitted] = useState(false)
  const [singleScore, setSingleScore] = useState<boolean | null>(null)
  const onCompleteFired = useRef(false)
  const onCompleteRef = useOnCompleteRef(onComplete)

  const fireComplete = () => {
    if (onCompleteFired.current) return
    onCompleteFired.current = true
    onCompleteRef.current?.()
  }

  const { t } = useLanguage()
  const correctCount = isMulti && allSubmitted
    ? questions.filter((q, i) => selected[i] === q.correct).length
    : singleScore === true ? 1 : 0
  const allDone = isMulti ? allSubmitted : singleScore !== null

  useEffect(() => {
    if (allDone && !onCompleteFired.current) fireComplete()
  }, [allDone])

  if (questions.length === 0) return null

  if (!isMulti) {
    return (
      <div className={styles.wrapper}>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.setHint}>{t('quiz.completeHint', { n: 1 })}</p>
        <SingleQuiz
          {...questions[0]}
          name="quiz-0"
          onSubmit={(correct) => {
            setSingleScore(correct)
            fireComplete()
          }}
        />
        {singleScore !== null && (
          <div className={styles.summary}>
            <span className={singleScore ? styles.summaryPerfect : ''}>
              {t('quiz.summary', { correct: singleScore ? 1 : 0, total: 1 })}
            </span>
            {singleScore && ' 🎉'}
          </div>
        )}
      </div>
    )
  }

  const canSubmit = selected.every((s) => s !== null)
  const handleUnifiedSubmit = () => {
    if (!canSubmit) return
    setAllSubmitted(true)
    fireComplete()
  }

  return (
    <div className={styles.wrapper}>
      <h4 className={styles.title}>{title}</h4>
      <p className={styles.setHint}>{t('quiz.completeHint', { n: questions.length })}</p>
      {questions.map((q, i) => (
        <SingleQuiz
          key={i}
          {...q}
          name={`quiz-${i}`}
          controlledValue={selected[i]}
          onControlledChange={(v) => {
            setSelected((prev) => {
              const next = [...prev]
              next[i] = v
              return next
            })
          }}
          submittedOverride={allSubmitted}
          correctResult={selected[i] === q.correct}
          hideSubmitButton
        />
      ))}
      {!allSubmitted && (
        <div className={styles.unifiedSubmitWrap}>
          <button
            type="button"
            className={styles.submitBtn}
            onClick={handleUnifiedSubmit}
            disabled={!canSubmit}
          >
            {t('quiz.submit')}
          </button>
        </div>
      )}
      {allSubmitted && (
        <div className={styles.summary}>
          <span className={correctCount === questions.length ? styles.summaryPerfect : ''}>
            {t('quiz.summary', { correct: correctCount, total: questions.length })}
          </span>
          {correctCount === questions.length && ' 🎉'}
        </div>
      )}
    </div>
  )
}
