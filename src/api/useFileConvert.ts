import { ref } from 'vue'
import { uploadFile } from '@/api/userCenter'
import axios from 'axios'

export function useFileConvert() {
  const fileId = ref<string | null>(null)
  const taskId = ref<string | null>(null)
  const progress = ref<number>(0)
  const status = ref<'idle' | 'uploading' | 'converting' | 'processing' | 'success' | 'failed'>('idle')
  const errorMessage = ref<string | null>(null)
  const downloadUrl = ref<string | null>(null)
  let pollTimer: any = null

  // 上传文件
  async function handleUpload(file: File) {
    status.value = 'uploading'
    errorMessage.value = null
    progress.value = 0
    fileId.value = null
    taskId.value = null
    downloadUrl.value = null
    try {
      const formData = new FormData()
      formData.append('file', file)
      // 这里用 any 类型，兼容 dynamic 字段
      const res: any = await uploadFile(formData)
      if (res.success && res.data && res.data.fileId) {
        fileId.value = res.data.fileId
        status.value = 'converting'
        await startConvert()
      } else {
        throw new Error(res.error || '上传失败')
      }
    } catch (e: any) {
      status.value = 'failed'
      errorMessage.value = e.message || '上传失败'
    }
  }

  // 发起转换
  async function startConvert() {
    if (!fileId.value) return
    try {
      const res = await axios.post(`/api/file/${fileId.value}/convert/pdf/to/dwg`)
      if (res.data && res.data.success && res.data.data && res.data.data.taskId) {
        taskId.value = res.data.data.taskId
        status.value = 'processing'
        pollProgress()
      } else {
        throw new Error(res.data.error || '发起转换失败')
      }
    } catch (e: any) {
      status.value = 'failed'
      errorMessage.value = e.message || '发起转换失败'
    }
  }

  // 轮询进度
  async function pollProgress() {
    if (!taskId.value) return
    pollTimer && clearTimeout(pollTimer)
    try {
      const res = await axios.get(`/api/file/task/${taskId.value}/status`)
      if (res.data && res.data.success && res.data.data) {
        progress.value = res.data.data.progress
        if (progress.value === 100) {
          status.value = 'success'
          downloadUrl.value = `/api/file/${fileId.value}/dwg/download`
          return
        } else if (res.data.data.status === 'failed') {
          status.value = 'failed'
          errorMessage.value = res.data.data.errorMessage || '转换失败'
          return
        }
      }
      pollTimer = setTimeout(pollProgress, 1500)
    } catch (e: any) {
      status.value = 'failed'
      errorMessage.value = e.message || '查询进度失败'
    }
  }

  // 下载
  function download() {
    if (downloadUrl.value) {
      window.open(downloadUrl.value, '_blank')
    }
  }

  // 清理定时器
  function cleanup() {
    pollTimer && clearTimeout(pollTimer)
  }

  // 重置所有状态
  function reset() {
    fileId.value = null
    taskId.value = null
    progress.value = 0
    status.value = 'idle'
    errorMessage.value = null
    downloadUrl.value = null
    pollTimer && clearTimeout(pollTimer)
  }

  return {
    fileId,
    taskId,
    progress,
    status,
    errorMessage,
    downloadUrl,
    handleUpload,
    download,
    cleanup,
    reset
  }
} 