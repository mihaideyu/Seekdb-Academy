import React, { createContext, useContext, useCallback, useState, useEffect } from 'react'

const STORAGE_KEY = 'seekdb-tutorial-lang'

export type Lang = 'zh' | 'en'

const messages: Record<Lang, Record<string, string>> = {
  zh: {
    'nav.doc': '文档',
    'nav.askAi': 'Ask AI',
    'nav.home': '首页',
    'nav.learningProgress': '学习进度',
    'app.title': 'SeekDB 学院',
    'layout.sectionDone': '本专题已全部完成',
    'layout.estimatedMinutes': '预计 {{n}} 分钟',
    'layout.minutesShort': '{{n}}分钟',
    'layout.pending': '待开发',
    'layout.menu': '菜单',
    'layout.menuClose': '收起目录',
    'codeBlock.hint': '提示',
    'codeBlock.run': '运行',
    'codeBlock.running': '运行中…',
    'codeBlock.tryIt': '试试看',
    'codeBlock.result': '执行结果',
    'codeBlock.raw': '原始',
    'codeBlock.table': '表格',
    'codeBlock.chart': '图表',
    'codeBlock.runToSeeResult': '运行查询以查看结果',
    'lessonNav.prev': '上一课',
    'lessonNav.next': '下一节',
    'lessonNav.markDone': '标记为已完成',
    'lessonNav.lastLesson': '已是最后一课',
    'quiz.completeHint': '完成下面 {{n}} 道题，巩固本节知识。',
    'quiz.submit': '提交答案',
    'quiz.correct': '回答正确',
    'quiz.wrong': '回答错误',
    'quiz.explanation': '解析',
    'quiz.summary': '你答对了 {{correct}}/{{total}} 题',
    'theme.system': '跟随系统',
    'theme.light': '浅色',
    'theme.dark': '深色',
    'theme.aria': '切换皮肤',
  },
  en: {
    'nav.doc': 'Docs',
    'nav.askAi': 'Ask AI',
    'nav.home': 'Home',
    'nav.learningProgress': 'Learning progress',
    'app.title': 'SeekDB Academy',
    'layout.sectionDone': 'Section completed',
    'layout.estimatedMinutes': '{{n}} min',
    'layout.minutesShort': '{{n}} min',
    'layout.pending': 'Coming soon',
    'layout.menu': 'Menu',
    'layout.menuClose': 'Close sidebar',
    'codeBlock.hint': 'Hint',
    'codeBlock.run': 'Run',
    'codeBlock.running': 'Running…',
    'codeBlock.tryIt': 'Try it',
    'codeBlock.result': 'Result',
    'codeBlock.raw': 'Raw',
    'codeBlock.table': 'Table',
    'codeBlock.chart': 'Chart',
    'codeBlock.runToSeeResult': 'Run to see result',
    'lessonNav.prev': 'Previous',
    'lessonNav.next': 'Next',
    'lessonNav.markDone': 'Mark complete',
    'lessonNav.lastLesson': 'Last lesson',
    'quiz.completeHint': 'Complete the {{n}} question(s) below.',
    'quiz.submit': 'Submit',
    'quiz.correct': 'Correct',
    'quiz.wrong': 'Incorrect',
    'quiz.explanation': 'Explanation',
    'quiz.summary': 'You got {{correct}}/{{total}} correct',
    'theme.system': 'System',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.aria': 'Toggle theme',
  },
}

type LanguageContextType = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY) as Lang | null
      return s === 'en' || s === 'zh' ? s : 'zh'
    } catch (_) {}
    return 'zh'
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch (_) {}
  }, [lang])

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.classList.remove('lang-zh', 'lang-en')
    document.documentElement.classList.add(`lang-${lang}`)
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
  }, [])

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      let s = messages[lang][key] ?? key
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          s = s.replace(new RegExp(`\\{\\{\\s*${k}\\s*\\}\\}`, 'g'), String(v))
        })
      }
      return s
    },
    [lang]
  )

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
