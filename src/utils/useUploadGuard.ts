import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
// import { useUserStore } from '../stores/user'
import type { UploadFile } from 'element-plus'

export function useUploadGuard(maxSize: number) {
  // const userStore = useUserStore()
  const router = useRouter()
  const route = useRoute()
  
  const beforeUpload = () => {
    // 检查 localStorage 中的 token，与 request.ts 中的逻辑保持一致
    const token = localStorage.getItem('token')
    if (!token) {
      router.push({ path: '/login', query: { redirect: route.fullPath } })
      return false
    }
    return true
  }
  const handleFileChange = (file: UploadFile) => {
    if (!file.size) return
    if (file.size > maxSize) {
      ElMessage.error(`单文件最大不超过${maxSize / 1024 / 1024}MB`)
    }
  }
  return { beforeUpload, handleFileChange }
} 