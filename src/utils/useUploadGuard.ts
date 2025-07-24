import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'
import type { UploadFile } from 'element-plus'

export function useUploadGuard(maxSize: number) {
  const userStore = useUserStore()
  const beforeUpload = () => {
    if (!userStore.isLoggedIn) {
      window.location.href = '/login'
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