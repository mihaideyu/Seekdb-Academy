import { Routes, Route, Navigate } from 'react-router-dom'
import { getFirstLessonPath } from '@/curriculum'
import { Layout } from '@/components/Layout'
import { HomePage } from '@/pages/HomePage'
import { OverviewPage } from '@/pages/OverviewPage'
import { ConnectOverviewPage } from '@/pages/ConnectOverviewPage'
import { AiWorkflowPage } from '@/pages/AiWorkflowPage'
import { VectorSearchPage } from '@/pages/VectorSearchPage'
import { SemanticSearchPage } from '@/pages/SemanticSearchPage'
import { SeekdbJsPage } from '@/pages/SeekdbJsPage'
import { ElectronNextjsTemplatePage } from '@/pages/ElectronNextjsTemplatePage'
import { NextjsSeekdbTemplatePage } from '@/pages/NextjsSeekdbTemplatePage'
import { CreateSeekdbAppPage } from '@/pages/CreateSeekdbAppPage'
import { CreateDatabasePage } from '@/pages/CreateDatabasePage'
import { EmbeddingOverviewPage } from '@/pages/EmbeddingOverviewPage'
import { HybridSearchPage } from '@/pages/HybridSearchPage'
import { PlaceholderLessonPage } from '@/pages/PlaceholderLessonPage'

export default function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to={getFirstLessonPath()} replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/connect-overview" element={<ConnectOverviewPage />} />
          <Route path="/ai-workflow" element={<AiWorkflowPage />} />
          <Route path="/vector-search" element={<VectorSearchPage />} />
          <Route path="/semantic-search" element={<SemanticSearchPage />} />
          <Route path="/seekdb-js" element={<SeekdbJsPage />} />
          <Route path="/electron-nextjs-template" element={<ElectronNextjsTemplatePage />} />
          <Route path="/nextjs-seekdb-template" element={<NextjsSeekdbTemplatePage />} />
          <Route path="/create-seekdb-app" element={<CreateSeekdbAppPage />} />
          <Route path="/create-database" element={<CreateDatabasePage />} />
          <Route path="/embedding-overview" element={<EmbeddingOverviewPage />} />
          <Route path="/hybrid-search" element={<HybridSearchPage />} />
          {/* 其余课程使用占位页，大纲与官方一致 */}
          <Route path="*" element={<PlaceholderLessonPage />} />
        </Routes>
      </Layout>
    </>
  )
}
