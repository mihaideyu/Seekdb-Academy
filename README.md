# SeekDB 交互式教程 - 完整优化版 Demo

基于对 [SeekDB 官方交互式教程](https://seekdb-playground.vercel.app/zh/overview) 的体验分析，本 Demo 实现了**完整交互式教程**的优化设计，覆盖易学、趣味性、内容质量与引导性。

## 改进点对照

| 维度 | 原分析建议 | Demo 实现 |
|------|------------|-----------|
| **易学** | 运行结果可自我校验 | 每个代码块支持 `expectedOutput`，点击「运行」展示**预期/模拟结果**（建表 OK、查询表格等） |
| | 环境说明 | **环境说明**组件：本教程在浏览器运行、无需安装；点击运行可查看模拟结果 |
| | 步骤说明与顺序 | 步骤 1–4 顺序、stepHint（上一步完成了什么）、试试看引导 |
| | 术语 Tooltip | `Term` 组件：OceanBase、向量嵌入、HNSW、余弦相似度等悬停解释 |
| **趣味性** | 学习进度 | 侧边栏进度条 + 每课「标记为已完成」+ 完成勾选 |
| | 多题测验与汇总 | **QuizSet**：每节 2–3 道题，提交后显示「你答对了 X/Y 题」及解析 |
| | 试试看 | 代码块下方「试试看」提示（改 limit、换问题、换距离函数等） |
| **内容质量** | 示例完整 | 概述/向量搜索中示例为完整句子；每块运行结果与步骤一致 |
| | 外链标注 | 首页底部标注「（外部资源）」 |
| **引导性** | 推荐下一步 | **NextStepCard**：学完本课后推荐 2–3 个下一步（如「体验 AI 工作流」「连接 SeekDB」「深入向量搜索」） |
| | 本节你将学会 | **SectionGoal**：每节开头列出本节目标 + 预计时间 + 建议先学 |
| | 上/下一课与前置 | 每课底部「上一课 / 下一课」+ 侧边栏/首页「需先学」 |
| | 首次访问 | 顶部横幅「第一次使用？从概述开始…本教程在浏览器即可学习，点击运行可查看模拟结果」+ 可关闭并持久化 |
| | 预计学习时间 | 课程元数据 `estimatedMinutes`，首页路径标注「约 30 分钟」、占位课显示「约 N 分钟」 |

## 运行方式

```bash
cd seekdb-tutorial-demo
npm install
npm run dev
```

浏览器打开 `http://localhost:5173`。

### 教程内 SQL 真实执行（可选）

本地 `npm run dev` 下代码块点击「运行」为**模拟结果**。若需在教程中**真实执行 SQL** 并展示结果：

1. **部署到 Vercel** 后，在项目环境变量中配置：
   - `DATABASE_URL` 或 `SEEKDB_DEMO_URL`：MySQL/SeekDB 连接串，格式 `mysql://user:password@host:port/database`
2. 前端默认请求同源 `/api/execute`；若执行接口在其他域名，可配置：
   - `VITE_EXECUTE_API_URL`：执行 API 的完整 URL（构建时注入）
3. 本地想联调真实执行时，可运行 `vercel dev`，并同样在 Vercel 项目或 `.env.local` 中配置上述变量。

**安全建议**：使用只读或仅含教程所需库/表的账号；生产环境建议对 `/api/execute` 做限流或 IP 白名单。

### Ask AI（基于官网文档问答）

顶栏「Ask AI」会基于 [SeekDB 官网文档](https://www.oceanbase.ai/docs/zh-CN/changelog/) 内容回答用户问题。部署到 Vercel 后，在环境变量中配置 **DEEPSEEK_API_KEY** 即可启用：接口会拉取文档页文本作为上下文，调用 DeepSeek（deepseek-chat）生成回答。未配置时面板会提示并引导用户查阅官方文档。

**本地开发时使用 Ask AI**（避免出现「网络错误」）任选其一即可：

- **方式一**：在项目根目录执行 `vercel dev`（需先 `npm i -g vercel` 并登录），在 `.env.local` 中配置 `DEEPSEEK_API_KEY`，本地会运行 Vercel Serverless，Ask AI 即可用。
- **方式二**：若项目已部署到 Vercel 且已配置 DEEPSEEK_API_KEY，可在本地创建 `.env` 或 `.env.local`，设置 `ASK_AI_PROXY_TARGET=https://你的部署域名.vercel.app`，再执行 `npm run dev`，前端请求的 `/api` 会被代理到该域名，Ask AI 即可用。

**推荐体验路径**：**首页**（环境说明 + 推荐路径）→ **概述**（环境说明、本节目标、4 步代码+预期结果、2 题测验、推荐下一步）→ **连接方式概览**（本节目标、Python/Node 示例+预期结果、2 题测验、推荐下一步）→ **向量搜索**（本节目标、3 步建表/插入/搜索+预期结果、2 题测验、推荐下一步）。可完整体验进度、标记完成、多题测验与下一步引导。

## 技术栈

- Vite + React 18 + TypeScript
- React Router 6
- 无 UI 库，纯 CSS Modules

## 目录结构

- `src/curriculum.ts`：课程元数据（前置、上下课、`estimatedMinutes`）
- `src/context/`：学习进度、首次访问引导
- `src/components/`：布局、进度条、**EnvNotice**、**SectionGoal**、**NextStepCard**、CodeBlock（含 `expectedOutput`）、**Quiz / QuizSet**、LessonNav、Term、StepBadge
- `src/pages/`：首页（含环境说明与路径时间）、概述、连接概览、向量搜索（以上为完整优化内容）、语义搜索与其余为占位
