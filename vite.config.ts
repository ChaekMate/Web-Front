import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: '/chaekmate.html'  // 자동으로 chaekmate.html 열기
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})