<template>
    <div class="workspace-container" @click.stop>
        <el-card class="box-card" :style="{ backgroundColor: cardBgColor }">
            <template #header>
                <div class="card-header">
                    <span>{{ title }}</span>
                </div>
            </template>
            <div class="workspace-content">
                <!-- 顶部导航栏 -->
                <div class="content-top">
                    <div class="content-top-left">
                        <div class="content-top-left-item" v-for="(item, index) in navtitle" :key="item"
                            :class="{ active: activeIndex === index }" @click="activeIndex = index">
                            <span>{{ item }}</span>
                        </div>
                    </div>
                    <div class="content-top-right">
                        <el-input v-model="searchValue" placeholder="搜索" class="search-input" :prefix-icon="Search"
                            clearable size="small" @input="handleSearch" />
                        <div class="right-tabs">
                            <div class="right-tab" @click="handleRefreshList">
                                <el-icon :size="18" style="margin-right: 4px;">
                                    <Refresh />
                                </el-icon>
                                <span>刷新列表</span>
                            </div>
                            <div class="right-tab" @click="handleCreateProject">
                                <el-icon :size="18" style="margin-right: 4px;">
                                    <FolderAdd />
                                </el-icon>
                                <span>新建</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 内容区域 -->
                <div class="content-main">
                    <div class="content-left">
                        <!-- 项目列表网格 -->
                        <div class="projects-grid" v-if="projectList.length > 0">
                            <div class="project-card" v-for="project in projectList" :key="project.id"
                                @click="handleAppCardClick(project)">
                                <div class="project-thumbnail">
                                    <img v-if="project.preview" :src="project.preview" :alt="project.name" />
                                    <div v-else class="no-preview">
                                        <el-icon :size="40">
                                            <Picture />
                                        </el-icon>
                                    </div>
                                </div>
                                <div class="project-info">
                                    <div class="project-info-icon" :class="isDark ? 'dark-mode' : 'light-mode'">
                                        <img v-if="project.aigcCategory" :src="getIconUrl(project.aigcCategory)" :alt="project.name" class="info-icon" />
                                    </div>
                                    <div class="project-text-content">
                                        <h4 class="project-name">{{ project.name }}</h4>
                                        <p class="project-time" v-if="project.createdAt">{{ formatDate(project.createdAt) }}</p>
                                    </div>
                                    <div class="project-actions">
                                        <div class="action-btn" @click.stop="handleOpenProject(project)">
                                            <el-icon :size="16" style="margin-right: 4px;">
                                                <FolderAdd />
                                            </el-icon>
                                            <span>打开</span>
                                        </div>
                                        <div class="action-btn" @click.stop="handleDeleteProject(project)">
                                            <el-icon :size="16" style="margin-right: 4px;">
                                                <Delete />
                                            </el-icon>
                                            <span>删除</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <el-empty description="暂无项目数据" :image-size="40" />
                        </div>
                    </div>
                </div>

                <!-- 底部分页 -->
                <div class="pagination-container">
                    <el-pagination layout="prev, pager, next, jumper, ->, total" :total="total" :page-size="pageSize"
                        :current-page="currentPage" @current-change="handlePageChange" />
                </div>
            </div>
        </el-card>

        <!-- 新建项目弹窗 -->
        <el-dialog v-model="createDialogVisible" title="选择应用" width="800px" :close-on-click-modal="false"
            :close-on-press-escape="false">
            <!-- 搜索和筛选行 -->
            <div class="search-section">
                <div class="search-input">
                    <el-input v-model="selectionSearchText" placeholder="搜索应用..." :prefix-icon="Search"
                        class="search-input" />
                </div>
                <div class="tags">
                    <el-tag v-for="tag in selectionTags" :key="tag.name"
                        :class="{ 'is-active': selectionActiveTag === tag.name }"
                        @click="selectionActiveTag = tag.name">
                        {{ tag.name }}
                    </el-tag>
                </div>
            </div>

            <!-- 应用卡片网格 -->
            <div class="card-grid">
                <div v-for="(item, index) in filteredSelectionList" :key="index" class="card-wrapper">
                    <div class="card" @click="handleAppCardClick(item)">
                        <div class="fire-icon-container" :class="isDark ? 'dark-mode' : 'light-mode'">
                            <img v-if="item.value" :src="getIconUrl(item.value)" :alt="item.name" class="fire-icon" />
                        </div>
                        <div class="card-content">
                            <div class="card-title">{{ item.title }}</div>
                            <div class="card-desc">{{ item.extra?.englishName }}</div>
                        </div>
                        <!-- 在卡片右下角显示"最近使用"文字 -->
                        <div v-if="dialogSource === 'open' && index === 0 && recentlyUsedApp" class="recently-used-label">
                            最近使用
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>

        <!-- 应用详情弹窗 -->
        <el-dialog v-model="appPreviewDialogVisible" width="700px" :close-on-click-modal="false"
            class="standard-dialog app-dialog" @closed="handleAppDialogClose">
            <el-scrollbar>
                <div class="app-dialog-content">
                    <div class="app-header">
                        <div class="app-icon fire-icon-container" :class="isDark ? 'dark-mode' : 'light-mode'">
                            <img v-if="currentCard?.value" :src="getIconUrl(currentCard.value)" :alt="currentCard.name"
                                class="fire-icon" @error="console.log('Failed to load image:', currentCard.value)" />
                        </div>
                        <div class="app-title">
                            <div class="name">{{ currentCard?.name }}</div>
                            <div class="desc">{{ currentCard?.extra?.englishName }}</div>
                        </div>
                        <el-button type="primary" class="launch-btn" @click="handleLaunchClick">启动应用</el-button>
                    </div>
                    <div class="app-desc">
                        {{ currentCard?.description || (currentCard?.name +
                            '，无需本地部署，通过云端在线服务，实现智能给排水调试、喷头一键生成、管线自动布置。基于消防规范与智能算法，快速生成合规设计方案，支持多场景应用，助力企业高效完成消防系统设计与运维，降低成本与安全风险。')
                        }}
                    </div>
                    <div class="app-preview">
                        <div class="app-preview-header">
                            <span class="app-preview-title">应用介绍</span>
                        </div>
                        <div class="preview-container">
                            <img src="@/assets/operate/one.png" alt="应用截图" class="preview-image" />
                        </div>
                    </div>
                </div>
            </el-scrollbar>
            <div class="version-info">
                版本：{{ currentCard?.extra?.version }}
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { isDark } from '../../utils/theme'
import { Refresh, Search, Picture, FolderAdd, Delete } from '@element-plus/icons-vue'
import { getAigcProjectList, getAigcPrimaryList, getAigcChildrenList } from '@/api/aigc'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { ProjectItem } from '@/api/model/detailModel'
import { stashToken } from '@/api/userCenter'
import { RC4Encrypt } from '../../utils/crypto'
import { logPost } from '../../utils/log'
import { useUserStore } from '@/stores/user'

// 项目相关数据
const title = ref('工作空间')
const navtitle = ref(['最近绘制'])
const activeIndex = ref(0)
const searchValue = ref('')
const projectList = ref<any[]>([])
const total = ref(0)
const pageSize = ref(20)
const currentPage = ref(1)
const loading = ref(false)
let searchTimeout: any = null

// 初始化用户 store
const userStore = useUserStore()

// 弹框相关状态
const createDialogVisible = ref(false)  // 第一个弹框（搜索+卡片网格）
const appPreviewDialogVisible = ref(false)  // 第二个弹框（应用详情）
const selectedApp = ref<any>(null)  // 选中的应用
const currentCard = ref<any>(null)  // 当前卡片详情
const dialogSource = ref<'new' | 'open'>('new') // 弹框来源：'new' 或 'open'

// 选择对话框数据
const selectionSearchText = ref('')
const selectionActiveTag = ref('所有')
const selectionTags = [
    { name: '所有' },
    { name: '智能给排水' },
    { name: '智能电气' },
    { name: '智能暖通' }
]

// 从API获取的应用列表数据
const selectionAppList = ref<any[]>([])
const allList = ref<ProjectItem[]>([])
const secondary = ref('')
const recentlyUsedApp = ref<any>(null) // 最近使用的应用

// 获取图标 URL
const getIconUrl = (name: string) => {
    if (!name) return ''
    try {
        return new URL(`../../assets/tb/${name}.svg`, import.meta.url).href
    } catch (error) {
        return ''
    }
}

// 样式计算属性
const cardBgColor = computed(() => isDark.value ? 'rgb(10,10,10)' : 'rgba(255, 255, 255, 1)')
const cardHoverBgColor = computed(() => isDark.value ? '#1B2126' : '#FFF8CC')
const menuTextColor = computed(() => isDark.value ? '#EDEDED' : '#13343C')
const desktopBboder = computed(() => isDark.value ? 'rgba(231,231,224,.3)' : '#D7D7D7')
const subTextColor = computed(() => isDark.value ? '#A1A1A1' : '#A1A1A1')
const vTextColor = computed(() => isDark.value ? '#EDEDED' : '#13343C')
const borderColor = computed(() => isDark.value ? 'transparent' : 'transparent')
const menuBgColor = computed(() => isDark.value ? '#000' : '#fff')

// 搜索和标签相关计算属性
const searchInputBorderColor = computed(() => isDark.value ? 'rgba(255, 255, 255, .3)' : '#dcdfe6')
const tagsBgColor = computed(() => isDark.value ? '#0A0A0A' : '#faf9f5')
const tagTextColor = computed(() => isDark.value ? '#C4C4D3' : '#000000')
const tagHoverBgColor = computed(() => isDark.value ? '#1B2126' : '#F9F9F9')
const tagActiveBgColor = computed(() => isDark.value ? '#191919' : '#F2F2F2')

// 计算过滤后的应用列表
const filteredSelectionList = computed(() => {
    let filtered = selectionAppList.value

    // 标签筛选
    if (selectionActiveTag.value !== '所有') {
        filtered = filtered.filter(item => item.extra?.group === selectionActiveTag.value)
    }

    // 搜索文本筛选
    if (selectionSearchText.value) {
        const searchLower = selectionSearchText.value.toLowerCase()
        filtered = filtered.filter(item =>
            item.title.toLowerCase().includes(searchLower) ||
            item.extra?.englishName?.toLowerCase().includes(searchLower) ||
            (item.value && item.value.toLowerCase().includes(searchLower))
        )
    }

    // 如果是打开模式且有最近使用的应用，将其排在第一个
    if (dialogSource.value === 'open' && recentlyUsedApp.value) {
        const recentApp = recentlyUsedApp.value
        // 检查最近使用的应用是否在过滤列表中
        const isInList = filtered.some(item => item.value === recentApp.value)
        if (isInList) {
            // 移除最近使用应用（因为它已在列表中）
            filtered = filtered.filter(item => item.value !== recentApp.value)
            // 将其放到第一位
            filtered.unshift(recentApp)
        }
    }

    return filtered
})

// 获取项目列表
const fetchProjectList = async (page: number = 1, search?: string) => {
    loading.value = true
    try {
        const res = await getAigcProjectList(page, pageSize.value, search)
        if (res && res.code === 200) {
            projectList.value = res.data?.data || res.data || []
            total.value = res.data?.total || 0
            currentPage.value = page
        } else {
            ElMessage.error('获取项目列表失败')
            projectList.value = []
        }
    } catch (error) {
        console.error('获取项目列表失败:', error)
        ElMessage.error('获取项目列表失败')
        projectList.value = []
    } finally {
        loading.value = false
    }
}

// 获取应用列表
const fetchSelectionAppList = async () => {
    try {
        const res = await getAigcPrimaryList()
        if (res?.code === 200 && Array.isArray(res?.data)) {
            allList.value = res.data
            // 查找 'firefighting' 应用（对应 'building' 分类）
            const firefightingApp = res.data.find((item: any) => item.name === '智能消防' || item.value === 'firefighting')

            if (firefightingApp?.value) {
                secondary.value = firefightingApp.value
                // 使用 version=2 获取智能绘制2.0数据
                const childRes = await getAigcChildrenList(firefightingApp.value, 2)
                if (childRes?.code === 200 && Array.isArray(childRes?.data)) {
                    const processed = getAigcCadStatus(childRes.data)
                    // 转换数据格式，映射字段用于展示
                    selectionAppList.value = processed.map((it: any) => ({
                        title: it.name ?? '',
                        description: it.description ?? '',
                        icon: it.value ?? '',
                        action: 'open_app',
                        ...it
                    }))
                }
            }
        }
    } catch (error) {
        console.error('获取应用列表失败:', error)
    }
}

// 处理CAD状态（从dashboard复制的逻辑）
const getAigcCadStatus = (data: ProjectItem[]) => {
    const groupMap: { [key: string]: string } = {
        'sprinkler': '智能给排水',
        'firehose_extinguisher': '智能给排水',
        'extinguishing': '智能给排水',
        'watermist': '智能给排水',
        'rain_water_curtain': '智能给排水',
        'foam': '智能给排水',
        'deluge': '智能给排水',
        'firemonitor': '智能给排水',
        'fire_water_v2': '智能给排水',
        'fire_electrical_v2': '智能电气',
        'fire_hvac_v2': '智能暖通',
        'fire_decoration_v2': '智能给排水',
        'firealarm': '智能电气',
        'lighting_evacuation': '智能电气',
        'firedoor_monitoring': '智能电气',
        'firepump_monitoring': '智能电气',
        'pressurization': '智能暖通',
        'ventilation_pressurization': '智能暖通',
        'smoke_control': '智能暖通'
    }

    return data.map((item: any) => {
        const newItem = { ...item }
        if (newItem.extra) {
            newItem.extra.group = groupMap[item.value] || ''
        }
        return newItem
    })
}

// 搜索项目
const handleSearch = () => {
    if (searchTimeout) {
        clearTimeout(searchTimeout)
    }
    searchTimeout = setTimeout(() => {
        fetchProjectList(1, searchValue.value)
    }, 300)
}

// 新建项目
const handleCreateProject = () => {
    dialogSource.value = 'new'
    createDialogVisible.value = true
}

// 刷新列表
const handleRefreshList = () => {
    fetchProjectList(1, searchValue.value)
}

// 卡片点击处理
const handleAppCardClick = (app: any) => {
    selectedApp.value = app
    currentCard.value = app
    createDialogVisible.value = false  // 隐藏第一个弹框
    appPreviewDialogVisible.value = true  // 显示第二个弹框
}

// 第二个弹框关闭
const handleAppDialogClose = () => {
    appPreviewDialogVisible.value = false
    selectedApp.value = null
    currentCard.value = null
    createDialogVisible.value = true  // 显示第一个弹框
}

// 页码变化
const handlePageChange = (page: number) => {
    fetchProjectList(page)
}

// 格式化日期
const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })
}

// 启动应用
const handleLaunchClick = async () => {
    const card = currentCard.value
    
    // 打开模式：打印日志
    if (dialogSource.value === 'open') {
        console.log('打开项目：', {
            projectName: selectedApp.value?.name,
            appName: card?.name,
            appValue: card?.value,
            category: card?.extra?.group
        })
        ElMessage.info('打开项目（日志已输出）')
        appPreviewDialogVisible.value = false
        return
    }
    
    // 新建模式：原有逻辑
    if (!card?.extra?.url) {
        ElMessage.info('未配置跳转链接')
        appPreviewDialogVisible.value = false
        return
    }

    try {
        const { data, code } = await stashToken({
            accessToken: userStore.accessToken,
            refreshToken: userStore.refreshToken,
        })

        if (code === 200) {
            const path = `${card.extra.group || ''}/${card.extra.englishName || ''}`
            const extraQuery = card.extra.url.split('?')[1]
            const query = `id=${data}&path=${path}${extraQuery ? `&${extraQuery}` : ''}`
            const encodedQuery = `sign=${encodeURIComponent(RC4Encrypt(query))}`
            const baseUrl = 'https://aigc.beesfpd.com'
            const basePath = card.extra.url.split('?')[0] || card.extra.url
            const fullUrl = `${baseUrl}${basePath}#/UploadFiles?${encodedQuery}`

            logPost({ event: 'APP_LAUNCH_CLICK', category: path })

            window.open(fullUrl, '_blank', 'noopener,noreferrer')
        } else {
            ElMessage.error('获取身份凭证失败')
        }
    } catch (error) {
        ElMessage.error('跳转失败')
        console.error(error)
    }

    appPreviewDialogVisible.value = false
}

// 打开项目
const handleOpenProject = (project: any) => {
    // 打印项目的所有信息
    console.log('打开的项目完整信息：', project)
    
    selectedApp.value = project
    dialogSource.value = 'open'
    
    // 根据 aigcCategory 查找匹配的应用
    const matchedApp = selectionAppList.value.find(app => app.value === project.aigcCategory)
    if (matchedApp) {
        recentlyUsedApp.value = matchedApp
    }
    
    createDialogVisible.value = true  // 显示第一个弹框（选择应用）
}

// 删除项目
const handleDeleteProject = (project: any) => {
    ElMessageBox.confirm(`确定要删除项目 "${project.name}" 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        try {
            const res = await getAigcProjectList(currentPage.value, pageSize.value, searchValue.value)
            if (res && res.code === 200) {
                projectList.value = res.data?.data || res.data || []
                total.value = res.data?.total || 0
                ElMessage.success('项目删除成功')
            } else {
                ElMessage.error('项目删除失败')
            }
        } catch (error) {
            console.error('删除项目失败:', error)
            ElMessage.error('项目删除失败')
        }
    }).catch(() => {
        // 用户取消删除
    })
}

// 页面加载时获取数据
onMounted(async () => {
    fetchProjectList(1)
    await fetchSelectionAppList()
})
</script>

<style scoped lang="less">
.workspace-container {
    height: 100%;

    :deep(.el-card) {
        box-shadow: none !important;
    }
}

.box-card {
    width: 100%;
    margin-bottom: 20px;
    transition: background-color 0.3s ease;
    box-shadow: none;
    max-width: 1300px;
    min-width: 830px;
    margin-left: auto;
    margin-right: auto;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: v-bind(menuTextColor);
    font-size: 24px;
    transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.workspace-content {
    min-height: 300px;
    color: var(--el-text-color-regular);
    border: 1px solid v-bind(desktopBboder);
    border-radius: 10px;

    .content-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 55px;
        padding: 20px 10px 20px 20px;
        border-bottom: 1px solid v-bind(desktopBboder);

        .content-top-left {
            display: flex;
            align-items: center;

            .content-top-left-item {
                font-size: 18px;
                color: v-bind(menuTextColor);
                cursor: pointer;
                margin-right: 30px;
                position: relative;
                padding: 0 2px;

                &:hover {
                    opacity: 0.7;
                }

                &.active {
                    font-weight: bold;

                    &::after {
                        content: '';
                        position: absolute;
                        bottom: -15px;
                        left: -2px;
                        right: -2px;
                        height: 2px;
                        background-color: v-bind(vTextColor);
                    }
                }
            }
        }

        .content-top-right {
            display: flex;
            align-items: center;
            gap: 16px;

            .search-input {
                width: 300px;

                :deep(.el-input__wrapper) {
                    background-color: v-bind(menuBgColor);
                    border: 1px solid v-bind(searchInputBorderColor);
                    border-radius: 5px;
                    padding: 0 12px;
                    height: 36px;
                    box-shadow: none;
                }

                :deep(.el-input__inner) {
                    color: v-bind(menuTextColor);
                    font-size: 14px;
                }
            }

            :deep(.el-input__prefix) {
                color: v-bind(subTextColor);
            }

            .right-tabs {
                display: flex;
                align-items: center;
                gap: 8px;

                .right-tab {
                    display: flex;
                    align-items: center;
                    font-size: 12px;
                    color: #8E9094;
                    cursor: pointer;
                    padding: 0 10px;
                    height: 32px;
                    border-radius: 4px 4px 0 0;
                    transition: color 0.2s, opacity 0.2s;

                    &:hover {
                        opacity: 0.7;
                    }
                }
            }
        }
    }

    .content-main {
        min-height: 540px;
        display: flex;
        position: relative;

        .content-left {
            flex: 1;
            padding-top: 30px;
            padding-left: 10px;
            //   padding-right: 280px;

            .projects-grid {
                // display: grid;
                display: flex;
                flex-wrap: wrap;
                // grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));

                .project-card {
                    width: 350px;
                    height: 300px;
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid v-bind(desktopBboder);
                    border-radius: 8px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-left: 20px;
                    margin-top: 20px;
                    margin-bottom: 30px;

                    // &:hover {
                    //     border-color: #ff9900;
                    //     box-shadow: 0 2px 8px rgba(255, 153, 0, 0.1);
                    //     transform: translateY(-2px);
                    // }

                    .project-thumbnail {
                        width: 350px;
                        height: 200px;
                        aspect-ratio: 1;
                        background-color: rgba(0, 0, 0, 0.3);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        overflow: hidden;

                        img {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }

                        .no-preview {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 100%;
                            height: 100%;
                            color: #888;
                        }
                    }

                    .project-info {
                        height: 100px;
                        padding: 12px;
                        display: flex;
                        align-items: center;
                        gap: 12px;

                        .project-info-icon {
                            width: 36px;
                            height: 36px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            flex-shrink: 0;

                            &.light-mode {
                                background-color: rgba(255, 255, 255, 0.3);
                            }

                            &.dark-mode {
                                background-color: rgba(255, 255, 255, 0.1);
                            }

                            .info-icon {
                                width: 24px;
                                height: 24px;
                                object-fit: contain;
                            }
                        }

                        .project-text-content {
                            flex: 1;
                            min-width: 0;
                            overflow: hidden;
                        }

                        .project-name {
                            margin: 0;
                            font-size: 14px;
                            font-weight: 500;
                            color: v-bind(menuTextColor);
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }

                        .project-time {
                            margin: 4px 0 0 0;
                            font-size: 12px;
                            color: v-bind(subTextColor);
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }

                        .project-actions {
                            display: none;
                            gap: 8px;
                            flex-shrink: 0;

                            .action-btn {
                                display: flex;
                                align-items: center;
                                font-size: 12px;
                                color: #8E9094;
                                cursor: pointer;
                                padding: 0 10px;
                                height: 32px;
                                border-radius: 4px;
                                transition: color 0.2s, opacity 0.2s;

                                &:hover {
                                    opacity: 0.7;
                                }
                            }
                        }
                    }

                    &:hover {
                        .project-actions {
                            display: flex;
                        }
                    }
                }
            }
        }
    }

    .pagination-container {
        padding: 20px;
        // border-top: 1px solid v-bind(desktopBboder);
        display: flex;
        justify-content: center;
    }
}



// 图标容器样式
.fire-icon-container {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;

    &.light-mode {
        background-color: #E8E9E4;
    }

    &.dark-mode {
        background-color: #191919;
    }

    .fire-icon {
        width: 42px;
        height: 42px;
        display: block;
        flex-shrink: 0;
        object-fit: contain;
    }
}

// 卡片网格在弹框中的样式
.el-dialog {
    .search-section {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 20px;
        width: 100%;

        .search-input {
            flex: 1;
            min-width: 0;

            :deep(.el-input__wrapper) {
                background-color: v-bind(menuBgColor);
                border: 1px solid v-bind(searchInputBorderColor);
                border-radius: 5px;
                padding: 0 12px;
                height: 36px;
                box-shadow: none;
            }

            :deep(.el-input__inner) {
                color: v-bind(menuTextColor);
                font-size: 14px;
            }

            :deep(.el-input__prefix) {
                color: v-bind(subTextColor);
            }
        }

        .tags {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            width: 400px;
            flex-shrink: 0;
            border: 1px solid v-bind(searchInputBorderColor) !important;
            border-radius: 5px;
            padding: 0 8px;
            height: 40px;
            background-color: v-bind(tagsBgColor);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            align-items: center;
            overflow: hidden;

            :deep(.el-tag) {
                background-color: transparent;
                border: none;
                color: v-bind(tagTextColor);
                cursor: pointer;
                transition: all 0.2s ease-in-out;
                padding: 0 20px;
                height: 28px;
                display: flex;
                align-items: center;
                border-radius: 4px;
                margin: 0;
                font-size: 12px;
                line-height: 1;

                &:hover {
                    background-color: v-bind(tagHoverBgColor);
                }

                &.is-active {
                    background-color: v-bind(tagActiveBgColor);
                    color: v-bind(tagTextColor);
                }
            }
        }
    }

    .card-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-top: 20px;
        width: 100%;

        @media screen and (max-width: 1439px) {
            grid-template-columns: repeat(2, 1fr);
        }

        .card-wrapper {
            position: relative;
        }

        .card {
            background-color: v-bind(cardBgColor);
            border-radius: 8px;
            padding: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            height: 66px;
            box-sizing: border-box;
            position: relative;
            width: 100%;
            overflow: hidden;

            &:hover {
                background-color: v-bind(cardHoverBgColor);
                transform: translateY(-2px);
                box-shadow: 5px 5px 5px rgba(255, 255, 255, 0.3);
            }

            .fire-icon-container {
                width: 45px;
                height: 45px;

                .fire-icon {
                    width: 42px;
                    height: 42px;
                }
            }

            .card-content {
                flex: 1;
                overflow: hidden;
                padding-right: 32px;

                .card-title {
                    font-size: 14px;
                    font-weight: 500;
                    color: v-bind(menuTextColor);
                    margin-bottom: 4px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .card-desc {
                    font-size: 12px;
                    color: v-bind(subTextColor);
                    line-height: 1.4;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }

            .recently-used-label {
                position: absolute;
                bottom: 0;
                right: 0;
                background-color: v-bind(menuBgColor);
                color: v-bind(subTextColor);
                font-size: 10px;
                padding: 2px 8px;
                border: 1px solid v-bind(borderColor);
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                z-index: 1;
                border-radius: 15px;
            }
        }
    }
}

// 应用详情弹窗样式
.app-dialog {
    :deep(.el-dialog__header) {
        display: none !important;
    }

    :deep(.el-dialog__body) {
        padding: 0 !important;
        margin: 0 !important;
        background-color: v-bind(menuBgColor);
        display: flex !important;
        flex-direction: column !important;
        height: 100% !important;
        overflow: hidden !important;
        position: relative !important;
        flex: 1 !important;
        min-height: 0 !important;
    }

    :deep(.el-dialog) {
        margin: 50px auto !important;
        max-height: calc(100vh - 100px) !important;
        background-color: v-bind(menuBgColor);
        border: 1px solid v-bind(borderColor);
        overflow: hidden !important;
        display: flex !important;
        flex-direction: column !important;
    }
}

.app-dialog-content {
    position: relative;
    padding: 24px;
    color: v-bind(menuTextColor);
    flex: 1 !important;
    overflow: visible !important;
    min-height: 0 !important;
    height: auto !important;
    max-height: none !important;
}

.app-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid v-bind(desktopBboder);
}

.app-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.app-icon.fire-icon-container {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    transition: background-color 0.3s ease;
}

.app-icon.fire-icon-container.light-mode {
    background-color: #E8E9E4;
}

.app-icon.fire-icon-container.dark-mode {
    background-color: #191919;
}

.app-icon .fire-icon {
    width: 60px;
    height: 60px;
    display: block;
}

.app-title {
    flex: 1;
    min-width: 0;
}

.app-title .name {
    font-size: 20px;
    font-weight: 500;
    color: v-bind(menuTextColor);
    margin-bottom: 4px;
}

.app-title .desc {
    font-size: 14px;
    color: v-bind(subTextColor);
}

.launch-btn {
    width: 120px;
    height: 40px;
    background: inherit;
    background-color: #FABD33 !important;
    box-sizing: border-box;
    border: none;
    border-radius: 5px;
    filter: drop-shadow(none);
    transition: all 0.3s ease;
    font-family: "PingFangHK-Semibold", "PingFang HK Semibold", "PingFang HK", sans-serif;
    font-weight: 650;
    font-style: normal;
    color: #000 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    cursor: pointer;
}

.launch-btn:hover {
    background-color: rgba(249, 222, 74, 0.8);
    color: #000;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(249, 222, 74, 0.3);
}

.launch-btn:active {
    transform: translateY(0);
    box-shadow: none;
}

.app-desc {
    font-size: 14px;
    line-height: 1.8;
    color: v-bind(menuTextColor);
    margin-bottom: 24px;
    text-align: justify;
}

.app-preview {
    h3 {
        font-size: 16px;
        font-weight: 500;
        color: v-bind(menuTextColor);
        margin: 0 0 16px 0;
    }
}

.app-preview-header {
    font-size: 16px;
    font-weight: 500;
    color: v-bind(menuTextColor);
    margin-bottom: 16px;
}

.preview-container {
    width: 100%;
    border-radius: 4px;
    overflow: hidden;
}

.preview-image {
    width: 100%;
    display: block;
}

// 版本信息和对话框样式
.version-info {
    position: relative;
    left: 0;
    margin: 0 24px;
    font-size: 14px;
    font-weight: 400;
    color: v-bind(vTextColor);
    border-top: 1px solid v-bind(desktopBboder);
    display: flex;
    align-items: center;
    padding: 20px 0;
    flex-shrink: 0;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;

    :deep(.el-button) {
        padding: 8px 20px;
    }
}

// 深色主题适配
html.dark {
    .box-card {
        background-color: #000 !important;
    }
}
</style>
