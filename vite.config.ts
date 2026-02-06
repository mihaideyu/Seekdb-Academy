import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const apiProxyTarget = process.env.ASK_AI_PROXY_TARGET
// vercel dev 时 Vercel 默认在 3000 端口提供 /api，Vite 在 5175；代理到 3000 后无论打开哪个端口 Ask AI 都能用
const apiTarget = apiProxyTarget ? apiProxyTarget.replace(/\/$/, '') : 'http://127.0.0.1:3000'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': resolve(__dirname, 'src') } },
  server: {
    host: true,
    // vercel dev 会注入 PORT，必须使用该端口 Vercel 才能检测到并启动 /api 代理
    port: process.env.PORT ? Number(process.env.PORT) : 5175,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
})
