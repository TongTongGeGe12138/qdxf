import { createApp } from 'vue'
import './style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { initTheme } from './utils/theme'
import { useUserStore } from './stores/user'
import { gsap } from 'gsap'
import '@/assets/fonts/font.css'
window.gsap = gsap
// 初始化主题
initTheme()

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)
app.use(router)
app.use(store)

// 初始化用户信息
const userStore = useUserStore()
userStore.loadUserInfo()

app.mount('#app')
