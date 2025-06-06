import { ref } from 'vue'

// 预设的暗色主题配置
const darkTheme = {
  'el-text-color-primary': '#ffffff',
  'el-text-color-regular': '#e5eaf3',
  'el-text-color-secondary': '#a3a6ad',
  'el-text-color-placeholder': '#8d9095',
  'el-text-color-disabled': '#6c6e72',
  'el-border-color': '#4c4d4f',
  'el-border-color-light': '#414243',
  'el-border-color-lighter': '#363637',
  'el-border-color-extra-light': '#2b2b2c',
  'el-bg-color': '#141414',
  'el-bg-color-page': '#0a0a0a',
  'el-bg-color-overlay': '#1d1e1f',
  'el-box-shadow': '0 12px 32px 4px rgba(0, 0, 0, .36), 0 8px 20px rgba(0, 0, 0, .72)',
  'el-box-shadow-light': '0 0 12px rgba(0, 0, 0, .72)',
  'el-box-shadow-lighter': '0 0 6px rgba(0, 0, 0, .72)',
  'el-fill-color': '#262727',
  'el-fill-color-light': '#1d1d1d',
  'el-fill-color-lighter': '#262727',
  'el-fill-color-extra-light': '#2b2b2c',
  'el-fill-color-dark': '#363637',
  'el-fill-color-blank': 'transparent',
  'el-mask-color': 'rgba(0, 0, 0, .8)',
  'el-mask-color-extra-light': 'rgba(0, 0, 0, .3)',
  'el-menu-bg-color': '#141414',
  'el-menu-text-color': '#ffffff',
  'el-menu-active-color': '#409eff',
  'el-menu-hover-bg-color': '#0c2135'
}

// 预设的亮色主题配置
const lightTheme = {
  'el-text-color-primary': '#303133',
  'el-text-color-regular': '#606266',
  'el-text-color-secondary': '#909399',
  'el-text-color-placeholder': '#a8abb2',
  'el-text-color-disabled': '#c0c4cc',
  'el-border-color': '#dcdfe6',
  'el-border-color-light': '#e4e7ed',
  'el-border-color-lighter': '#ebeef5',
  'el-border-color-extra-light': '#f2f6fc',
  'el-bg-color': '#ffffff',
  'el-bg-color-page': '#f2f3f5',
  'el-bg-color-overlay': '#ffffff',
  'el-box-shadow': '0 12px 32px 4px rgba(0, 0, 0, .04), 0 8px 20px rgba(0, 0, 0, .08)',
  'el-box-shadow-light': '0 0 12px rgba(0, 0, 0, .12)',
  'el-box-shadow-lighter': '0 0 6px rgba(0, 0, 0, .12)',
  'el-fill-color': '#f0f2f5',
  'el-fill-color-light': '#f5f7fa',
  'el-fill-color-lighter': '#fafafa',
  'el-fill-color-extra-light': '#fafcff',
  'el-fill-color-dark': '#ebedf0',
  'el-fill-color-blank': '#ffffff',
  'el-mask-color': 'rgba(255, 255, 255, .9)',
  'el-mask-color-extra-light': 'rgba(255, 255, 255, .3)',
  'el-menu-bg-color': '#ffffff',
  'el-menu-text-color': '#303133',
  'el-menu-active-color': '#409eff',
  'el-menu-hover-bg-color': '#ecf5ff'
}

// 更新CSS变量
function updateCssVar(prop: string, value: string) {
  document.documentElement.style.setProperty(`--${prop}`, value)
}

// 主题状态
export const isDark = ref(false)

// 应用主题
export function applyTheme() {
  const theme = isDark.value ? darkTheme : lightTheme
  Object.entries(theme).forEach(([key, value]) => {
    updateCssVar(key, value)
  })
  
  // 更新类名
  document.documentElement.classList.toggle('dark', isDark.value)
}

// 切换暗色/亮色主题
export function toggleDark() {
  isDark.value = !isDark.value
  applyTheme()
} 