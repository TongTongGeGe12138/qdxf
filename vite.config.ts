import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'
import svgLoader from 'vite-svg-loader'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// API 前缀
const VITE_API_URL_PREFIX = '/api'
const VITE_API_URL_PREFIX_LOG = '/log'
const VITE_API_URL_PREFIX_CAD = '/cad'

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
      [VITE_API_URL_PREFIX]: {
        target: 'http://192.168.15.200:9100',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
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
