var _a;
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath } from 'url';
import svgLoader from 'vite-svg-loader';
var __dirname = path.dirname(fileURLToPath(import.meta.url));
// API 前缀
var VITE_API_URL_PREFIX = '/api';
var VITE_API_URL_PREFIX_LOG = '/log';
var VITE_API_URL_PREFIX_CAD = '/cad';
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
                manualChunks: function (id) {
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
        proxy: (_a = {},
            _a[VITE_API_URL_PREFIX] = {
                // target: 'http://192.168.15.200:9100',
                target: 'http://api-work.dev.ifeng.com',
                changeOrigin: true,
                // rewrite: (path) => path.replace(/^\/api/, ''),
            },
            _a[VITE_API_URL_PREFIX_LOG] = {
                target: 'http://api.dev.ifeng.com',
                changeOrigin: true,
                rewrite: function (path) { return path.replace(/^\/log/, '/api'); },
            },
            _a[VITE_API_URL_PREFIX_CAD] = {
                target: 'http://cadapi.dev.ifeng.com',
                changeOrigin: true,
                rewrite: function (path) { return path.replace(/^\/cad/, '/api'); },
            },
            _a),
    },
});
