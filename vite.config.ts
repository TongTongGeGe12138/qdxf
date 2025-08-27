import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'
import svgLoader from 'vite-svg-loader'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// API 前缀
const VITE_API_URL_PREFIX = '/api'
const VITE_API_URL_PREFIX_LOG = '/log'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader({
      svgoConfig: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                convertPathData: false,
                removeViewBox: false
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['vue', 'vue-router']
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
  server: {
    port: 3003,
    host: '0.0.0.0',
    strictPort: true,
    hmr: {
      port: 3003,
      clientPort: 3003
    },
    proxy: {
      // 1. 上传相关接口，优先匹配
      '/file': {
        target: 'http://192.168.15.200:9400',
        changeOrigin: true,
      },
      '/api/file': {
        target: 'http://192.168.15.200:9400',
        changeOrigin: true,
      },
      // 2. 其他 /api 统一代理到后端根，并移除 /api 前缀
      '/api': {
        target: 'https://api-work.beesfpd.com/',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // 3. 日志等（保持原有映射）
      [VITE_API_URL_PREFIX_LOG]: {
        target: 'http://api.aigc-v1.beesfpd.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/log/, '/api'),
      },
    },
  },
})


