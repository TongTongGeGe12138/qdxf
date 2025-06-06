import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// API 前缀
const VITE_API_URL_PREFIX = '/api'
const VITE_API_URL_PREFIX_LOG = '/log'
const VITE_API_URL_PREFIX_CAD = '/cad'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3002,
    host: '0.0.0.0',
    proxy: {
      [VITE_API_URL_PREFIX]: {
        target: 'http://192.168.15.200:9100',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
      [VITE_API_URL_PREFIX_LOG]: {
        target: 'http://api.dev.ifeng.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/log/, '/api'),
      },
      [VITE_API_URL_PREFIX_CAD]: {
        target: 'http://cadapi.dev.ifeng.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cad/, '/api'),
      },
    },
  },
})
