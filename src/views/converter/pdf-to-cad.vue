<template>
    <div class="dwg-to-pdf-bg">
        <div class="dwg-to-pdf-top">
            <h1 class="main-title" style="font-size: 78px;">PDF转CAD在线转换</h1>
            <p class="main-desc"
                style="font-family: 'Source Sans Pro', 'sans-serif'; font-size: 24px;color: #7F7F7F;text-align: center;">
                支持PDF转CAD，100%免费在线操作，文件自动加密保护，无需安装客户端。一键上传，极速转换，保留原始比例与图层</p>
            <div class="upload-mask-wrapper" style="position: relative;">
                <el-upload class="upload-area" drag action="javascript:void(0);" :auto-upload="false"
                    :show-file-list="false" :on-change="onFileChange" :on-remove="handleRemove" accept=".pdf"
                    style="width: 859px; height: 363px;">
                    <template #default>
                        <div v-if="!file">
                            <img src="../../assets/upload-cloud-2-line.svg" style="width:48px;height:48px;" />
                            <div class="upload-text"
                                style="font-family: 'Source Sans Pro', 'sans-serif'; font-size: 20px;color: #000;text-align: center;">
                                拖拽或点击上传PDF文件</div>
                            <div
                                style="font-family: ' Source Sans Pro';font-size: 14px;color: #7F7F7F;text-align: center; font-weight: 400;">
                                仅支持DWG格式，单个文件不得大于100M</div>
                        </div>
                        <div v-else>
                            <div class="file-info-box">
                                <div class="icon-close-box"  @click.stop>
                                    <img :src="status === 'success' ? dwgIcon : pdfIcon"
                                        :alt="status === 'success' ? 'DWG图标' : 'PDF图标'" class="convert-page-icon" />
                                    <img src="../../assets/close-circle-fill.svg" class="close-btn"
                                        v-if="status === 'idle' || status === 'uploading'"
                                        @click.stop="resetUpload" title="重新上传" />
                                </div>
                                <div class="file-name">{{ file.name }} ({{ formatSize(file.size!) }})</div>
                                <el-button v-if="status === 'idle' || status === 'uploading'" class="convert-btn"
                                    type="primary" @click.stop="handleUpload(file.raw as File)">开始转换</el-button>
                                <div v-if="status === 'processing' || status === 'converting'" class="progress-center">
                                    <div class="progress-bar-box">
                                        <el-progress :percentage="progress" :stroke-width="18" 
                                            color="#000" style="width:220px;" :show-text="false" />
                                        <el-button class="cancel-btn" type="text" @click.stop="cancelConvert" style="font-size: 17px; color: #7F7F7F; background: none; border: none; padding-left: 5px;">取消</el-button>
                                    </div>
                                    <div class="progress-text">{{ progress }}%</div>
                                    <div class="convert-status">
                                        <el-icon v-if="status === 'processing' || status === 'converting'"
                                            class="spin-icon">
                                            <Loading />
                                        </el-icon>
                                        <el-icon v-else-if="status === 'success'" class="success-icon">
                                            <CircleCheckFilled />
                                        </el-icon>
                                        <span v-if="status === 'processing' || status === 'converting'">转换中</span>
                                        <!-- <span v-else-if="status === 'success'">转换成功</span> -->
                                    </div>
                                </div>
                                <template v-if="status === 'success' && downloadUrl">
                                    <span class="convert-status">
                                        <img src="../../assets/check-double-fill.svg" class="status-icon" />
                                        转换成功
                                    </span>
                                    <div style="display: flex; gap: 10px;">
                                        <el-button class="white-btn" type="default"
                                            @click.stop="resetUpload">再次上传</el-button>
                                        <el-button class="convert-btn" type="success"
                                            @click.stop="download">下载到本地</el-button>
                                    </div>

                                </template>
                                <el-button v-if="status === 'failed'" type="danger"
                                    @click.stop="handleUpload(file.raw as File)">重试</el-button>
                                <div v-if="errorMessage && status === 'failed'" class="file-error">{{
                                    errorMessage }}</div>
                            </div>
                        </div>
                    </template>
                </el-upload>
                <div v-if="!isLoggedIn" class="upload-mask" @click.stop="goLogin"
                    style="position: absolute; inset: 0; z-index: 10; background: rgba(255,255,255,0); cursor: pointer;">
                </div>
            </div>
            <div class="steps-title">如何免费将PDF 转换为CAD</div>
            <div class="steps">
                <div class="step">
                    <div class="step-num">1</div>
                    <div class="step-text">上传文件<br /><span>支持PDF格式</span></div>
                </div>
                <div class="step">
                    <div class="step-num">2</div>
                    <div class="step-text">选择输出格式<br /><span>点击开始转换，支持DWG/DXF格式</span></div>
                </div>
                <div class="step">
                    <div class="step-num">3</div>
                    <div class="step-text">下载PDF<br /><span>转换完成后即可下载DWG文件</span></div>
                </div>
            </div>
        </div>
        <div class="dwg-to-pdf-page">
            <!-- 介绍内容，仅替换此处，其他结构不动 -->
            <div class="section-title main-title">免费在线PDF转CAD工具：极速转换，无需安装</div>
            <div class="desc-center">
                支持各类PDF文件 → 专注单文件快速转换，文件自动加密，转换后立即删除。
            </div>
            <div class="section">
                <div class="section-title section-title-core">核心优势</div>
                <ul class="feature-list">
                    <li>✅ 纯在线操作：无需下载软件或插件，浏览器打开即用</li>
                    <li>✅ 极速转换：100MB文件10秒内完成，自动匹配原图比例</li>
                    <li>✅ 全格式兼容：支持AutoCAD 2000-2023所有版本DWG/DXF文件</li>
                    <li>✅ 100%隐私保障：SSL加密传输，文件2小时自动销毁</li>
                </ul>
            </div>
            <div class="section">
                <div class="section-title section-title-tech">技术保障</div>
                <ul class="feature-list">
                    <li><b>格式兼容性</b><br>智能识别CAD版本，自动处理字体嵌入问题，避免转换后文字丢失</li>
                    <li><b>基础排版保留</b><br>严格按1:1比例输出，确保线条与图形完整显示</li>
                    <li><b>实时故障检测</b><br>转换失败自动提示原因（如文件损坏、版本不兼容），并提供解决方案</li>
                </ul>
            </div>
            <div class="section">
                <div class="section-title section-title-faq">常见问题</div>
                <ul class="faq-list">
                    <li><b>转换后图纸不居中？</b><br>系统自动居中处理，若异常请检查原文件图框是否完整。</li>
                    <li><b>文件会被存储吗？</b><br>所有文件2小时后自动销毁，服务器不留存副本。</li>
                    <li><b>是否支持加密文件？</b><br>不支持，请解密去除密码后上传文件。</li>
                </ul>
            </div>
        </div>
        <!-- footer 移到页面最外层 -->
        <div class="footer">
            沪公网安备 31010702009578号 | 沪ICP备2021527689-3号 | Copyright © 上海蜂智擎人工智能技术有限公司版权所有
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFileConvert } from '@/api/useFileConvert'
import type { UploadFile } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { Loading, CircleCheckFilled, CircleCloseFilled } from '@element-plus/icons-vue'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

// 登录判断封装到 handleUpload
function handleUpload(file: File) {
    const token = localStorage.getItem('token')
    const currentPath = router.currentRoute.value.fullPath
    if (!token) {
        router.push({ path: '/login', query: { redirect: currentPath } })
        return
    }
    _handleUpload(file)
}

function handleRemove() {
    resetUpload()
}

const beforeClick = () => {
    const token = localStorage.getItem('token')
    const currentPath = router.currentRoute.value.fullPath
    if (!token) {
        router.push({ path: '/login', query: { redirect: currentPath } })
        return false
    }
    return true
}

const {
    progress,
    status,
    errorMessage,
    handleUpload: _handleUpload,
    downloadUrl,
    download,
    cleanup,
    reset
} = useFileConvert()

function cancelConvert() {
  status.value = 'idle'
  errorMessage.value = null
  progress.value = 0
  cleanup()
}

const file = ref<UploadFile | null>(null)

const isLoggedIn = computed(() => {
    return !!localStorage.getItem('token')
})
function goLogin() {
    const currentPath = router.currentRoute.value.fullPath
    router.push({ path: '/login', query: { redirect: currentPath } })
}

function onFileChange(uploadFile: UploadFile) {
    // 检查登录状态
    const token = localStorage.getItem('token')
    const currentPath = router.currentRoute.value.fullPath
    if (!token) {
        if (currentPath !== '/login') {
            router.push({ path: '/login', query: { redirect: currentPath } })
        } else {
            router.push({ path: '/login' })
        }
        return
    }

    if (uploadFile.raw) {
        file.value = uploadFile
    }
}

function removeFile() {
    file.value = null
    cleanup()
}

function resetUpload() {
    file.value = null
    reset()
}

function formatSize(size: number) {
    if (!size) return ''
    if (size < 1024) return size + 'B'
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + 'KB'
    return (size / 1024 / 1024).toFixed(1) + 'MB'
}

const pdfIcon = new URL('../../assets/PDF.svg', import.meta.url).href
const dwgIcon = new URL('../../assets/DWG.svg', import.meta.url).href
</script>

<style scoped>
.dwg-to-pdf-bg {
    width: 100%;
    min-height: 100vh;
    background-color: rgba(245, 246, 250, 1);
    display: flex;
    flex-direction: column;
    align-items: center;
}

.dwg-to-pdf-top {
    width: 100%;
    background: rgba(245, 246, 250, 1);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 0;
}

.dwg-to-pdf-page {
    /* 680 + 24*2 */
    padding: 32px 24px 16px 24px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    padding: 40px 32px 24px 32px;
    /* margin: 0 auto 40px auto; */
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.main-title {
    font-family: 'Source Sans Pro', 'sans-serif';
    font-weight: 700;
    font-size: 24px;
    color: #000000;
    text-align: center;
    margin-top: 80px;
    margin-bottom: 24px;
}

.main-desc {
    max-width: 780px;
    margin: 0 auto 24px auto;
    text-align: left;
    font-family: 'Source Sans Pro', 'sans-serif';
    font-weight: 400;
    font-size: 16px;
    color: #333333;
}

.main-desc,
.feature-list,
.section-title-core {
    box-sizing: border-box;
}

/* 移除 .upload-area 样式，只保留 el-upload 默认样式 */
.upload-icon {
    margin-bottom: 12px;
}

.upload-text {
    font-size: 17px;
    color: #333;
    margin-bottom: 6px;
}

.upload-tip {
    color: #aaa;
    font-size: 13px;
}

.steps-title {
    font-family: 'Source Sans Pro', 'sans-serif';
    font-weight: 700;
    font-size: 24px;
    color: #000000;
    margin: 27px 0;
}

.steps {
    display: flex;
    justify-content: center;
    gap: 267px;
    margin-bottom: 88px;
    margin-top: 27px;
}

.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 120px;
}

.step-num {
    width: 50px;
    height: 50px;
    background: #FABD33;
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-family: 'Source Sans Pro', 'sans-serif';
    font-weight: 400;
    margin-bottom: 8px;
}

.step-text {
    text-align: center;
    color: #000000;
    font-size: 16px;
    font-family: 'Source Sans Pro', 'sans-serif';
    font-weight: 700;
    margin-top: 15px;
}

.step-text span {
    font-family: 'Source Sans Pro', 'sans-serif';
    font-weight: 400;
    display: block;
    color: #333333;
    font-size: 13px;
    margin-top: 22px;
}

.section {
    width: 100%;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.section-title {
    text-align: center;
    font-family: 'Source Sans Pro', 'sans-serif';
    font-weight: 700;
    font-size: 24px;
    color: #000000;
}

.section-desc {
    color: #666;
    font-size: 15px;
    margin-bottom: 8px;
}

.feature-list,
.faq-list {
    width: 100%;
    max-width: 780px;
    margin: 0 auto;
    padding: 0;
    list-style: none;
    text-align: left;
}

.feature-list li,
.faq-list li {
    padding-left: 0;
    text-indent: 0;
    margin-bottom: 8px;
    text-align: left;
    box-sizing: border-box;
    font-size: 16px;
    color: #333333;
    font-family: 'Source Sans Pro', 'sans-serif';
}

.feature-list li {
    margin-bottom: 4px;
}

.tech-secure .section-desc {
    color: #2d8cf0;
}

.faq-list {
    list-style: none;
    color: #444;
    font-size: 15px;
    /* margin-left: 16px; */
}

.faq-list li {
    margin-bottom: 4px;
}

.footer {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #bbb;
    font-size: 13px;
    border-top: 1px solid #e5e6eb;
    margin-top: 0;
    word-break: break-all;
    background: #fff;
    position: relative;
    box-sizing: border-box;
}

.upload-area:deep(.el-upload-dragger) {
    height: 363px;
    width: 100%;
    min-height: unset;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.section-desc.main-desc {
    font-family: 'Source Sans Pro', 'sans-serif';
    font-weight: 400;
    font-size: 16px;
    color: #333333;
}

.section .section-title.section-title-core {
    font-family: 'Source Sans Pro', 'sans-serif';
    font-weight: 700;
    font-size: 16px;
    color: #333333;
    text-align: left;
    margin-bottom: 8px;
    max-width: 780px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 0;
}

.desc-center {
    width: 100%;
    max-width: 780px;
    margin: 0 auto 24px auto;
    text-align: left;
    font-family: 'Source Sans Pro', 'sans-serif';
    font-weight: 400;
    font-size: 16px;
    color: #333333;
}

.section-title.section-title-tech,
.section-title.section-title-faq {
    margin-top: 111px;
    margin-bottom: 24px;
}

.convert-btn {
    width: 169px;
    height: 63px;
    background: inherit;
    background-color: rgba(0, 0, 0, 1) !important;
    border-radius: 6px;
    filter: drop-shadow(none);
    transition: none;
    font-size: 17px;
    color: #fff !important;
    border: none;
    box-shadow: none;
    padding: 0;
    line-height: 63px;
    display: inline-block;
}

.convert-btn:hover,
.convert-btn:focus {
    background-color: #222 !important;
    color: #fff !important;
    filter: none;
    box-shadow: none;
}

.white-btn {
    width: 169px;
    height: 63px;
    background: inherit;
    background-color: #fff !important;
    box-sizing: border-box;
    border-width: 1px !important;
    border-style: solid !important;
    border-color: #000 !important;
    border-radius: 6px;
    filter: drop-shadow(none);
    transition: none;
    font-family: "PingFang SC", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 17px;
    color: #000 !important;
    box-shadow: none !important;
    padding: 0;
    line-height: 63px;
    display: inline-block;
}

.white-btn:hover,
.white-btn:focus {
    background-color: #f5f5f5 !important;
    color: #000 !important;
    border-color: #000 !important;
    box-shadow: none !important;
}

.convert-page-icon {
    width: 80px;
    height: auto;
    display: block;
    margin: 0 auto 12px auto;
}

.file-info-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding: 18px 0;
}

.icon-close-box {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-btn {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 22px;
    height: 22px;
    background: #fff;
    border-radius: 50%;
    color: #888;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    border: 1px solid #eee;
    transition: background 0.2s, color 0.2s;
    z-index: 2;
}

.close-btn:hover {
    background: #f56c6c;
    color: #fff;
    border-color: #f56c6c;
}

.progress-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 16px 0;
}

.progress-bar-box {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 220px;
}

.progress-close-btn {
    position: absolute;
    right: -18px;
    top: 50%;
    transform: translateY(-50%);
    width: 22px;
    height: 22px;
    background: #fff;
    border-radius: 50%;
    color: #888;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    border: 1px solid #eee;
    transition: background 0.2s, color 0.2s;
    z-index: 2;
}

.progress-close-btn:hover {
    background: #f56c6c;
    color: #fff;
    border-color: #f56c6c;
}

.file-name {
    margin-bottom: 12px;
    font-size: 16px;
    color: #333;
    text-align: center;
    word-break: break-all;
    max-width: 90vw;
}

.progress-text {
    text-align: center;
    color: #000;
    font-size: 15px;
    margin-top: 4px;
}

.file-error {
    color: #f56c6c;
    margin-top: 8px;
    text-align: center;
}

.convert-status {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 8px;
    font-size: 16px;
    color: #FABD33;
    gap: 6px;
}

.spin-icon {
    animation: spin 1s linear infinite;
    font-size: 20px;
    color: #FABD33;
}

.success-icon {
    color: #FABD33;
    font-size: 20px;
}

.status-icon {
    width: 20px;
    height: 20px;
    margin-right: 4px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@media (max-width: 900px) {
    .dwg-to-pdf-top {
        padding-top: 20px;
    }

    .main-title {
        font-size: 22px;
    }

    .main-desc {
        font-size: 15px;
        margin-bottom: 18px;
    }

    .upload-area {
        width: 98vw !important;
        max-width: 100vw !important;
        height: 220px !important;
        border-radius: 10px;
    }

    .upload-area:deep(.el-upload-dragger) {
        height: 220px !important;
        min-height: unset;
        padding: 0 10px;
    }

    .steps {
        flex-direction: column;
        gap: 18px;
        align-items: center;
    }

    .step {
        width: 100%;
        max-width: 320px;
    }

    .dwg-to-pdf-page {
        padding: 18px 6px 12px 6px;
        margin: 0 auto 18px auto;
        border-radius: 8px;
    }

    .file-card-header {
        margin-bottom: 10px;
    }

    .file-name {
        font-size: 15px;
    }

    .file-size {
        font-size: 12px;
    }

    .file-remove {
        font-size: 18px;
    }

    .file-status,
    .file-error {
        font-size: 13px;
    }

    .upload-text {
        font-size: 15px;
    }

    .convert-page-icon {
        width: 48px;
        margin-bottom: 8px;
    }
}

@media (max-width: 600px) {
    .main-title {
        font-size: 16px;
    }

    .main-desc {
        font-size: 13px;
    }

    .upload-area {
        height: 140px !important;
        border-radius: 6px;
    }

    .upload-area:deep(.el-upload-dragger) {
        height: 140px !important;
        border-radius: 6px;
        padding: 0 2px;
    }

    .dwg-to-pdf-page {
        padding: 8px 2px 6px 2px;
        border-radius: 4px;
    }

    .section-title {
        font-size: 15px;
    }

    .section-desc,
    .feature-list,
    .faq-list {
        font-size: 12px;
    }

    .file-card-header {
        margin-bottom: 6px;
    }

    .file-name {
        font-size: 12px;
    }

    .file-size {
        font-size: 10px;
    }

    .file-remove {
        font-size: 14px;
    }

    .file-status,
    .file-error {
        font-size: 10px;
    }

    .upload-text {
        font-size: 12px;
    }
}
</style>