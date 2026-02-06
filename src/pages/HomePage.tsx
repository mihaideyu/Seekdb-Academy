import { Link } from 'react-router-dom'
import { getLessonsBySection, getLesson } from '@/curriculum'
import { EnvNotice } from '@/components/EnvNotice'
import styles from './HomePage.module.css'

export function HomePage() {
  const sections = getLessonsBySection()

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.h1}>欢迎来到 SeekDB 学院</h1>
      <p className={styles.subtitle}>
        动手练 + 小测验，像上课一样循序渐进，掌握 AI 原生向量数据库。
      </p>
      <EnvNotice compact />
      <div className={styles.path}>
        <h3>推荐学习路径</h3>
        <ol>
          <li>基础入门（约 30 分钟）：<Link to="/overview">第 1 课 概述</Link> → 连接方式 → 创建数据库/表</li>
          <li>核心功能：向量嵌入 → <Link to="/vector-search">向量搜索</Link> → 语义搜索 → 混合搜索</li>
          <li>高级应用：LLM 集成 → AI 函数 → 文本生成</li>
        </ol>
      </div>
      <h3 className={styles.sectionTitle}>全部课程</h3>
      <div className={styles.sectionList}>
        {sections.map(({ section, lessons: sectionLessons }) => (
          <div key={section} className={styles.sectionBlock}>
            <h4 className={styles.sectionBlockTitle}>{section}</h4>
            <ul className={styles.lessonList}>
              {sectionLessons.map((lesson) => (
                <li key={lesson.id}>
                  <Link to={lesson.path} className={styles.lessonCard}>
                    <span className={styles.lessonTitle}>{lesson.title}</span>
                    {lesson.prerequisites && lesson.prerequisites.length > 0 && (
                      <span className={styles.prereq}>
                        建议先学：{lesson.prerequisites.map((id) => getLesson(id)?.title).join('、')}
                      </span>
                    )}
                    <span className={styles.arrow}>进入课程 →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={styles.links}>
        <span className={styles.linkLabel}>延伸阅读：</span>
        <a href="https://www.oceanbase.ai/docs/develop-overview" target="_blank" rel="noopener noreferrer">
          官方文档
        </a>
        <a href="https://github.com/oceanbase/oceanbase" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </div>
    </div>
  )
}
