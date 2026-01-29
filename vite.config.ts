import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // ضروري جداً لتطبيق الأندرويد ليعرف مسار الملفات
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})