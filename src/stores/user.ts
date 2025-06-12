import { defineStore } from 'pinia'
import { UserLoginOut } from '@/api/userCenter'
import { ElMessage } from 'element-plus'
import router from '@/router'

interface UserState {
  sessionId: number | null
  accessToken: string
  refreshToken: string
  extra: any
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    sessionId: null,
    accessToken: '',
    refreshToken: '',
    extra: null
  }),
  
  getters: {
    isLoggedIn(): boolean {
      return !!this.accessToken
    }
  },
  
  actions: {
    setUserInfo(data: Partial<UserState>) {
      // 更新 store 状态
      if (data.sessionId) this.sessionId = data.sessionId
      if (data.accessToken) this.accessToken = data.accessToken
      if (data.refreshToken) this.refreshToken = data.refreshToken
      if (data.extra !== undefined) this.extra = data.extra

      // 同步到 sessionStorage
      sessionStorage.setItem('userInfo', JSON.stringify({
        sessionId: this.sessionId,
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
        extra: this.extra
      }))
    },

    loadUserInfo() {
      const userInfo = sessionStorage.getItem('userInfo')
      if (userInfo) {
        const data = JSON.parse(userInfo)
        this.setUserInfo(data)
      }
    },

    clearUserInfo() {
      this.sessionId = null
      this.accessToken = ''
      this.refreshToken = ''
      this.extra = null
      sessionStorage.removeItem('userInfo')
    },

    async logout() {
      try {
        const res = await UserLoginOut()
        if (res.code === 200) {
          this.clearUserInfo()
          ElMessage.success('退出登录成功')
          // 跳转到登录页
          router.push('/login')
        } else {
          ElMessage.error(res.message || '退出登录失败')
        }
      } catch (error) {
        console.error('退出登录错误：', error)
        ElMessage.error('退出登录失败，请稍后重试')
        // 即使接口调用失败，也清除本地登录信息
        this.clearUserInfo()
        router.push('/login')
      }
    }
  }
}) 