/**
 * Page-level copy for full-content lessons (Overview, AI Workflow, Connect, Vector Search, Semantic Search).
 * Keys follow page id; each page uses the slice for its lang.
 */
export type Lang = 'zh' | 'en'

export const overviewTexts: Record<Lang, Record<string, string>> = {
  zh: {
    h1: '欢迎使用 SeekDB',
    intro: 'SeekDB 是一个 AI 原生数据库，基于 OceanBase 引擎构建，提供向量搜索、语义搜索和全文搜索能力，支持通过 SDK 和 SQL 两种方式开发。',
    chooseDev: '选择开发方式',
    devPython: 'Python SDK (pyseekdb)',
    devPythonDesc: '适合 AI 流水线和数据科学。',
    devSql: 'SQL (MySQL 兼容驱动/ORM)',
    devSqlDesc: '适合后端逻辑和标准工具。',
    startTitle: '开始使用 SeekDB',
    startDesc: '使用前需先连接 SeekDB。按以下顺序完成 4 步即可完成从建库到搜索的完整流程。',
    step1Title: 'STEP1: 创建数据库和表',
    step1Desc: '执行后即可在后续步骤中使用 my_ai_app 与 documents 表。',
    step2Title: 'STEP2: 插入数据',
    step2Desc: '插入后即可在步骤 4 中做向量搜索。',
    step3Title: 'STEP3: 可选插入更多文档',
    step3Desc: '便于搜索时有更多结果。',
    step4Title: 'STEP4: 执行向量搜索',
    step4Desc: '依赖步骤 2（或 3）已插入的文档。',
    quizSection: '章节测试',
    quizDesc: '完成 1 道题，巩固本节知识。',
    lessonLabel: '第 {{n}} 课',
    devMode_stepHint: '本环境为演示环境，点击「运行」可看到模拟结果；真实环境需先安装 pyseekdb 并启动 SeekDB。',
    devMode_tryIt: '将 limit=10 改为 limit=5 再运行，观察返回条数的变化。',
    step2_stepHint: '第二步：依赖步骤 1 已创建的 documents 表。插入后即可在步骤 4 中做向量搜索。',
    step2_tryIt: '把 content 和 AI_EMBED 里的文本改成你自己的句子，再运行，体会「同义不同词」也能被搜到。',
    step4_stepHint: '第四步：依赖步骤 2（或 3）已插入的文档。相似度越小表示越相似。',
    step4_tryIt: '把 AI_EMBED(\'什么是机器学习\') 改成你的问题，例如「如何入门 AI」，再运行看结果排序变化。',
    step1_stepHint: '第一步：执行后即可在后续步骤中使用 my_ai_app 与 documents 表。',
    sqlMode_stepHint: 'SQL 方式：建表 → 插入（AI_EMBED 自动生成向量）→ 用 ↔ 做向量相似度排序。',
    embedPlaceholder: '在左侧选择一项任务，此处将展示对应的代码或测试题',
    quizQuestion: 'SeekDB 基于哪个数据库引擎构建？',
    quizOptA: 'MySQL',
    quizOptB: 'PostgreSQL',
    quizOptC: 'OceanBase',
    quizOptD: 'MongoDB',
    quizExplanation: 'SeekDB 基于 OceanBase 引擎构建，在其之上提供向量、语义搜索与 AI 函数等能力。',
  },
  en: {
    h1: 'Welcome to SeekDB',
    intro: 'SeekDB is an AI-native database built on OceanBase, offering vector search, semantic search, and full-text search, with SDK and SQL development options.',
    chooseDev: 'Choose development mode',
    devPython: 'Python SDK (pyseekdb)',
    devPythonDesc: 'For AI pipelines and data science.',
    devSql: 'SQL (MySQL-compatible driver/ORM)',
    devSqlDesc: 'For backend logic and standard tools.',
    startTitle: 'Get started with SeekDB',
    startDesc: 'Connect to SeekDB first. Complete the 4 steps below to go from database creation to search.',
    step1Title: 'STEP 1: Create database and table',
    step1Desc: 'Then you can use my_ai_app and documents in the next steps.',
    step2Title: 'STEP 2: Insert data',
    step2Desc: 'After insert, run vector search in step 4.',
    step3Title: 'STEP 3: Insert more documents (optional)',
    step3Desc: 'More data for richer search results.',
    step4Title: 'STEP 4: Run vector search',
    step4Desc: 'Depends on documents inserted in step 2 (or 3).',
    quizSection: 'Chapter quiz',
    quizDesc: 'Complete 1 question to reinforce this section.',
    lessonLabel: 'Lesson {{n}}',
    devMode_stepHint: 'This is a demo. Click Run to see simulated output; install pyseekdb and start SeekDB for a real run.',
    devMode_tryIt: 'Change limit=10 to limit=5 and run again to see the number of results change.',
    step2_stepHint: 'Step 2: Depends on the documents table from step 1. After insert, run vector search in step 4.',
    step2_tryIt: 'Change the content and AI_EMBED text to your own sentences, then run to see semantic search.',
    step4_stepHint: 'Step 4: Depends on documents inserted in step 2 (or 3). Lower distance means more similar.',
    step4_tryIt: 'Change AI_EMBED(\'什么是机器学习\') to your question (e.g. "How to start with AI") and run.',
    step1_stepHint: 'Step 1: After running, you can use my_ai_app and documents in the next steps.',
    sqlMode_stepHint: 'SQL flow: create table → insert (AI_EMBED generates vectors) → use ↔ for vector similarity sort.',
    embedPlaceholder: 'Select a task on the left to see the code or quiz here.',
    quizQuestion: 'Which database engine is SeekDB built on?',
    quizOptA: 'MySQL',
    quizOptB: 'PostgreSQL',
    quizOptC: 'OceanBase',
    quizOptD: 'MongoDB',
    quizExplanation: 'SeekDB is built on OceanBase and adds vector search, semantic search, and AI functions on top.',
  },
}

export const aiWorkflowTexts: Record<Lang, Record<string, string>> = {
  zh: {
    h1: 'AI 应用工作流',
    intro: '本课以 RAG（检索增强生成）为主线，带你用 SeekDB 串联数据准备、向量化、存储与索引、检索召回与 LLM 生成，走通从建表到生成回答的完整流程。',
    typicalTitle: '典型应用场景',
    scene1: '智能客服：基于企业知识库的智能问答，提供准确的客户支持',
    scene2: '文档问答：让用户通过自然语言查询大量文档内容',
    scene3: '语义搜索：超越关键词匹配，理解用户真正的搜索意图',
    scene4: '推荐系统：基于内容语义相似度的个性化推荐',
    ragOverview: 'RAG 工作流概览',
    step1Title: '数据准备',
    step1Desc: '分块、清洗（本课用简短示例代替，实际可用 Python 分块后批量插入）',
    step1Tip1: 'chunk_size 建议 300～800，适当 overlap 以提升上下文连贯性',
    step1Tip2: '考虑按段落、章节等自然边界分块',
    step2Title: '向量化',
    step2Desc: '插入时调用 AI_EMBED(content) 自动生成向量',
    step2Tip: '确保嵌入模型与 VECTOR(维度) 一致',
    step3Title: '存储与索引',
    step3Desc: '向量列 + HNSW 索引，可选全文索引做混合搜索',
    step4Title: '检索召回',
    step4Desc: '将用户问题向量化，按距离排序取 Top-K',
    step4Tip: '召回数通常 3～10；可结合全文/混合搜索与 Rerank 以提升检索准确率',
    step5Title: 'LLM 生成',
    step5Desc: '把上下文与问题拼成 prompt，调用 LLM 生成回答',
    practiceTitle2: '实战练习',
    practiceDesc: '按以下顺序完成 4 步即可完成从建表到检索、生成的完整 RAG 流程。',
    taskStep1Title: 'STEP1: 创建知识库表与索引',
    taskStep1Desc: '执行后得到 knowledge_base 表及索引，之后才能插入数据。',
    taskStep2Title: 'STEP2: 插入文档并自动向量化',
    taskStep2Desc: '依赖 Step 1 已建表。插入时用 AI_EMBED 自动生成向量。',
    taskStep3Title: 'STEP3: 设置查询并做向量检索',
    taskStep3Desc: '依赖 Step 2 已插入数据。按余弦距离排序取最相关文档。',
    taskStep4Title: 'STEP4: 用检索结果生成回答',
    taskStep4Desc: '依赖 Step 3 已执行并设置 @query。用 AI_GENERATE 基于上下文生成。',
    taskExtraTitle: '数据准备补充：Python 分块示例',
    taskExtraDesc: '理解分块概念；完成本课只需执行 Step 1～4 的 SQL。',
    quizSection: '章节测试',
    quizTaskTitle: '章节测试',
    quizDesc: '完成 1 道题，巩固 RAG 流程理解。',
    quizQuestion: 'RAG 流程中，为什么要先「检索」再「生成」？',
    quizOptA: '因为 LLM 只能处理短文本',
    quizOptB: '用检索到的知识作为上下文，让 LLM 基于事实回答，减少幻觉',
    quizOptC: '检索可以替代 LLM',
    quizOptD: '没有顺序要求，先生成再检索也可以',
    quizExplanation: 'RAG（检索增强生成）先从未知库中检索与问题相关的片段，再把这些片段作为上下文交给 LLM 生成答案，这样回答有据可依，减少凭空编造。',
    lessonLabel: '第 {{n}} 课',
    termRag: 'Retrieval-Augmented Generation，先检索相关文档再交给 LLM 生成答案',
    termVec: '将文本转换为高维向量的过程',
    termDataPrep: '将文档切分为适合检索的文本块，如 300～800 字符一块',
    termVectorization: '用 AI_EMBED 等将文本转为高维向量',
    termStorage: 'HNSW 等图索引加速近似最近邻搜索',
    termRetrieval: '用 COSINE_DISTANCE 等找到最相关的文档',
    termLlm: '用 AI_GENERATE 将检索结果作为上下文生成回答',
    embedPlaceholder: '在左侧选择一项任务，此处将展示对应的代码或测试题',
    step1_hint: '第一步：执行后得到 knowledge_base 表及索引，之后才能插入数据。',
    step1_tryIt: '生产环境可调 M、ef_construction；向量维度 1536 需与当前嵌入模型一致。',
    step2_hint: '第二步：依赖 Step 1 已建表。实际场景可先用 Python 分块（chunk_size 约 300～800），再批量 INSERT。',
    step2_tryIt: '增加一条你自己写的 title/content，或修改现有内容，再在 Step 3 用不同问句检索。',
    step3_hint: '第三步：依赖 Step 2 已插入数据。必须先 SET @query，Step 4 的 AI_GENERATE 会引用同一变量。',
    step3_tryIt: '修改 @query 为其他问题，观察排序变化；或改为 LIMIT 3，与 Step 4 召回数一致。',
    step4_hint: '第四步：依赖 Step 3 已执行并设置 @query。若未设置 @query，请先执行 Step 3 的前两行。',
    step4_tryIt: '调整 LIMIT 3 为 5 或 1，观察回答长度与质量变化；或修改 prompt 中的指令。',
    extra_hint: '仅作理解分块用；在 Playground 中完成本课只需执行上面 Step 1～4 的 SQL。',
    extra_tryIt: 'chunk_size 建议 300～800，overlap 保持上下文连贯。',
  },
  en: {
    h1: 'AI Application Workflow',
    intro: 'This lesson follows the RAG (Retrieval-Augmented Generation) pipeline: data preparation, vectorization, storage & indexing, retrieval, and LLM generation with SeekDB.',
    typicalTitle: 'Typical use cases',
    scene1: 'Smart support: Q&A over enterprise knowledge base for accurate customer support.',
    scene2: 'Document Q&A: Let users query large document collections in natural language.',
    scene3: 'Semantic search: Beyond keyword matching to understand user intent.',
    scene4: 'Recommendation: Content-based similarity for personalized recommendations.',
    ragOverview: 'RAG workflow overview',
    step1Title: 'Data preparation',
    step1Desc: 'Chunking and cleaning (this lesson uses a short example; use Python chunking for batch insert in practice).',
    step1Tip1: 'chunk_size 300–800 with some overlap for better context continuity.',
    step1Tip2: 'Consider chunking by paragraph or section boundaries.',
    step2Title: 'Vectorization',
    step2Desc: 'Call AI_EMBED(content) on insert to generate vectors.',
    step2Tip: 'Keep embedding model and VECTOR(dim) in sync.',
    step3Title: 'Storage & indexing',
    step3Desc: 'Vector column + HNSW index; optional full-text index for hybrid search.',
    step4Title: 'Retrieval',
    step4Desc: 'Vectorize the user question, sort by distance, take Top-K.',
    step4Tip: 'Recall count usually 3–10; combine with full-text/hybrid search and Rerank for better accuracy.',
    step5Title: 'LLM generation',
    step5Desc: 'Combine context and question into a prompt, call LLM to generate the answer.',
    practiceTitle2: 'Hands-on',
    practiceDesc: 'Complete the 4 steps below to run the full RAG flow from table creation to generation.',
    taskStep1Title: 'STEP 1: Create knowledge base table and index',
    taskStep1Desc: 'After running, you get the knowledge_base table and indexes for the next steps.',
    taskStep2Title: 'STEP 2: Insert documents and vectorize',
    taskStep2Desc: 'Depends on Step 1. AI_EMBED generates vectors on insert.',
    taskStep3Title: 'STEP 3: Set query and run vector retrieval',
    taskStep3Desc: 'Depends on Step 2. Sort by cosine distance for most relevant docs.',
    taskStep4Title: 'STEP 4: Generate answer from retrieval results',
    taskStep4Desc: 'Depends on Step 3 and @query. Use AI_GENERATE with context.',
    taskExtraTitle: 'Data prep: Python chunking example',
    taskExtraDesc: 'Understand chunking; completing this lesson only requires running Step 1–4 SQL.',
    quizSection: 'Chapter quiz',
    quizTaskTitle: 'Chapter quiz',
    quizDesc: 'Complete 1 question to reinforce RAG.',
    quizQuestion: 'In RAG, why retrieve first, then generate?',
    quizOptA: 'Because LLMs can only handle short text',
    quizOptB: 'Use retrieved knowledge as context so the LLM answers from facts and reduces hallucination',
    quizOptC: 'Retrieval can replace the LLM',
    quizOptD: 'Order does not matter; generate then retrieve is fine',
    quizExplanation: 'RAG retrieves relevant passages first, then feeds them as context to the LLM so answers are grounded and less made-up.',
    lessonLabel: 'Lesson {{n}}',
    termRag: 'Retrieval-Augmented Generation: retrieve relevant docs then pass to LLM to generate the answer.',
    termVec: 'Process of converting text into high-dimensional vectors.',
    termDataPrep: 'Split documents into retrievable chunks, e.g. 300–800 chars per chunk.',
    termVectorization: 'Use AI_EMBED etc. to turn text into vectors.',
    termStorage: 'HNSW and similar indexes for approximate nearest neighbor search.',
    termRetrieval: 'Use COSINE_DISTANCE etc. to find the most relevant docs.',
    termLlm: 'Use AI_GENERATE to generate the answer from retrieved context.',
    embedPlaceholder: 'Select a task on the left to see the code or quiz here.',
    step1_hint: 'Step 1: After running, you get the knowledge_base table and indexes for the next steps.',
    step1_tryIt: 'Tune M and ef_construction in production; vector dim 1536 must match your embedding model.',
    step2_hint: 'Step 2: Depends on Step 1. In practice, chunk in Python (chunk_size ~300–800) then batch INSERT.',
    step2_tryIt: 'Add your own title/content or edit existing rows, then try different queries in Step 3.',
    step3_hint: 'Step 3: Depends on Step 2. You must SET @query; Step 4 AI_GENERATE uses the same variable.',
    step3_tryIt: 'Change @query to another question or set LIMIT 3 to match Step 4 recall.',
    step4_hint: 'Step 4: Depends on Step 3 and @query. Run Step 3 first if @query is not set.',
    step4_tryIt: 'Try LIMIT 5 or 1, or change the prompt instructions.',
    extra_hint: 'For understanding only; completing this lesson only requires running Step 1–4 SQL.',
    extra_tryIt: 'chunk_size 300–800 and some overlap for context continuity.',
  },
}

export const connectOverviewTexts: Record<Lang, Record<string, string>> = {
  zh: {
    h1: '连接概览',
    intro: '本课介绍连接 SeekDB 的几种方式：Python SDK、MySQL 兼容驱动与 ORM、连接池等，可按项目需求选择。',
    waysTitle: '连接方式一览',
    way1: '通过客户端连接：使用 pyseekdb Python SDK',
    way2: '通过驱动或 ORM 连接：使用 MySQL 兼容驱动或 ORM 框架',
    way3: '使用连接池：配置和使用数据库连接池以优化性能',
    practiceTitle: '实战练习',
    practiceDesc: '选择下方任务，在右侧运行代码。',
    taskPythonTitle: 'Python SDK 连接示例',
    taskPythonDesc: '使用 pyseekdb 连接 SeekDB，执行简单查询验证连接。',
    taskNodeTitle: 'MySQL 驱动连接示例（Node.js）',
    taskNodeDesc: '使用 mysql2 通过 MySQL 协议连接 SeekDB。',
    quizSection: '章节测试',
    quizTaskTitle: '章节测试',
    quizDesc: '完成 2 道题，巩固连接方式知识。',
    quiz1Question: '下列哪种方式可以直接用 MySQL 客户端连接 SeekDB？',
    quiz1A: '仅 pyseekdb',
    quiz1B: 'MySQL 兼容驱动或 ORM',
    quiz1C: '只能通过专用 SDK',
    quiz1D: '无法用 MySQL 协议连接',
    quiz1Explanation: 'SeekDB 兼容 MySQL 协议，因此任何 MySQL 驱动（如 PyMySQL、mysql2）或 ORM（如 SQLAlchemy、Sequelize）都可以连接，无需专用 SDK。',
    quiz2Question: '在生产环境中，为什么常会使用连接池？',
    quiz2A: '为了加密连接',
    quiz2B: '复用连接、减少建连开销，提高并发性能',
    quiz2C: '为了自动备份',
    quiz2D: '连接池是 SeekDB 强制要求的',
    quiz2Explanation: '连接池通过复用已建立的连接，避免每次请求都创建新连接，从而降低延迟、提高吞吐，适合高并发场景。',
    lessonLabel: '第 {{n}} 课',
    embedPlaceholder: '在左侧选择一项任务，此处将展示对应的代码或测试题',
    python_hint: '本地需先启动 SeekDB 并填写正确 host/port/password。',
    node_hint: 'SeekDB 兼容 MySQL 协议，任何 MySQL 驱动均可使用。',
  },
  en: {
    h1: 'Connect overview',
    intro: 'This lesson covers how to connect to SeekDB: Python SDK, MySQL-compatible drivers/ORMs, and connection pools.',
    waysTitle: 'Connection options',
    way1: 'Client: use pyseekdb Python SDK',
    way2: 'Driver/ORM: use MySQL-compatible drivers or ORM frameworks',
    way3: 'Connection pool: configure and use connection pooling for better performance',
    practiceTitle: 'Hands-on',
    practiceDesc: 'Choose a task and run the code on the right.',
    taskPythonTitle: 'Python SDK connection example',
    taskPythonDesc: 'Use pyseekdb to connect to SeekDB and run a simple query.',
    taskNodeTitle: 'MySQL driver example (Node.js)',
    taskNodeDesc: 'Use mysql2 to connect to SeekDB via MySQL protocol.',
    quizSection: 'Chapter quiz',
    quizTaskTitle: 'Chapter quiz',
    quizDesc: 'Complete 2 questions on connection options.',
    quiz1Question: 'Which option allows connecting to SeekDB with a MySQL client?',
    quiz1A: 'Only pyseekdb',
    quiz1B: 'MySQL-compatible driver or ORM',
    quiz1C: 'Only a dedicated SDK',
    quiz1D: 'MySQL protocol is not supported',
    quiz1Explanation: 'SeekDB is MySQL-protocol compatible, so any MySQL driver (e.g. PyMySQL, mysql2) or ORM (e.g. SQLAlchemy, Sequelize) can connect.',
    quiz2Question: 'Why use a connection pool in production?',
    quiz2A: 'To encrypt connections',
    quiz2B: 'Reuse connections, reduce connect overhead, improve concurrency',
    quiz2C: 'For automatic backup',
    quiz2D: 'SeekDB requires it',
    quiz2Explanation: 'Connection pools reuse existing connections to avoid creating new ones per request, reducing latency and improving throughput.',
    lessonLabel: 'Lesson {{n}}',
    embedPlaceholder: 'Select a task on the left to see the code or quiz here.',
    python_hint: 'Start SeekDB locally and set host/port/password correctly.',
    node_hint: 'SeekDB is MySQL-protocol compatible; any MySQL driver works.',
  },
}

export const vectorSearchTexts: Record<Lang, Record<string, string>> = {
  zh: {
    h1: '向量搜索',
    intro: '本课学习 SeekDB 的向量搜索：通过向量相似度找到语义相关的内容，并理解语义含义与距离函数、HNSW 索引的用法。',
    introTerm: '例如「汽车」和「车辆」虽用词不同，向量距离仍较近',
    conceptsTitle: '核心概念',
    concept1: '向量嵌入 (Embedding)：将文本转换为高维向量',
    concept1Tip: '将文本转换为高维向量的过程，如 1536 维的 OpenAI embedding',
    concept2: '余弦相似度：衡量两个向量夹角的方法',
    concept2Tip: '衡量两个向量夹角，值越接近 1 表示越相似',
    concept3: 'L2 距离：欧几里得距离',
    concept3Tip: '欧几里得距离，衡量两向量直线距离',
    concept4: '向量索引 (如 HNSW)：加速向量搜索的数据结构',
    concept4Tip: 'Hierarchical Navigable Small World，用于加速近似最近邻搜索的图索引',
    practiceTitle: '实战练习',
    practiceDesc: '先创建表与索引，再插入数据，最后执行向量搜索。',
    taskStep1Title: 'STEP1: 创建表与索引',
    taskStep1Desc: '执行后得到 articles 表及 HNSW 索引，后续步骤将向表中插入数据。',
    taskStep2Title: 'STEP2: 插入数据',
    taskStep2Desc: '依赖步骤 1 的 articles 表。插入后即可在步骤 3 中做向量搜索。',
    taskStep3Title: 'STEP3: 执行向量搜索',
    taskStep3Desc: '依赖步骤 2 已插入的数据。distance 越小表示越相似。',
    quizSection: '章节测试',
    quizTaskTitle: '章节测试',
    quizDesc: '完成 2 道题，巩固向量搜索与距离函数知识。',
    quiz1Question: '在向量搜索中，余弦距离值为 0 表示什么？',
    quiz1A: '两个向量完全不相关',
    quiz1B: '两个向量完全相同（方向一致）',
    quiz1C: '两个向量正交（垂直）',
    quiz1D: '两个向量方向相反',
    quiz1Explanation: '余弦距离 = 1 - 余弦相似度。当两个向量方向完全一致时，余弦相似度为 1，余弦距离为 0，表示最相似。',
    quiz2Question: 'HNSW 索引的主要作用是什么？',
    quiz2A: '压缩存储向量',
    quiz2B: '加速近似最近邻搜索，减少全量比对',
    quiz2C: '加密向量数据',
    quiz2D: '自动生成向量',
    quiz2Explanation: 'HNSW（Hierarchical Navigable Small World）是一种图索引，用于高效近似最近邻搜索，在保证召回质量的前提下大幅减少需要比对的向量数量。',
    distanceTitle: '距离函数对比',
    distanceFunc: '函数',
    distanceScene: '适用场景',
    distanceOrder: '排序方式',
    cosRow: 'COSINE_DISTANCE',
    cosScene: '文本相似度、推荐系统',
    cosOrder: 'ASC（越小越相似）',
    l2Row: 'L2_DISTANCE',
    l2Scene: '图像搜索、聚类分析',
    l2Order: 'ASC（越小越相似）',
    ipRow: 'INNER_PRODUCT',
    ipScene: '归一化向量、打分排序',
    ipOrder: 'DESC（越大越相似）',
    lessonLabel: '第 {{n}} 课',
    embedPlaceholder: '在左侧选择一项任务，此处将展示对应的代码或测试题',
    step1_stepHint: '第一步：执行后得到 articles 表及 HNSW 索引，后续步骤将向表中插入数据。',
    step1_tryIt: '了解参数：M 控制每节点邻居数，ef_construction 影响建索引时的搜索范围，生产环境可按文档调优。',
    step2_stepHint: '第二步：依赖步骤 1 的 articles 表。插入后即可在步骤 3 中做向量搜索。',
    step2_tryIt: '增加一条你自己写的 title 和 content，再在下一步用不同问句搜索，观察排序结果。',
    step3_stepHint: '第三步：依赖步骤 2 已插入的数据。distance 越小表示越相似。',
    step3_tryIt: '改用 L2_DISTANCE 或 INNER_PRODUCT 对比同一查询的结果排序（注意排序方向：L2/余弦用 ASC，内积用 DESC）。',
  },
  en: {
    h1: 'Vector search',
    intro: 'This lesson covers vector search in SeekDB: finding semantically similar content via vector similarity, and the use of distance functions and HNSW index.',
    introTerm: 'e.g. "car" and "vehicle" differ in wording but have a close vector distance',
    conceptsTitle: 'Concepts',
    concept1: 'Vector embedding: convert text to high-dimensional vectors',
    concept1Tip: 'Process of converting text to vectors, e.g. 1536-dim OpenAI embedding',
    concept2: 'Cosine similarity: measure the angle between two vectors',
    concept2Tip: 'Closer to 1 means more similar',
    concept3: 'L2 distance: Euclidean distance',
    concept3Tip: 'Euclidean distance between two vectors',
    concept4: 'Vector index (e.g. HNSW): speeds up vector search',
    concept4Tip: 'Hierarchical Navigable Small World graph index for approximate nearest neighbor search',
    practiceTitle: 'Hands-on',
    practiceDesc: 'Create table and index, insert data, then run vector search.',
    taskStep1Title: 'STEP 1: Create table and index',
    taskStep1Desc: 'After running, you get the articles table and HNSW index for the next steps.',
    taskStep2Title: 'STEP 2: Insert data',
    taskStep2Desc: 'Depends on step 1. After insert, run vector search in step 3.',
    taskStep3Title: 'STEP 3: Run vector search',
    taskStep3Desc: 'Depends on step 2. Lower distance means more similar.',
    quizSection: 'Chapter quiz',
    quizTaskTitle: 'Chapter quiz',
    quizDesc: 'Complete 2 questions on vector search and distance functions.',
    quiz1Question: 'In vector search, cosine distance 0 means what?',
    quiz1A: 'Vectors are unrelated',
    quiz1B: 'Vectors are identical (same direction)',
    quiz1C: 'Vectors are orthogonal',
    quiz1D: 'Vectors point in opposite directions',
    quiz1Explanation: 'Cosine distance = 1 - cosine similarity. When directions match, similarity is 1 and distance is 0.',
    quiz2Question: 'What is the main role of HNSW index?',
    quiz2A: 'Compress vector storage',
    quiz2B: 'Speed up approximate nearest neighbor search, avoid full scan',
    quiz2C: 'Encrypt vectors',
    quiz2D: 'Generate vectors automatically',
    quiz2Explanation: 'HNSW is a graph index for efficient approximate nearest neighbor search while keeping recall quality.',
    distanceTitle: 'Distance functions',
    distanceFunc: 'Function',
    distanceScene: 'Use case',
    distanceOrder: 'Sort',
    cosRow: 'COSINE_DISTANCE',
    cosScene: 'Text similarity, recommendation',
    cosOrder: 'ASC (lower = more similar)',
    l2Row: 'L2_DISTANCE',
    l2Scene: 'Image search, clustering',
    l2Order: 'ASC (lower = more similar)',
    ipRow: 'INNER_PRODUCT',
    ipScene: 'Normalized vectors, scoring',
    ipOrder: 'DESC (higher = more similar)',
    lessonLabel: 'Lesson {{n}}',
    embedPlaceholder: 'Select a task on the left to see the code or quiz here.',
    step1_stepHint: 'Step 1: After running, you get the articles table and HNSW index; the next steps will insert data.',
    step1_tryIt: 'Parameters: M controls neighbors per node, ef_construction affects build-time search; tune per docs in production.',
    step2_stepHint: 'Step 2: Depends on the articles table from step 1. After insert, run vector search in step 3.',
    step2_tryIt: 'Add your own title and content, then run a different query in the next step and observe the order.',
    step3_stepHint: 'Step 3: Depends on data inserted in step 2. Lower distance means more similar.',
    step3_tryIt: 'Try L2_DISTANCE or INNER_PRODUCT and compare sort order (L2/cosine: ASC; inner product: DESC).',
  },
}

export const semanticSearchTexts: Record<Lang, Record<string, string>> = {
  zh: {
    h1: '语义搜索',
    intro: '语义搜索在向量搜索基础上，更贴近自然语言意图，适合问答、推荐等场景。建议先完成「向量搜索」课程再学习本节。',
    note: '（本 Demo 仅展示概述、连接概览、AI 工作流、向量搜索等页的完整优化效果，本节为概览页。）',
    placeholder: '本节为概览，无实操任务；完整内容可参考官方 SeekDB 交互式课程。',
    lessonLabel: '第 {{n}} 课',
  },
  en: {
    h1: 'Semantic search',
    intro: 'Semantic search builds on vector search and fits natural language intent, suitable for Q&A and recommendation. Complete the vector search lesson first.',
    note: '(This demo shows full content for overview, connect, AI workflow, vector search; this section is a short overview.)',
    placeholder: 'This section is an overview with no hands-on tasks; see the official SeekDB interactive course for full content.',
    lessonLabel: 'Lesson {{n}}',
  },
}

/** Shared keys for pages that only need lessonLabel + embedPlaceholder */
export const commonPageTexts: Record<Lang, Record<string, string>> = {
  zh: { lessonLabel: '第 {{n}} 课', embedPlaceholder: '在左侧选择一项任务，此处将展示对应的代码或测试题' },
  en: { lessonLabel: 'Lesson {{n}}', embedPlaceholder: 'Select a task on the left to see the code or quiz here.' },
}

export const embeddingOverviewTexts: Record<Lang, Record<string, string>> = {
  zh: {
    h1: '向量嵌入概述',
    intro: '向量嵌入（Vector Embedding）是将文本、图像等非结构化数据转换为高维数值向量的技术，能够捕获数据的语义信息，使计算机可以理解和比较内容含义。',
    introLink: '官方向量嵌入概述课程',
    conceptsTitle: '核心概念',
    concept1: '嵌入模型：OpenAI、Cohere、通义、本地 BGE/M3E 等',
    concept2: '向量维度：常见 384/768/1536/3072，影响表达能力与成本',
    concept3: '在 seekdb 中：内置 AI_EMBED 函数，支持外部模型',
    practiceTitle: '实战练习',
    practiceDesc: '按顺序了解概念 → AI_EMBED 用法 → 模型对比 → 最佳实践 → 章节测试。',
    taskIntro: '向量嵌入说明',
    taskIntroDesc: '将文本等非结构化数据转为高维数值向量，捕获语义信息。',
    taskConcepts: '核心概念',
    taskConceptsDesc: '嵌入模型、向量维度、为何需要向量嵌入（语义相似性）。',
    taskAiEmbed: '在 seekdb 中使用 AI_EMBED',
    taskAiEmbedDesc: 'SELECT/INSERT/查询中调用 AI_EMBED 与 COSINE_DISTANCE。',
    taskModels: '主流嵌入模型对比',
    taskModelsDesc: 'OpenAI、BGE-M3、M3E 等维度与特点简述。',
    taskBest: '最佳实践',
    taskBestDesc: '选模型、保持模型一致、批量处理优化。',
    quizSection: '章节测试',
    quizDesc: '完成 1 道题，巩固向量嵌入特点。',
    quizQuestion: '以下哪个选项正确描述了向量嵌入的特点？',
    quizA: '向量维度越高，计算速度越快',
    quizB: '不同嵌入模型生成的向量可以直接比较',
    quizC: '语义相似的文本会有相近的向量表示',
    quizD: '向量嵌入只能处理英文文本',
    quizExplanation: '向量嵌入的核心是捕获语义：语义相似的文本在向量空间中距离更近；维度越高通常计算成本越高；不同模型生成的向量不可直接比较；多语言模型可处理中文等。',
    lessonLabel: '第 {{n}} 课',
    embedPlaceholder: '在左侧选择一项任务，此处将展示对应的代码或测试题',
    intro_stepHint: '传统关键词匹配无法理解语义，向量嵌入使搜索更智能。',
    concepts_stepHint: '存储与查询须使用同一嵌入模型，否则向量不可比。',
    aiEmbed_stepHint: 'seekdb 内置 AI_EMBED，自动调用已配置的嵌入模型；需先建好含 embedding 列的表。',
    models_stepHint: '中文场景可选用 BGE-M3 或 M3E；通用场景可选 OpenAI text-embedding-3-small。',
    bestPractice_stepHint: '切换模型需重新生成所有已有向量；大批量时用 LIMIT 分批避免超时。',
  },
  en: {
    h1: 'Embedding overview',
    intro: 'Vector embedding converts unstructured data (text, images) into high-dimensional vectors that capture semantic information so machines can understand and compare content.',
    introLink: 'Official embedding overview course',
    conceptsTitle: 'Concepts',
    concept1: 'Embedding models: OpenAI, Cohere, local BGE/M3E, etc.',
    concept2: 'Dimensions: 384/768/1536/3072; trade off expressiveness and cost',
    concept3: 'In SeekDB: built-in AI_EMBED, plus external models',
    practiceTitle: 'Hands-on',
    practiceDesc: 'Concepts → AI_EMBED usage → model comparison → best practices → quiz.',
    taskIntro: 'Embedding intro',
    taskIntroDesc: 'Turn text into high-dimensional vectors and capture semantics.',
    taskConcepts: 'Concepts',
    taskConceptsDesc: 'Models, dimensions, and why we need embeddings.',
    taskAiEmbed: 'Using AI_EMBED in SeekDB',
    taskAiEmbedDesc: 'Call AI_EMBED and COSINE_DISTANCE in SELECT/INSERT/queries.',
    taskModels: 'Embedding models comparison',
    taskModelsDesc: 'OpenAI, BGE-M3, M3E dimensions and traits.',
    taskBest: 'Best practices',
    taskBestDesc: 'Choose model, keep it consistent, batch for efficiency.',
    quizSection: 'Chapter quiz',
    quizDesc: 'Complete 1 question on embeddings.',
    quizQuestion: 'Which correctly describes vector embeddings?',
    quizA: 'Higher dimension means faster computation',
    quizB: 'Vectors from different models can be compared directly',
    quizC: 'Semantically similar text has similar vector representation',
    quizD: 'Embeddings only work for English',
    quizExplanation: 'Embeddings capture semantics: similar meaning → closer in vector space; higher dim often means higher cost; different models are not comparable.',
    lessonLabel: 'Lesson {{n}}',
    embedPlaceholder: 'Select a task on the left to see the code or quiz here.',
    intro_stepHint: 'Keyword matching cannot capture semantics; vector embeddings make search smarter.',
    concepts_stepHint: 'Use the same embedding model for storage and query, or vectors are not comparable.',
    aiEmbed_stepHint: 'SeekDB has built-in AI_EMBED; ensure the table has an embedding column.',
    models_stepHint: 'For Chinese, consider BGE-M3 or M3E; for general use, OpenAI text-embedding-3-small.',
    bestPractice_stepHint: 'Switching models requires regenerating all vectors; use LIMIT for large batches to avoid timeouts.',
  },
}

export const hybridSearchTexts: Record<Lang, Record<string, string>> = {
  zh: {
    h1: '混合搜索',
    intro: '混合搜索结合了向量搜索和全文搜索的优势，既能理解语义含义，又能精确匹配关键词，提供更准确的搜索结果。',
    introLink: '官方混合搜索课程',
    whyTitle: '为什么需要混合搜索？',
    whyVec: '单独向量搜索：可能忽略精确关键词、对专有名词/型号处理不佳',
    whyFull: '单独全文搜索：无法理解同义词与语义，依赖用户输入准确关键词',
    whyHybrid: '混合优势：既能理解「手机卡顿」与「手机运行慢」的语义相似，又能精确匹配「iPhone 15」等专有名词',
    practiceTitle: '实战练习',
    practiceDesc: '按顺序：了解动机 → 建表（全文+向量索引）→ 插入数据 → 执行加权融合混合搜索 → 了解融合策略与最佳实践 → 章节测试。',
    taskWhy: '为什么需要混合搜索',
    taskWhyDesc: '向量搜索与全文搜索各自的局限，混合后兼顾语义与关键词。',
    taskCreate: '创建支持混合搜索的表',
    taskCreateDesc: '表内同时建全文索引与向量索引（HNSW）。',
    taskInsert: '插入测试数据',
    taskInsertDesc: '插入产品数据并生成 embedding，供混合搜索使用。',
    taskQuery: '执行混合搜索（加权融合）',
    taskQueryDesc: '用 CTE 分别做向量得分与全文得分，再按权重融合排序。',
    taskStrategy: '融合策略对比',
    taskStrategyDesc: '加权融合、RRF 融合、Rerank 的优缺点与适用场景。',
    taskBest: '最佳实践',
    taskBestDesc: '权重选择建议与性能优化（召回 + 精排）。',
    quizSection: '章节测试',
    quizDesc: '完成 1 道题，巩固 RRF 与混合搜索知识。',
    quizQuestion: 'RRF (Reciprocal Rank Fusion) 算法的主要特点是什么？',
    quizA: '需要手动设置权重参数',
    quizB: '基于排名而非原始得分进行融合',
    quizC: '只能用于向量搜索',
    quizD: '计算复杂度很高',
    quizExplanation: 'RRF 基于各路结果的排名（rank）进行融合，不依赖原始得分量纲，无需调参，效果稳定，适用于向量搜索与全文搜索等多种结果的融合。',
    lessonLabel: '第 {{n}} 课',
    embedPlaceholder: '在左侧选择一项任务，此处将展示对应的代码或测试题',
    taskWhy_stepHint: '混合搜索 = 向量搜索 + 全文搜索，兼顾语义与关键词。',
    taskCreate_stepHint: '第一步：表内既有 FULLTEXT 索引（name, description），又有 HNSW 向量索引，才能做混合搜索。',
    taskCreate_tryIt: '可增加一列 price DECIMAL(10,2)，或调整 FULLTEXT 覆盖的列。',
    taskInsert_stepHint: '第二步：依赖上一步的 products 表。插入后即可在下一步做混合搜索。',
    taskInsert_tryIt: '再插入几条产品，用不同 category，便于测试全文与向量组合效果。',
    taskQuery_stepHint: '第三步：依赖上一步已插入的数据。向量得分用 (1 - 余弦距离) 转为相似度，再与全文得分加权。',
    taskQuery_tryIt: '调整 0.6/0.4 权重，或改用 MATCH(...) AGAINST 不同关键词，观察排序变化。',
    taskStrategy_stepHint: 'RRF 基于排名融合，不依赖得分量纲；Rerank 需调用重排模型，延迟更高。',
    taskBest_stepHint: '先召回再精排可控制计算量；权重可根据业务 A/B 测试调优。',
  },
  en: {
    h1: 'Hybrid search',
    intro: 'Hybrid search combines vector and full-text search: semantic understanding plus exact keyword matching for better results.',
    introLink: 'Official hybrid search course',
    whyTitle: 'Why hybrid search?',
    whyVec: 'Vector alone: can miss exact keywords and proper nouns',
    whyFull: 'Full-text alone: no synonym or semantic understanding',
    whyHybrid: 'Hybrid: semantic similarity (e.g. "phone slow") plus exact match (e.g. "iPhone 15")',
    practiceTitle: 'Hands-on',
    practiceDesc: 'Motivation → create table (full-text + vector index) → insert → weighted hybrid query → strategies & best practices → quiz.',
    taskWhy: 'Why hybrid search',
    taskWhyDesc: 'Limits of vector vs full-text; hybrid covers both.',
    taskCreate: 'Create hybrid search table',
    taskCreateDesc: 'Table with both full-text and vector (HNSW) indexes.',
    taskInsert: 'Insert test data',
    taskInsertDesc: 'Insert product rows and embeddings for hybrid search.',
    taskQuery: 'Run hybrid search (weighted)',
    taskQueryDesc: 'CTE for vector and text scores, then merge by weight.',
    taskStrategy: 'Fusion strategies',
    taskStrategyDesc: 'Weighted vs RRF vs Rerank; pros and use cases.',
    taskBest: 'Best practices',
    taskBestDesc: 'Weight tips and performance (recall then rank).',
    quizSection: 'Chapter quiz',
    quizDesc: 'Complete 1 question on RRF and hybrid search.',
    quizQuestion: 'What is the main characteristic of RRF (Reciprocal Rank Fusion)?',
    quizA: 'Requires manual weight tuning',
    quizB: 'Fuses by rank rather than raw scores',
    quizC: 'Only for vector search',
    quizD: 'Very high computational complexity',
    quizExplanation: 'RRF fuses results by rank, is score-scale agnostic, needs no tuning, and works for vector and full-text fusion.',
    lessonLabel: 'Lesson {{n}}',
    embedPlaceholder: 'Select a task on the left to see the code or quiz here.',
    taskWhy_stepHint: 'Hybrid search = vector + full-text, for both semantics and keywords.',
    taskCreate_stepHint: 'Step 1: Table needs both FULLTEXT (name, description) and HNSW vector index for hybrid search.',
    taskCreate_tryIt: 'You can add a price DECIMAL(10,2) column or change FULLTEXT coverage.',
    taskInsert_stepHint: 'Step 2: Depends on the products table from the previous step. After insert, run hybrid search next.',
    taskInsert_tryIt: 'Insert more products with different categories to test full-text and vector combination.',
    taskQuery_stepHint: 'Step 3: Depends on inserted data. Vector score = (1 - cosine distance); then weight with full-text score.',
    taskQuery_tryIt: 'Adjust 0.6/0.4 weights or use different MATCH(...) AGAINST keywords and observe order.',
    taskStrategy_stepHint: 'RRF fuses by rank and is score-scale agnostic; Rerank needs a rerank model and has higher latency.',
    taskBest_stepHint: 'Recall then rank to control cost; tune weights with A/B tests for your use case.',
  },
}

export const createDatabaseTexts: Record<Lang, Record<string, string>> = {
  zh: {
    h1: '创建数据库',
    intro: '本课学习如何在 SeekDB 中创建、查看、切换和删除数据库，以及命名与设计建议。',
    introLink: '官方创建数据库课程',
    lessonLabel: '第 {{n}} 课',
    embedPlaceholder: '在左侧选择一项任务，此处将展示对应的代码或测试题',
    dbTitle: '数据库说明',
    practiceTitle: '实战练习',
    taskDb: '数据库说明',
    taskDbDesc: '了解数据库在 SeekDB 中的角色与命名规范。',
    taskCreate: '创建数据库',
    taskCreateDesc: '执行 CREATE DATABASE 并指定字符集。',
    taskView: '查看和切换数据库',
    taskViewDesc: '列出数据库、切换当前库。',
    taskDrop: '删除数据库',
    taskDropDesc: '谨慎使用 DROP DATABASE。',
    taskDesign: '命名和设计建议',
    taskDesignDesc: '命名规范与库表设计原则。',
    quizSection: '章节测试',
    quizDesc: '完成 1 道题，巩固创建与管理数据库的 SQL。',
    quizQuestion: '以下哪个命令可以安全地创建数据库（已存在时不报错）？',
    quizA: 'CREATE DATABASE mydb;',
    quizB: 'CREATE DATABASE IF NOT EXISTS mydb;',
    quizC: 'CREATE DATABASE OR REPLACE mydb;',
    quizD: 'CREATE NEW DATABASE mydb;',
    quizExplanation: 'CREATE DATABASE IF NOT EXISTS 在数据库已存在时不会报错，适合脚本或重复执行场景；SeekDB 兼容 MySQL 语法。',
    basicsTitle: '基本操作',
    basics1: '创建数据库：CREATE DATABASE、IF NOT EXISTS、字符集',
    basics2: '查看与切换：SHOW DATABASES、USE、SELECT DATABASE()',
    basics3: '删除数据库：DROP DATABASE（谨慎，不可恢复）',
    practiceDesc2: '按顺序完成：创建 → 查看/切换 → 删除（示例）→ 命名建议 → 章节测试。',
    intro_stepHint: 'SeekDB 兼容 MySQL 语法，CREATE DATABASE / USE 等与 MySQL 一致。',
    create_stepHint: 'IF NOT EXISTS 适合脚本重复执行；utf8mb4 支持完整 Unicode（含 emoji）。',
    manage_stepHint: '执行建表、插入等操作前需先 USE 到目标库。',
    drop_stepHint: '生产环境执行前请确保已备份重要数据；本示例仅作语法参考。',
    naming_stepHint: '规范命名便于团队协作与运维。',
  },
  en: {
    h1: 'Create database',
    intro: 'This lesson covers creating, viewing, switching, and dropping databases in SeekDB, plus naming and design tips.',
    introLink: 'Official create database course',
    lessonLabel: 'Lesson {{n}}',
    embedPlaceholder: 'Select a task on the left to see the code or quiz here.',
    dbTitle: 'About databases',
    practiceTitle: 'Hands-on',
    taskDb: 'About databases',
    taskDbDesc: 'Databases are top-level containers; they hold tables and indexes.',
    taskCreate: 'Create database',
    taskCreateDesc: 'CREATE DATABASE, IF NOT EXISTS, charset.',
    taskView: 'View and switch database',
    taskViewDesc: 'SHOW DATABASES, USE, SELECT DATABASE().',
    taskDrop: 'Drop database',
    taskDropDesc: 'DROP DATABASE; irreversible, back up in production.',
    taskDesign: 'Naming and design',
    taskDesignDesc: 'Naming and schema design tips.',
    quizSection: 'Chapter quiz',
    quizDesc: 'Complete 1 question on creating and managing databases.',
    quizQuestion: 'Which command safely creates a database (no error if it exists)?',
    quizA: 'CREATE DATABASE mydb;',
    quizB: 'CREATE DATABASE IF NOT EXISTS mydb;',
    quizC: 'CREATE DATABASE OR REPLACE mydb;',
    quizD: 'CREATE NEW DATABASE mydb;',
    quizExplanation: 'CREATE DATABASE IF NOT EXISTS does not error when the database already exists; SeekDB is MySQL-compatible.',
    basicsTitle: 'Basic operations',
    basics1: 'Create: CREATE DATABASE, IF NOT EXISTS, charset',
    basics2: 'View and switch: SHOW DATABASES, USE, SELECT DATABASE()',
    basics3: 'Drop: DROP DATABASE (irreversible)',
    practiceDesc2: 'Create → view/switch → drop (example) → naming → quiz.',
    intro_stepHint: 'SeekDB is MySQL-compatible; CREATE DATABASE, USE, etc. work as in MySQL.',
    create_stepHint: 'IF NOT EXISTS is good for scripts and re-runs; utf8mb4 supports full Unicode including emoji.',
    manage_stepHint: 'USE the target database before creating tables or inserting data.',
    drop_stepHint: 'Back up important data before running in production; this example is for syntax only.',
    naming_stepHint: 'Consistent naming helps team collaboration and operations.',
  },
}

export const seekdbJsTexts: Record<Lang, Record<string, string>> = {
  zh: {
    h1: 'seekdb-js SDK',
    intro: 'seekdb-js 是面向 JavaScript/TypeScript 的 SeekDB SDK，支持自动向量化、语义搜索与混合搜索，无需手算向量即可快速构建 AI 应用。完整文档与交互式示例可参考',
    introLink: '官方 seekdb 交互式课程',
    capabilitiesTitle: '核心能力',
    cap1: '自动向量化：写入文档时自动生成 embedding，无需手动计算向量',
    cap2: '语义搜索：基于向量的相似度检索，支持自然语言查询',
    cap3: '混合搜索：关键词匹配与语义搜索结合',
    cap4: 'TypeScript：完整类型定义，开发体验友好',
    lessonLabel: '第 {{n}} 课',
    embedPlaceholder: '在左侧选择一项任务，此处将展示对应的代码或测试题',
    practiceTitle: '实战练习',
    practiceDesc: '按顺序完成下方步骤：安装 → 连接 → 创建集合 → 添加数据 → 查询；可选体验数据库管理 API。',
    taskInstall: '安装 seekdb',
    taskInstallDesc: '使用 npm / pnpm / yarn 安装 seekdb 包。',
    taskConnect: '连接 seekdb',
    taskConnectDesc: '创建 SeekdbClient 实例并配置连接（OceanBase 模式需指定 tenant）。',
    taskCreate: '创建集合（Collection）',
    taskCreateDesc: '集合是 seekdb-js 中存储和管理数据的基本单位。',
    taskInsert: '添加数据（自动向量化）',
    taskInsertDesc: '写入文档时 SDK 会自动生成向量嵌入，可附带 metadatas。',
    taskSearch: '语义搜索查询',
    taskSearchDesc: '使用 queryTexts 与 nResults 进行语义相似度检索。',
    taskAdmin: '数据库管理',
    taskAdminDesc: '使用 SeekdbAdminClient 创建、列举、删除数据库。',
    quizSection: '章节测试',
    quizDesc: '完成 1 道题，巩固 seekdb-js 默认嵌入模型等知识。',
    quizQuestion: 'seekdb-js 默认使用哪种嵌入模型？',
    quizA: 'OpenAI text-embedding-3-small',
    quizB: 'Qwen text-embedding-v4',
    quizC: 'Xenova/all-MiniLM-L6-v2（本地模型）',
    quizD: '需手动配置',
    quizExplanation: 'seekdb-js 默认使用 Xenova/all-MiniLM-L6-v2 本地模型，无需 API Key，适合快速开发与测试。',
    install_stepHint: '本环境为演示；本地请在项目目录执行上述命令安装依赖。',
    connect_stepHint: 'SDK 会自动处理连接与重连；本地请将 host/port/password 改为实际 SeekDB 实例。',
    createCollection_stepHint: '依赖上一步已连接的 client；Collection 用于存储文档及其向量。',
    addData_stepHint: 'SDK 会自动将 documents 转为向量；metadatas 用于存储额外字段便于过滤。',
    query_stepHint: '依赖已 add 的数据；queryTexts 会先向量化再与集合内向量做相似度检索。',
    admin_stepHint: 'SeekdbAdminClient 用于库级管理；日常 CRUD 使用 SeekdbClient + Collection。',
  },
  en: {
    h1: 'seekdb-js SDK',
    intro: 'seekdb-js is the JavaScript/TypeScript SDK for SeekDB with auto vectorization, semantic search, and hybrid search for building AI apps without hand-coded vectors. See the',
    introLink: 'official seekdb interactive course',
    capabilitiesTitle: 'Features',
    cap1: 'Auto vectorization: generate embeddings on write',
    cap2: 'Semantic search: similarity retrieval, natural language queries',
    cap3: 'Hybrid search: keyword + semantic',
    cap4: 'TypeScript: full type definitions',
    lessonLabel: 'Lesson {{n}}',
    embedPlaceholder: 'Select a task on the left to see the code or quiz here.',
    practiceTitle: 'Hands-on',
    practiceDesc: 'Install → connect → create collection → add data → query; optional admin API.',
    taskInstall: 'Install seekdb',
    taskInstallDesc: 'Install the seekdb package with npm / pnpm / yarn.',
    taskConnect: 'Connect to SeekDB',
    taskConnectDesc: 'Create a SeekdbClient instance and configure connection (tenant required for OceanBase mode).',
    taskCreate: 'Create collection',
    taskCreateDesc: 'Collection is the basic unit for storing and managing data in seekdb-js.',
    taskInsert: 'Add data (auto vectorization)',
    taskInsertDesc: 'SDK auto-generates embeddings on write; metadatas supported.',
    taskSearch: 'Semantic search',
    taskSearchDesc: 'Use queryTexts and nResults for similarity search.',
    taskAdmin: 'Database admin',
    taskAdminDesc: 'Use SeekdbAdminClient to create, list, and delete databases.',
    quizSection: 'Chapter quiz',
    quizDesc: 'Complete 1 question on seekdb-js default embedding model.',
    quizQuestion: 'Which embedding model does seekdb-js use by default?',
    quizA: 'OpenAI text-embedding-3-small',
    quizB: 'Qwen text-embedding-v4',
    quizC: 'Xenova/all-MiniLM-L6-v2 (local)',
    quizD: 'Must be configured manually',
    quizExplanation: 'seekdb-js defaults to Xenova/all-MiniLM-L6-v2 local model, no API key needed.',
    install_stepHint: 'This is a demo; run the commands above in your project directory to install locally.',
    connect_stepHint: 'SDK handles connection and reconnection; set host/port/password to your SeekDB instance.',
    createCollection_stepHint: 'Depends on the connected client from the previous step; Collection stores docs and vectors.',
    addData_stepHint: 'SDK auto-vectorizes documents; metadatas store extra fields for filtering.',
    query_stepHint: 'Depends on data added; queryTexts are vectorized then matched against collection vectors.',
    admin_stepHint: 'SeekdbAdminClient is for database-level admin; use SeekdbClient + Collection for CRUD.',
  },
}

export const electronNextjsTemplateTexts: Record<Lang, Record<string, string>> = {
  zh: {
    h1: 'Electron + Next.js + seekdb 模板',
    intro: '本课介绍如何基于 Electron + Next.js + seekdb 模板快速搭建桌面端 AI 应用：Electron 提供桌面壳与系统能力，Next.js 负责 UI 与路由，seekdb-js 提供向量存储与语义搜索。适合需要离线或本地桌面应用且希望沿用 Web 技术栈的开发者。',
    introLink: '官方 Electron 模板文档',
    stackTitle: '技术栈分工',
    stack1: 'Electron：主进程创建窗口、菜单、系统 API；渲染进程加载 Next.js 应用',
    stack2: 'Next.js：页面渲染、路由、API Routes（可选），与现有 React 生态一致',
    stack3: 'seekdb-js：连接 SeekDB，创建集合、写入文档、语义查询等',
    lessonLabel: '第 {{n}} 课',
    embedPlaceholder: '在左侧选择一项任务，此处将展示对应的代码或测试题',
    practiceTitle: '实战练习',
    practiceDesc: '按顺序了解模板说明、创建与运行、项目结构，最后配置并调用 seekdb。',
    taskIntro: '模板说明',
    taskIntroDesc: 'Electron 提供桌面壳，Next.js 负责界面，seekdb-js 提供数据与向量能力。',
    taskCreate: '创建项目',
    taskCreateDesc: '使用 create-seekdb-app 或克隆官方模板仓库，生成项目目录。',
    taskInstall: '安装依赖与运行',
    taskInstallDesc: '安装依赖后执行 dev 脚本，启动桌面开发环境。',
    taskStructure: '项目结构',
    taskStructureDesc: '了解 main 进程、Next.js 应用与 preload 的职责与目录。',
    taskConfig: '配置并调用 seekdb',
    taskConfigDesc: '在应用中配置 SeekDB 连接并调用 seekdb-js 进行查询。',
    quizSection: '章节测试',
    quizDesc: '完成 1 道题，巩固 Electron + Next.js + seekdb 模板的职责划分。',
    quizQuestion: '在 Electron + Next.js + seekdb 模板中，Electron 主要负责什么？',
    quizA: '服务端渲染页面',
    quizB: '提供桌面应用窗口与系统集成（主进程）',
    quizC: '直接在前端页面里计算向量',
    quizD: '替代 Next.js 做路由',
    quizExplanation: 'Electron 主进程负责创建窗口、系统托盘、原生 API 等；界面与业务逻辑由 Next.js（渲染进程）承担，seekdb 用于数据与向量检索。',
    intro_code: `# Electron + Next.js + seekdb 模板

- **Electron**：桌面应用壳，主进程管理窗口与系统集成。
- **Next.js**：渲染进程中的 Web 应用，负责页面与路由。
- **seekdb-js**：在 Node/渲染进程中连接 SeekDB，实现向量与语义搜索。

适用场景：需要打包成桌面客户端的 AI 应用（如本地知识库、离线检索工具）。`,
    intro_stepHint: '模板将三者整合为一套可运行的脚手架，开箱即用。',
    create_code: `# 使用 create-seekdb-app 创建项目（推荐）
npx create-seekdb-app@latest my-electron-seekdb --template electron-nextjs

# 或从官方模板仓库克隆
# git clone https://github.com/seekdb/electron-nextjs-seekdb-template.git my-app
# cd my-app`,
    create_stepHint: '执行后会在当前目录生成 my-electron-seekdb（或你指定的目录），内含 Electron + Next.js + seekdb 配置。',
    create_expectedOutput: '# 创建完成后进入目录: cd my-electron-seekdb',
    run_code: `{
  "scripts": {
    "dev": "concurrently \\"next dev\\" \\"wait-on http://localhost:3000 && electron .\\"",
    "build": "next build && electron-builder",
    "start": "next start"
  }
}`,
    run_stepHint: 'dev 会先启动 Next.js，再启动 Electron 并加载本地页面；本地请在该模板项目中执行 pnpm install && pnpm dev。',
    run_expectedOutput: '# 终端中 Next 与 Electron 启动后，会弹出桌面窗口并打开应用',
    structure_code: `my-electron-seekdb/
├── main/           # Electron 主进程（创建窗口、加载 URL）
├── preload/         # 预加载脚本（安全桥接 main 与 renderer）
├── src/             # Next.js 应用
│   ├── app/         # App Router 页面
│   ├── lib/         # 可放 seekdb 客户端封装
│   └── ...
├── package.json
└── next.config.js`,
    structure_stepHint: 'seekdb-js 可在 Next.js 的 Server Component、API Route 或通过 preload 暴露给渲染进程使用。',
    structure_expectedOutput: '# 了解结构后，在 lib 或 API 中接入 SeekdbClient 即可',
    seekdb_config_code: `import { SeekdbClient } from "seekdb";

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

export { client };`,
    seekdb_config_stepHint: '在 Next.js API Route 或 Server Action 中调用 getCollection/createCollection/query，避免在浏览器中暴露连接信息。',
    seekdb_config_expectedOutput: "# 封装后可在页面或 API 中 import { client, getCollection } from '@/lib/seekdb'",
  },
  en: {
    h1: 'Electron + Next.js + seekdb template',
    intro: 'This lesson shows how to build a desktop AI app with the Electron + Next.js + seekdb template: Electron provides the shell and system APIs, Next.js handles UI and routing, seekdb-js provides vector storage and semantic search. For developers who need offline or local desktop apps with a Web tech stack.',
    introLink: 'Official Electron template docs',
    stackTitle: 'Tech stack',
    stack1: 'Electron: main process creates window, menu, system API; renderer loads Next.js app',
    stack2: 'Next.js: pages, routing, API Routes (optional), React ecosystem',
    stack3: 'seekdb-js: connect SeekDB, create collection, add docs, semantic query',
    lessonLabel: 'Lesson {{n}}',
    embedPlaceholder: 'Select a task on the left to see the code or quiz here.',
    practiceTitle: 'Hands-on',
    practiceDesc: 'Template overview → create & run → project structure → configure and call seekdb.',
    taskIntro: 'Template overview',
    taskIntroDesc: 'Electron provides the desktop shell, Next.js the UI, seekdb-js data and vector capabilities.',
    taskCreate: 'Create project',
    taskCreateDesc: 'Use create-seekdb-app or clone the official template repo to generate the project.',
    taskInstall: 'Install and run',
    taskInstallDesc: 'Install dependencies and run dev script to start the desktop dev environment.',
    taskStructure: 'Project structure',
    taskStructureDesc: 'Understand main process, Next.js app, and preload roles and directories.',
    taskConfig: 'Configure and call seekdb',
    taskConfigDesc: 'Configure SeekDB connection and call seekdb-js for queries in the app.',
    quizSection: 'Chapter quiz',
    quizDesc: 'Complete 1 question on the Electron template.',
    quizQuestion: 'In the Electron + Next.js + seekdb template, what is Electron mainly responsible for?',
    quizA: 'Server-side rendering',
    quizB: 'Desktop window and system integration (main process)',
    quizC: 'Computing vectors in the frontend',
    quizD: 'Replacing Next.js for routing',
    quizExplanation: 'Electron main process handles window, system tray, native APIs; Next.js handles UI and logic; seekdb for data and vector search.',
    intro_code: `# Electron + Next.js + seekdb template

- **Electron**: Desktop app shell; main process manages window and system integration.
- **Next.js**: Web app in the renderer; pages and routing.
- **seekdb-js**: Connects to SeekDB in Node/renderer; vector and semantic search.

Use case: AI apps packaged as desktop clients (e.g. local knowledge base, offline retrieval).`,
    intro_stepHint: 'The template integrates all three into a runnable scaffold, ready to use.',
    create_code: `# Create project with create-seekdb-app (recommended)
npx create-seekdb-app@latest my-electron-seekdb --template electron-nextjs

# Or clone the official template repo
# git clone https://github.com/seekdb/electron-nextjs-seekdb-template.git my-app
# cd my-app`,
    create_stepHint: 'After running, the current directory will contain my-electron-seekdb (or your chosen name) with Electron + Next.js + seekdb configured.',
    create_expectedOutput: '# After creation, enter the directory: cd my-electron-seekdb',
    run_code: `{
  "scripts": {
    "dev": "concurrently \\"next dev\\" \\"wait-on http://localhost:3000 && electron .\\"",
    "build": "next build && electron-builder",
    "start": "next start"
  }
}`,
    run_stepHint: 'dev starts Next.js then Electron loading the local app; run pnpm install && pnpm dev in the template project.',
    run_expectedOutput: '# After Next and Electron start, a desktop window opens with the app',
    structure_code: `my-electron-seekdb/
├── main/           # Electron main process (window, load URL)
├── preload/         # Preload script (bridge main & renderer)
├── src/             # Next.js app
│   ├── app/         # App Router pages
│   ├── lib/         # e.g. seekdb client wrapper
│   └── ...
├── package.json
└── next.config.js`,
    structure_stepHint: 'seekdb-js can be used in Next.js Server Component, API Route, or exposed to the renderer via preload.',
    structure_expectedOutput: '# After reviewing the structure, wire SeekdbClient in lib or API',
    seekdb_config_code: `import { SeekdbClient } from "seekdb";

// Read from env for dev/prod
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

export { client };`,
    seekdb_config_stepHint: 'Call getCollection/createCollection/query in Next.js API Route or Server Action; avoid exposing connection in the browser.',
    seekdb_config_expectedOutput: "# Then in pages or API: import { client, getCollection } from '@/lib/seekdb'",
  },
}

export const nextjsSeekdbTemplateTexts: Record<Lang, Record<string, string>> = {
  zh: {
    h1: 'Next.js + seekdb 模板',
    intro: '使用 Next.js 和 seekdb 构建 Web 应用的完整模板项目，支持服务端渲染、API 路由和向量搜索。完整步骤可参考',
    introLink: '官方 Next.js + seekdb 模板课程',
    featuresTitle: '主要特性',
    feature1: 'Next.js 14+：App Router、Server Components',
    feature2: 'seekdb 集成：内置 seekdb-js SDK，实现向量搜索',
    feature3: 'TypeScript：完整类型定义',
    lessonLabel: '第 {{n}} 课',
    embedPlaceholder: '在左侧选择一项任务，此处将展示对应的代码或测试题',
    practiceTitle: '实战练习',
    practiceDesc: '按顺序：创建项目 → 选择模板 → 配置环境变量 → 启动开发服务器 → 查看 API 路由示例。',
    taskIntro: '模板说明',
    taskIntroDesc: 'Next.js 14+ App Router、seekdb-js 集成、服务端渲染与向量搜索。',
    taskCreate: '创建新项目',
    taskCreateDesc: '使用 create-seekdb-app 脚手架创建项目（可将 my-app 替换为你的项目名）。',
    taskSelect: '选择模板',
    taskSelectDesc: '在交互式提示中选择 Next.js + seekdb 模板。',
    taskEnv: '配置环境变量',
    taskEnvDesc: '创建 .env.local 并配置 SeekDB 连接信息。',
    taskDev: '启动开发服务器',
    taskDevDesc: 'pnpm dev 后默认运行在 http://localhost:3000。',
    taskApi: 'API 路由示例',
    taskApiDesc: '在服务端使用 seekdb 进行向量搜索的 API 示例。',
    quizSection: '章节测试',
    quizDesc: '完成 1 道题，巩固 Next.js + seekdb 模板用法。',
    quizQuestion: '在 Next.js + seekdb 模板中，推荐在哪里调用 seekdb-js 做向量搜索？',
    quizA: '仅在浏览器端直接连接 SeekDB',
    quizB: '在 Next.js API Routes 或 Server Components 中调用',
    quizC: '只在 build 时执行一次',
    quizD: '必须在 Edge Runtime 中',
    quizExplanation: '推荐在服务端（API Routes、Server Actions、Server Components）使用 seekdb-js，可避免在浏览器暴露连接信息，并利用服务端能力做向量检索。',
    intro_code: `# Next.js + seekdb 模板

- **Next.js 14+**：App Router、Server Components、API Routes
- **seekdb-js**：在服务端连接 SeekDB，实现向量搜索与数据操作
- **TypeScript**：完整类型支持

适用场景：需要服务端渲染或 API 的 Web 应用，结合向量/语义搜索。`,
    intro_stepHint: '模板开箱即用，创建后配置环境变量即可连接 SeekDB。',
    create_code: `npx create-seekdb-app@latest my-app

# 或使用 pnpm
pnpm create seekdb-app my-app

# 或使用 yarn
yarn create seekdb-app my-app`,
    create_stepHint: '将 my-app 替换为你的项目名称；工具会自动创建项目目录并安装依赖。',
    create_expectedOutput: '# 创建完成后会进入交互式提示，选择模板',
    select_template_code: `? Select a template: (Use arrow keys)
❯ Next.js + seekdb
  Electron + Next.js + seekdb
  Express + seekdb
  Fastify + seekdb`,
    select_template_stepHint: '在交互式提示中用方向键选择「Next.js + seekdb」后回车。',
    select_template_expectedOutput: '# 选择后继续生成项目文件',
    env_code: `# .env.local
SEEKDB_HOST=127.0.0.1
SEEKDB_PORT=2881
SEEKDB_USER=root
SEEKDB_PASSWORD=
SEEKDB_DATABASE=test`,
    env_stepHint: '在项目根目录创建 .env.local；请先安装并启动 seekdb 服务，再按实际修改连接参数。',
    env_expectedOutput: '# 保存后应用会读取这些环境变量连接 SeekDB',
    dev_code: `pnpm dev

# 默认运行在 http://localhost:3000`,
    dev_stepHint: '在项目目录执行；首次可先 pnpm install。',
    dev_expectedOutput: '# 开发服务器启动后，在浏览器打开 http://localhost:3000',
    api_route_code: `// app/api/search/route.ts
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
}`,
    api_route_stepHint: '在 API Route 中从环境变量读取连接配置，接收 POST 请求后做语义搜索并返回 JSON。',
    api_route_expectedOutput: "# 前端可 fetch('/api/search', { method: 'POST', body: JSON.stringify({ query: '...' }) }) 调用",
  },
  en: {
    h1: 'Next.js + seekdb template',
    intro: 'Full template for building web apps with Next.js and seekdb, with SSR, API routes, and vector search. See the',
    introLink: 'official Next.js + seekdb template course',
    featuresTitle: 'Features',
    feature1: 'Next.js 14+: App Router, Server Components',
    feature2: 'seekdb: built-in seekdb-js SDK for vector search',
    feature3: 'TypeScript: full type definitions',
    lessonLabel: 'Lesson {{n}}',
    embedPlaceholder: 'Select a task on the left to see the code or quiz here.',
    practiceTitle: 'Hands-on',
    practiceDesc: 'Create project → select template → configure env → start dev server → API route example.',
    taskIntro: 'Template overview',
    taskIntroDesc: 'Next.js 14+ App Router, seekdb-js integration, SSR and vector search.',
    taskCreate: 'Create new project',
    taskCreateDesc: 'Use create-seekdb-app to scaffold (replace my-app with your project name).',
    taskSelect: 'Select template',
    taskSelectDesc: 'Choose Next.js + seekdb in the interactive prompt.',
    taskEnv: 'Configure env vars',
    taskEnvDesc: 'Create .env.local with SeekDB connection info.',
    taskDev: 'Start dev server',
    taskDevDesc: 'pnpm dev runs at http://localhost:3000 by default.',
    taskApi: 'API route example',
    taskApiDesc: 'Server-side seekdb vector search API example.',
    quizSection: 'Chapter quiz',
    quizDesc: 'Complete 1 question on the Next.js template.',
    quizQuestion: 'Where should you call seekdb-js for vector search in the Next.js + seekdb template?',
    quizA: 'Only in the browser connecting to SeekDB',
    quizB: 'In Next.js API Routes or Server Components',
    quizC: 'Only once at build time',
    quizD: 'Must be in Edge Runtime',
    quizExplanation: 'Use seekdb-js on the server (API Routes, Server Actions, Server Components) to avoid exposing connection details and use server-side vector search.',
    intro_code: `# Next.js + seekdb template

- **Next.js 14+**: App Router, Server Components, API Routes
- **seekdb-js**: Connect to SeekDB on the server; vector search and data operations
- **TypeScript**: Full type support

Use case: Web apps with SSR or API, plus vector/semantic search.`,
    intro_stepHint: 'Template is ready to use; configure env vars after creation to connect to SeekDB.',
    create_code: `npx create-seekdb-app@latest my-app

# or with pnpm
pnpm create seekdb-app my-app

# or with yarn
yarn create seekdb-app my-app`,
    create_stepHint: 'Replace my-app with your project name; the CLI will create the directory and install dependencies.',
    create_expectedOutput: '# After creation you will see an interactive prompt to select a template',
    select_template_code: `? Select a template: (Use arrow keys)
❯ Next.js + seekdb
  Electron + Next.js + seekdb
  Express + seekdb
  Fastify + seekdb`,
    select_template_stepHint: 'Use arrow keys to select "Next.js + seekdb" and press Enter.',
    select_template_expectedOutput: '# After selection the project files are generated',
    env_code: `# .env.local
SEEKDB_HOST=127.0.0.1
SEEKDB_PORT=2881
SEEKDB_USER=root
SEEKDB_PASSWORD=
SEEKDB_DATABASE=test`,
    env_stepHint: 'Create .env.local in the project root; install and start seekdb first, then set connection params.',
    env_expectedOutput: '# After saving, the app will read these env vars to connect to SeekDB',
    dev_code: `pnpm dev

# Default: http://localhost:3000`,
    dev_stepHint: 'Run in the project directory; run pnpm install first if needed.',
    dev_expectedOutput: '# After the dev server starts, open http://localhost:3000 in the browser',
    api_route_code: `// app/api/search/route.ts
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
}`,
    api_route_stepHint: 'Read connection config from env in the API Route; accept POST, run semantic search, return JSON.',
    api_route_expectedOutput: "# Frontend can call fetch('/api/search', { method: 'POST', body: JSON.stringify({ query: '...' }) })",
  },
}

export const createSeekdbAppTexts: Record<Lang, Record<string, string>> = {
  zh: {
    h1: 'create-seekdb-app',
    intro: '快速创建 seekdb 应用的脚手架工具，支持多种模板，一键生成项目结构和配置文件。完整说明可参考',
    introLink: '官方 create-seekdb-app 课程',
    featuresTitle: '特点',
    feature1: '快速启动：一条命令即可创建完整项目',
    feature2: '多种模板：Next.js、Electron、Express、Fastify 等',
    feature3: '自动配置：自动生成项目结构与配置，开箱即用',
    feature4: 'TypeScript 优先：所有模板提供完整 TypeScript 支持',
    lessonLabel: '第 {{n}} 课',
    embedPlaceholder: '在左侧选择一项任务，此处将展示对应的代码或测试题',
    practiceTitle: '实战练习',
    practiceDesc: '按顺序：创建项目 → 选择模板 → 进入目录 → 安装依赖 → 配置环境变量 → 运行项目。',
    taskIntro: '脚手架说明',
    taskIntroDesc: '一条命令创建完整 seekdb 应用项目，支持多种模板、自动配置与 TypeScript。',
    taskCreate: '创建新项目',
    taskCreateDesc: '使用 npm / pnpm / yarn 运行 create seekdb-app，将 my-app 替换为你的项目名。',
    taskSelect: '选择模板',
    taskSelectDesc: '在交互式提示中从可用模板列表选择（Next.js、Electron、Express、Fastify）。',
    taskCd: '进入项目目录',
    taskCdDesc: '切换到新创建的项目目录。',
    taskInstall: '安装依赖',
    taskInstallDesc: '在项目目录执行 pnpm install / npm install / yarn install。',
    taskEnv: '配置环境变量',
    taskEnvDesc: '创建 .env.local 配置 seekdb 连接信息；勿提交到 Git。',
    taskRun: '运行项目',
    taskRunDesc: 'pnpm dev 或 npm run dev / yarn dev 启动开发服务器。',
    taskTemplates: '可用模板一览',
    taskTemplatesDesc: 'Next.js、Electron+Next.js、Express、Fastify 等模板简介。',
    quizSection: '章节测试',
    quizDesc: '完成 1 道题，巩固 create-seekdb-app 用法。',
    quizQuestion: 'create-seekdb-app 支持以下哪些模板？',
    quizA: '仅 Next.js',
    quizB: 'Next.js、Electron+Next.js、Express、Fastify',
    quizC: '仅 Electron',
    quizD: '仅 Express',
    quizExplanation: 'create-seekdb-app 提供 Next.js + seekdb、Electron + Next.js + seekdb、Express + seekdb、Fastify + seekdb 等多种模板，可按需求选择。',
    intro_code: `# create-seekdb-app

- 一条命令创建完整的 seekdb 应用项目
- 支持 Next.js、Electron、Express、Fastify 等多种模板
- 自动生成项目结构和配置文件，开箱即用
- 所有模板均提供完整 TypeScript 支持`,
    intro_stepHint: '与 create-react-app、create-next-app 类似，专为 seekdb 应用定制的脚手架。',
    create_code: `# 使用 npm
npm create seekdb-app@latest my-app

# 使用 pnpm
pnpm create seekdb-app my-app

# 使用 yarn
yarn create seekdb-app my-app`,
    create_stepHint: '将 my-app 替换为你的项目名称；工具会自动创建新目录。',
    create_expectedOutput: '# 执行后会进入交互式提示，选择模板',
    select_template_code: `? Select a template: (Use arrow keys)
❯ Next.js + seekdb
  Electron + Next.js + seekdb
  Express + seekdb
  Fastify + seekdb`,
    select_template_stepHint: '用方向键选择模板后回车，即可生成对应项目。',
    select_template_expectedOutput: '# 选择后继续生成项目文件',
    cd_code: 'cd my-app',
    cd_stepHint: '若创建时使用了其他项目名，此处改为对应目录名。',
    cd_expectedOutput: '# 进入项目根目录后即可执行 install、dev 等',
    install_code: `# 使用 pnpm
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install`,
    install_stepHint: '在项目根目录执行，安装模板所需依赖。',
    install_expectedOutput: '# 安装完成后可配置 .env.local 并运行 dev',
    env_code: `# .env.local
SEEKDB_HOST=127.0.0.1
SEEKDB_PORT=2881
SEEKDB_USER=root
SEEKDB_PASSWORD=
SEEKDB_DATABASE=test`,
    env_stepHint: '请勿将 .env.local 提交到 Git，其包含敏感连接信息。',
    env_expectedOutput: '# 根据模板提示配置；保存后应用会读取这些变量',
    dev_code: `pnpm dev

# 或
npm run dev

# 或
yarn dev`,
    dev_stepHint: '启动开发服务器后，按模板不同可访问对应地址（如 Next.js 默认 http://localhost:3000）。',
    dev_expectedOutput: '# 开发服务器启动，可开始开发与调试',
    templates_code: `## 可用模板

- **Next.js + seekdb**：构建现代化 Web 应用，支持 SSR 和 API 路由
- **Electron + Next.js + seekdb**：跨平台桌面应用，集成向量搜索
- **Express + seekdb**：使用 Express 构建 RESTful API 服务
- **Fastify + seekdb**：使用 Fastify 构建高性能 API 服务`,
    templates_stepHint: '按技术栈与部署形态选择；学院内另有 Next.js / Electron 模板单独课程可深入。',
  },
  en: {
    h1: 'create-seekdb-app',
    intro: 'Scaffold to create seekdb apps with multiple templates and one-command project setup. See the',
    introLink: 'official create-seekdb-app course',
    featuresTitle: 'Features',
    feature1: 'Quick start: one command to create a full project',
    feature2: 'Multiple templates: Next.js, Electron, Express, Fastify',
    feature3: 'Auto config: project structure and config generated, ready to use',
    feature4: 'TypeScript first: all templates include full TypeScript support',
    lessonLabel: 'Lesson {{n}}',
    embedPlaceholder: 'Select a task on the left to see the code or quiz here.',
    practiceTitle: 'Hands-on',
    practiceDesc: 'Create project → select template → cd → install → configure env → run.',
    taskIntro: 'Scaffold overview',
    taskIntroDesc: 'One command to create a full seekdb app with multiple templates and TypeScript.',
    taskCreate: 'Create new project',
    taskCreateDesc: 'Run create seekdb-app with npm / pnpm / yarn; replace my-app with your project name.',
    taskSelect: 'Select template',
    taskSelectDesc: 'Choose from available templates in the interactive prompt.',
    taskCd: 'Enter project directory',
    taskCdDesc: 'Change into the newly created project directory.',
    taskInstall: 'Install dependencies',
    taskInstallDesc: 'Run pnpm install / npm install / yarn install in the project directory.',
    taskEnv: 'Configure env vars',
    taskEnvDesc: 'Create .env.local with seekdb connection info; do not commit to Git.',
    taskRun: 'Run project',
    taskRunDesc: 'pnpm dev or npm run dev / yarn dev to start the dev server.',
    taskTemplates: 'Available templates',
    taskTemplatesDesc: 'Overview of Next.js, Electron+Next.js, Express, Fastify templates.',
    quizSection: 'Chapter quiz',
    quizDesc: 'Complete 1 question on create-seekdb-app.',
    quizQuestion: 'Which templates does create-seekdb-app support?',
    quizA: 'Only Next.js',
    quizB: 'Next.js, Electron+Next.js, Express, Fastify',
    quizC: 'Only Electron',
    quizD: 'Only Express',
    quizExplanation: 'create-seekdb-app offers Next.js, Electron+Next.js, Express, Fastify templates with seekdb.',
    intro_code: `# create-seekdb-app

- One command to create a full seekdb app project
- Templates: Next.js, Electron, Express, Fastify, etc.
- Auto-generated project structure and config, ready to use
- All templates include full TypeScript support`,
    intro_stepHint: 'Like create-react-app or create-next-app, but for seekdb apps.',
    create_code: `# With npm
npm create seekdb-app@latest my-app

# With pnpm
pnpm create seekdb-app my-app

# With yarn
yarn create seekdb-app my-app`,
    create_stepHint: 'Replace my-app with your project name; the CLI will create the directory.',
    create_expectedOutput: '# After running you will see an interactive prompt to select a template',
    select_template_code: `? Select a template: (Use arrow keys)
❯ Next.js + seekdb
  Electron + Next.js + seekdb
  Express + seekdb
  Fastify + seekdb`,
    select_template_stepHint: 'Use arrow keys to select a template and press Enter to generate the project.',
    select_template_expectedOutput: '# After selection the project files are generated',
    cd_code: 'cd my-app',
    cd_stepHint: 'If you used a different project name, use that directory name here.',
    cd_expectedOutput: '# After entering the project root you can run install, dev, etc.',
    install_code: `# With pnpm
pnpm install

# Or npm
npm install

# Or yarn
yarn install`,
    install_stepHint: 'Run in the project root to install template dependencies.',
    install_expectedOutput: '# After install you can configure .env.local and run dev',
    env_code: `# .env.local
SEEKDB_HOST=127.0.0.1
SEEKDB_PORT=2881
SEEKDB_USER=root
SEEKDB_PASSWORD=
SEEKDB_DATABASE=test`,
    env_stepHint: 'Do not commit .env.local to Git; it contains sensitive connection info.',
    env_expectedOutput: '# Configure as prompted by the template; the app will read these vars',
    dev_code: `pnpm dev

# or
npm run dev

# or
yarn dev`,
    dev_stepHint: 'After the dev server starts, the URL depends on the template (e.g. Next.js http://localhost:3000).',
    dev_expectedOutput: '# Dev server started; you can start developing and debugging',
    templates_code: `## Available templates

- **Next.js + seekdb**: Modern web app with SSR and API routes
- **Electron + Next.js + seekdb**: Cross-platform desktop app with vector search
- **Express + seekdb**: RESTful API with Express
- **Fastify + seekdb**: High-performance API with Fastify`,
    templates_stepHint: 'Choose by tech stack and deployment; the academy has separate lessons for Next.js and Electron templates.',
  },
}

function interpolate(template: string, params: Record<string, string | number>): string {
  let s = template
  Object.entries(params).forEach(([k, v]) => {
    s = s.replace(new RegExp(`\\{\\{\\s*${k}\\s*\\}\\}`, 'g'), String(v))
  })
  return s
}

export function getPageText<T extends Record<string, string>>(
  texts: Record<Lang, T>,
  lang: Lang,
  key: keyof T,
  params?: Record<string, string | number>
): string {
  const raw = texts[lang][key as string] ?? texts.zh[key as string] ?? (key as string)
  return params ? interpolate(raw, params) : raw
}
