import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': resolve(__dirname, 'src') } },
  server: {
    host: true, // 监听 0.0.0.0，允许同一局域网内其它设备访问
    port: 5175,
  },
})
