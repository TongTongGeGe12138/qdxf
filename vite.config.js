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
        proxy: (_a = {
            // 1. 上传相关接口，优先匹配
            '/file': {
                // target: 'http://192.168.15.200:9400',
                // target: 'https://api-work.beesfpd.com',
                target: 'http://api-work.dev.ifeng.com',
                changeOrigin: true,
            },
            '/api/file': {
                // target: 'http://192.168.15.200:9400',
                // target: 'https://api-work.beesfpd.com',
                target: 'http://api-work.dev.ifeng.com',
                changeOrigin: true,
            },
            '^/api/(?!test($|/)).*': {
                // target: 'https://api-work.beesfpd.com/',
                target: 'http://api-work.dev.ifeng.com',
                changeOrigin: true,
            },
            //匹配所有api/test的请求地址
            '^/api/test(?:$|/).*': {
                // target: 'https://api-aigc.beesfpd.com/',
                target: 'http://api-work.dev.ifeng.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/test/, '/api')
            }
        },
            // 3. 日志等（保持原有映射）
            _a[VITE_API_URL_PREFIX_LOG] = {
                target: 'http://api.aigc-v1.beesfpd.com',
                changeOrigin: true,
                rewrite: function (path) { return path.replace(/^\/log/, '/api'); },
            },
            _a),
    },
});
