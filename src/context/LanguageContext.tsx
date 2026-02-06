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
    'codeBlock.insertTableHint': '可切换「表格」查看插入后的数据。',
    'codeBlock.demoResult': 'Query OK (Demo 模拟结果)\n\n在实际 Playground 中会执行真实语句并返回结果。',
    'codeBlock.docOnlyOutput': '说明文档，无执行输出',
    'codeBlock.editableSnippetAria': '可编辑代码片段',
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
    'home.h1': '欢迎来到 SeekDB 学院',
    'home.subtitle': '动手练 + 小测验，像上课一样循序渐进，掌握 AI 原生向量数据库。',
    'home.pathTitle': '推荐学习路径',
    'home.pathItem1Intro': '基础入门（约 30 分钟）：',
    'home.pathLesson1': '第 1 课 概述',
    'home.pathConnect': '连接方式',
    'home.pathCreateDb': '创建数据库/表',
    'home.pathItem2Intro': '核心功能：',
    'home.pathEmbed': '向量嵌入',
    'home.pathVectorSearch': '向量搜索',
    'home.pathSemantic': '语义搜索',
    'home.pathHybrid': '混合搜索',
    'home.pathItem3Intro': '高级应用：',
    'home.pathLlm': 'LLM 集成',
    'home.pathAiFunc': 'AI 函数',
    'home.pathTextGen': '文本生成',
    'home.sectionTitle': '全部课程',
    'home.prereqLabel': '建议先学：',
    'home.enterCourse': '进入课程 →',
    'home.recentLearning': '最近学习',
    'home.sectionLabel': '专题',
    'home.chapterLabel': '章节',
    'home.continueLearning': '继续学习',
    'home.completed': '已完成',
    'home.allDone': '全部学完',
    'home.linksLabel': '延伸阅读：',
    'home.doc': '官方文档',
    'home.envNoticeTitle': '环境说明',
    'home.envNoticeText': '本课程在浏览器中即可学习，无需本地安装。代码块点击「运行」可查看模拟结果，用于自检；在真实环境会执行实际 SQL/SDK 并返回真实数据。',
    'placeholder.title': '课程内容开发中',
    'placeholder.desc': '这个课程模块正在紧张制作中，我们将尽快为您呈现高质量的交互式学习内容。',
    'placeholder.topicsTitle': '即将涵盖的主题：',
    'placeholder.topic1': '核心概念与原理',
    'placeholder.topic2': '实操步骤与示例代码',
    'placeholder.topic3': '最佳实践与常见问题',
    'placeholder.footerIntro': '完整内容与交互式代码可参考',
    'placeholder.footerLink': '官方 SeekDB 交互式课程',
    'placeholder.footerEnd': '。',
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
    'codeBlock.insertTableHint': 'Switch to Table view to see inserted data.',
    'codeBlock.demoResult': 'Query OK (Demo)\n\nIn a real Playground this would run the statement and return results.',
    'codeBlock.docOnlyOutput': 'Documentation only, no execution output',
    'codeBlock.editableSnippetAria': 'Editable code snippet',
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
    'home.h1': 'Welcome to SeekDB Academy',
    'home.subtitle': 'Hands-on practice and quizzes—step by step, master the AI-native vector database.',
    'home.pathTitle': 'Recommended learning path',
    'home.pathItem1Intro': 'Getting started (~30 min): ',
    'home.pathLesson1': 'Lesson 1 Overview',
    'home.pathConnect': 'Connect',
    'home.pathCreateDb': 'Create database/tables',
    'home.pathItem2Intro': 'Core: ',
    'home.pathEmbed': 'Vector embedding',
    'home.pathVectorSearch': 'Vector search',
    'home.pathSemantic': 'Semantic search',
    'home.pathHybrid': 'Hybrid search',
    'home.pathItem3Intro': 'Advanced: ',
    'home.pathLlm': 'LLM integration',
    'home.pathAiFunc': 'AI functions',
    'home.pathTextGen': 'Text generation',
    'home.sectionTitle': 'All courses',
    'home.prereqLabel': 'Prerequisites: ',
    'home.enterCourse': 'Enter course →',
    'home.recentLearning': 'Recent learning',
    'home.sectionLabel': 'Section',
    'home.chapterLabel': 'Lesson',
    'home.continueLearning': 'Continue',
    'home.completed': 'Done',
    'home.allDone': 'All done',
    'home.linksLabel': 'More: ',
    'home.doc': 'Docs',
    'home.envNoticeTitle': 'Environment',
    'home.envNoticeText': 'This course runs in the browser—no local setup. Click Run in code blocks to see simulated results for self-check; in a real environment, actual SQL/SDK runs and returns real data.',
    'placeholder.title': 'Content in development',
    'placeholder.desc': 'This module is being developed. We will bring you high-quality interactive content as soon as possible.',
    'placeholder.topicsTitle': 'Topics coming soon:',
    'placeholder.topic1': 'Core concepts and principles',
    'placeholder.topic2': 'Hands-on steps and code examples',
    'placeholder.topic3': 'Best practices and FAQ',
    'placeholder.footerIntro': 'For full content and interactive code, see the ',
    'placeholder.footerLink': 'official SeekDB interactive course',
    'placeholder.footerEnd': '.',
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
      return s === 'en' || s === 'zh' ? s : 'en'
    } catch (_) {}
    return 'en'
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
