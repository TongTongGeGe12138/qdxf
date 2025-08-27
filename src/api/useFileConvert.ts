import { ref } from 'vue'
import { uploadFile } from '@/api/userCenter'
import { request } from '@/utils/request'

export function useFileConvert() {
  type ConvertDirection = 'pdf-to-dwg' | 'dwg-to-pdf' | 'dwg-to-svg' | 'dwg-to-png'
  const CONVERT_CONFIG: Record<ConvertDirection, { startPath: (fileId: string) => string; downloadPath: (fileId: string) => string }> = {
    'pdf-to-dwg': {
      startPath: (fileId: string) => `/file/${fileId}/convert/pdf/to/dwg`,
      downloadPath: (fileId: string) => `/api/file/${fileId}/dwg/download`
    },
    'dwg-to-pdf': {
      startPath: (fileId: string) => `/file/${fileId}/convert/dwg/to/pdf`,
      downloadPath: (fileId: string) => `/api/file/${fileId}/pdf/download`
    },
    'dwg-to-svg': {
      startPath: (fileId: string) => `/file/${fileId}/convert/dwg/to/svg`,
      downloadPath: (fileId: string) => `/api/file/${fileId}/svg/download`
    },
    'dwg-to-png': {
      startPath: (fileId: string) => `/file/${fileId}/convert/dwg/to/png`,
      downloadPath: (fileId: string) => `/api/file/${fileId}/png/download`
    }
  }
  const fileId = ref<string | null>(null)
  const taskId = ref<string | null>(null)
  const progress = ref<number>(0)
  const status = ref<'idle' | 'uploading' | 'converting' | 'processing' | 'success' | 'failed'>('idle')
  const errorMessage = ref<string | null>(null)
  const downloadUrl = ref<string | null>(null)
  // 转换方向，默认与原逻辑一致：pdf -> dwg；可扩展 dwg -> pdf / png
  const convertDirection = ref<ConvertDirection>('pdf-to-dwg')
  let pollTimer: any = null

  // DWG -> PDF 默认参数（后端将使用这些配置进行导出）
  const DEFAULT_DWG_TO_PDF_OPTIONS = {
    exportAllLayouts: false,
    layouts: null as null | string[] | string,
    zoomToExtents: true,
    paper: 'custom',
    orientation: 'auto' as 'portrait' | 'landscape' | 'auto',
    paperWidthMm: 1188,
    paperHeightMm: 1682,
    geomDpi: 600,
    colorDpi: null as null | number,
    bwDpi: null as null | number,
    embedTtf: false,
    embedTtfOptimized: false,
    ttfAsGeometry: false,
    shxAsGeometry: false,
    searchableTtf: false,
    searchableShx: false,
    enableLayers: true,
    includeOffLayers: false,
    solidHatchMode: null as null | string,
    gradientHatchMode: null as null | string,
    extentsBoundingBox: false,
    flateCompression: true,
    asciiHexEncoding: false,
    useHLR: false,
    exportHyperlinks: true,
    linearized: false,
    measuring: true,
    geoMeasure: false,
    colorPolicy: 'asis' as 'asis' | 'monochrome' | 'grayscale',
    pdfa: 'none' as 'none' | 'pdfa1b' | 'pdfa2b' | 'pdfa3b',
    splitLayoutsZip: true
  }

  // DWG -> SVG 默认参数
  const DEFAULT_DWG_TO_SVG_OPTIONS = {
    exportAllLayouts: false,
    layouts: null as null | string[] | string,
    splitLayoutsZip: true,
    zoomToExtents: true,
    width: 6210,
    height: 5630,
    palette: 'light' as 'light' | 'dark',
    hatchAsPolygon: true,
    plotLineweights: true,
    imageBase: '' as string,
    imageUrl: '' as string,
    defaultImageExt: '.png' as '.png' | '.jpg' | '.jpeg' | '.webp',
    minimalWidth: 0.1,
    lineWeightScale: 1,
    colorPolicy: 0 as 0 | 1 | 2 | 3
  }

  // DWG -> PNG 默认参数（与 SVG 一致，仅接口目标为 png）
  const DEFAULT_DWG_TO_PNG_OPTIONS = {
    exportAllLayouts: false,
    layouts: null as null | string[] | string,
    splitLayoutsZip: true,
    zoomToExtents: true,
    width: 6210,
    height: 5630,
    scaleMode: "cover",
    transparentBackground: false,
    backgroundColor: "#FFFFFF"
  }

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
      // 保留原始文件名，便于后端基于扩展名判断格式
      formData.append('file', file, (file as any)?.name || 'upload.bin')
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

  // 针对不同页面的便捷方法（无需页面关心方向设置）
  async function uploadPdfToDwg(file: File) {
    setConvertDirection('pdf-to-dwg')
    return handleUpload(file)
  }

  async function uploadDwgToPdf(file: File) {
    setConvertDirection('dwg-to-pdf')
    return handleUpload(file)
  }

  async function uploadDwgToSvg(file: File) {
    setConvertDirection('dwg-to-svg')
    return handleUpload(file)
  }

  async function uploadDwgToPng(file: File) {
    setConvertDirection('dwg-to-png')
    return handleUpload(file)
  }

  // 发起转换
  async function startConvert() {
    if (!fileId.value) return
    try {
      const convertUrl = CONVERT_CONFIG[convertDirection.value].startPath(fileId.value)
      const payload =
        convertDirection.value === 'dwg-to-pdf'
          ? DEFAULT_DWG_TO_PDF_OPTIONS
          : convertDirection.value === 'dwg-to-svg'
          ? DEFAULT_DWG_TO_SVG_OPTIONS
          : convertDirection.value === 'dwg-to-png'
          ? DEFAULT_DWG_TO_PNG_OPTIONS
          : undefined
      const res = await request.post({ url: convertUrl, data: payload })
      if (res.success && res.data && res.data.taskId) {
        taskId.value = res.data.taskId
        status.value = 'processing'
        pollProgress()
      } else {
        throw new Error(res.error || '发起转换失败')
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
      const res = await request.get({ url: `/file/task/${taskId.value}/status` })
      if (res.success && res.data) {
        progress.value = res.data.progress
        if (progress.value === 100) {
          status.value = 'success'
          downloadUrl.value = CONVERT_CONFIG[convertDirection.value].downloadPath(fileId.value!)
          return
        } else if (res.data.status === 'failed') {
          status.value = 'failed'
          errorMessage.value = res.data.errorMessage || '转换失败'
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
      // window.open('https://api-work.beesfpd.com'+downloadUrl.value,'_self')
      window.open('http://192.168.15.200:9400'+downloadUrl.value,'_self')
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

  // 设置转换方向
  function setConvertDirection(direction: ConvertDirection) {
    convertDirection.value = direction
  }

  return {
    fileId,
    taskId,
    progress,
    status,
    errorMessage,
    downloadUrl,
    convertDirection,
    setConvertDirection,
    handleUpload,
    uploadPdfToDwg,
    uploadDwgToPdf,
    uploadDwgToSvg,
    uploadDwgToPng,
    download,
    cleanup,
    reset
  }
} 