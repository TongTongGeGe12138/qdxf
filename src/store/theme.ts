import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)
  
  // 主题色配置
  const lightTheme = {
    primary: '#409eff',
    success: '#67c23a',
    warning: '#e6a23c',
    danger: '#f56c6c',
    background: '#f0f2f5',
    menuBg: '#ffffff',
    menuText: '#303133',
    menuActiveText: '#409eff',
    menuHover: '#f6f6f6',
    headerBg: '#ffffff',
    headerText: '#303133',
    borderColor: '#e4e7ed',
    borderLightColor: '#e6e6e6',
    borderDarkColor: '#dcdfe6'
  }
  
  const darkTheme = {
    primary: '#409eff',
    success: '#67c23a',
    warning: '#e6a23c',
    danger: '#f56c6c',
    background: '#1f1f1f',
    menuBg: '#141414',
    menuText: '#909399',
    menuActiveText: '#409eff',
    menuHover: '#000000',
    headerBg: '#141414',
    headerText: '#ffffff',
    borderColor: '#303030',
    borderLightColor: '#242424',
    borderDarkColor: '#363636'
  }

  // 切换主题
  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme()
  }

  // 应用主题
  const applyTheme = () => {
    const theme = isDark.value ? darkTheme : lightTheme
    const root = document.documentElement
    
    // 设置CSS变量
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value)
    })
    
    // 设置Element Plus的主题
    root.className = isDark.value ? 'dark' : ''

    // 设置Element Plus的边框颜色
    root.style.setProperty('--el-border-color', theme.borderColor)
    root.style.setProperty('--el-border-color-light', theme.borderLightColor)
    root.style.setProperty('--el-border-color-darker', theme.borderDarkColor)
  }

  return {
    isDark,
    toggleTheme,
    applyTheme
  }
}) 