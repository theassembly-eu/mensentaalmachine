import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  root: '.',
  plugins: [vue()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
})
