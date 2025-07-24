<template>
    <div class="desktop-container" @click.stop>
        <el-card class="box-card" :style="{ backgroundColor: cardBgColor }">
            <template #header>
                <div class="card-header">
                    <span>{{ title }}</span>
                </div>
            </template>
            <div class="desktop-content">
                <div class="dcontent-top">
                    <div class="dcontent-top-left">
                        <div class="dcontent-top-left-item" v-for="(item, index) in navtitle" :key="item"
                            :class="{ active: activeIndex === index }" @click="activeIndex = index">
                            <span>{{ item }}</span>
                        </div>
                    </div>
                    <div class="dcontent-top-right">
                        <el-input v-model="searchValue" placeholder="搜索" class="search-input" :prefix-icon="Search"
                            clearable size="small" />
                        <div class="right-tabs">
                            <div v-for="(tab, idx) in rightTabs" :key="tab.name"
                                :class="['right-tab', { active: rightActiveTab === idx }]"
                                @click="rightActiveTab = idx">
                                <el-icon :size="18" style="margin-right: 4px;">
                                    <component :is="tab.icon" />
                                </el-icon>
                                <span @click="handleFileOperation(tab)">{{ tab.name }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="dcontent-cont" :class="{ 'detail-mode': showDetailMode }">
                    <template v-if="!showDetailMode">
                        <!-- 一级目录模式 -->
                        <div class="file-library">
                            <div class="file-section">
                                <!-- <div class="section-header">
                                    <el-breadcrumb separator="/">
                                        <el-breadcrumb-item v-for="(item, index) in filePath" :key="index" @click="handleBreadcrumbClick(index)">
                                            {{ item }}
                                        </el-breadcrumb-item>
                                    </el-breadcrumb> -->
                                <!-- </div> -->
                                <div class="file-grid">
                                    <div v-for="item in currentPageData" :key="item.id" class="file-item"
                                        :class="{ 'is-selected': selectedFile?.id === item.id }"
                                        @click="handleFileClick(item)" @dblclick="handleFileDblClick(item)">
                                        <div class="file-preview">
                                            <template v-if="item.type === 'back' || item.type === 'folder'">
                                                <folder />
                                            </template>
                                            <template v-else>
                                                <img :src="getFileIcon(item.contentType)" :alt="item.name" />
                                            </template>
                                        </div>
                                        <div class="file-name">{{ item.name }}</div>
                                    </div>
                                </div>
                            </div>
                            <!-- 分页 -->
                            <div v-if="showPagination" class="pagination">
                                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                                    :total="total" @current-change="onPageChange" />
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <!-- 详情模式 -->
                        <div class="dcontent-cont-left">
                            <el-menu :default-active="activeMenu" class="side-menu" @select="handleMenuSelect">
                                <el-menu-item index="space">
                                    <el-icon>
                                        <Operation />
                                    </el-icon>
                                    <span>协同空间</span>
                                </el-menu-item>
                                <el-menu-item index="members">
                                    <el-icon>
                                        <User />
                                    </el-icon>
                                    <span>人员管理</span>
                                </el-menu-item>
                                <el-menu-item index="tasks">
                                    <el-icon>
                                        <List />
                                    </el-icon>
                                    <span>任务管理</span>
                                </el-menu-item>
                                <el-menu-item index="board">
                                    <el-icon>
                                        <Grid />
                                    </el-icon>
                                    <span>进度看板</span>
                                </el-menu-item>
                                <el-menu-item index="back" @click="toggleDetailMode(false)">
                                    <el-icon>
                                        <Back />
                                    </el-icon>
                                    <span>返回所有项目</span>
                                </el-menu-item>
                            </el-menu>
                        </div>
                        <div class="dcontent-cont-count">
                            <div class="breadcrumb-container">
                                <el-breadcrumb separator="/">
                                    <el-breadcrumb-item v-for="(item, index) in breadcrumbPath" :key="index" @click="handleBreadcrumbClick(index)">
                                        {{ item }}
                                    </el-breadcrumb-item>
                                </el-breadcrumb>
                            </div>
                            <!-- 根据当前路由路径显示不同内容 -->
                            <template v-if="isSpaceRoute">
                                <!-- 协同空间：显示项目内文件 -->
                                <div class="file-library">
                                    <div class="file-section">
                                        <div class="file-grid">
                                            <div v-for="item in projectFiles" :key="item.id" class="file-item"
                                                :class="{ 'is-selected': selectedFile?.id === item.id }"
                                                @click="handleFileClick(item)" @dblclick="handleProjectFileDblClick(item)">
                                                <div class="file-preview">
                                                    <template v-if="item.type === 'folder'">
                                                        <folder />
                                                    </template>
                                                    <template v-else>
                                                        <img :src="getFileIcon(item.contentType)" :alt="item.name" />
                                                    </template>
                                                </div>
                                                <div class="file-name">{{ item.name }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <!-- 其他菜单项：显示路由内容 -->
                                <router-view></router-view>
                            </template>
                        </div>
                        <div class="dcontent-cont-right">
                            <div class="detail-panel">
                                <h3>详情信息</h3>
                                <div class="info-item">
                                    <span class="label">名称：</span>
                                    <span class="value">{{ currentProject?.name }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="label">创建时间：</span>
                                    <span class="value">{{ currentProject?.createdAt }}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Refresh, Search, Operation, User, List, Grid, Back } from '@element-plus/icons-vue'
import folder from '@/assets/wjj.svg?component';
import { isDark } from '../../utils/theme'
import { useRouter } from 'vue-router'

interface FileItem {
    id: string | number;
    name: string;
    type: 'folder' | 'file' | 'back';
    createdAt?: string;
    contentType?: number;
}

const router = useRouter()
const activeMenu = ref('space')
const title = ref('协同空间')
const navtitle = ref(['团队项目', '公共回收站'])
const activeIndex = ref(0)
const searchValue = ref('')

// 状态管理
const detailMode = ref(false)
const showDetailMode = computed(() => detailMode.value)
const currentProject = ref<FileItem | null>(null)
const selectedFile = ref<FileItem | null>(null)

// 文件路径和分页
const filePath = ref(['协同空间'])
const currentPage = ref(1)
const pageSize = ref(20)

// 导入所有文件图标
const fileIcons = {
  42: new URL('@/assets/file-icons/DOC.png', import.meta.url).href,
  141: new URL('@/assets/file-icons/DWG.png', import.meta.url).href,
  142: new URL('@/assets/file-icons/DXF.png', import.meta.url).href,
  164: new URL('@/assets/file-icons/IFG.png', import.meta.url).href,
  61: new URL('@/assets/file-icons/JPG.png', import.meta.url).href,
  41: new URL('@/assets/file-icons/PDF.png', import.meta.url).href,
  62: new URL('@/assets/file-icons/PNG.png', import.meta.url).href,
  45: new URL('@/assets/file-icons/PPT.png', import.meta.url).href,
  162: new URL('@/assets/file-icons/RFA.png', import.meta.url).href,
  163: new URL('@/assets/file-icons/RTE.png', import.meta.url).href,
  161: new URL('@/assets/file-icons/RVT.png', import.meta.url).href,
  21: new URL('@/assets/file-icons/TXT.png', import.meta.url).href,
  43: new URL('@/assets/file-icons/XLSX.png', import.meta.url).href,
  121: new URL('@/assets/file-icons/ZIP.png', import.meta.url).href,
  122: new URL('@/assets/file-icons/RAR.png', import.meta.url).href,
} as const;

// 获取文件图标
const getFileIcon = (contentType?: number) => {
  if (!contentType) return new URL('@/assets/doc-preview.png', import.meta.url).href;
  return fileIcons[contentType as keyof typeof fileIcons] || new URL('@/assets/doc-preview.png', import.meta.url).href;
};

// 模拟文件列表数据
const fileList = ref<FileItem[]>([
    {
        id: 1,
        name: '项目一',
        type: 'folder',
        createdAt: '2024-03-14'
    },
    {
        id: 2,
        name: '项目二',
        type: 'folder',
        createdAt: '2024-03-15'
    }
])

// 项目内文件列表数据
const projectFiles = ref<FileItem[]>([
    {
        id: 101,
        name: '设计文档.docx',
        type: 'file',
        createdAt: '2024-03-16',
        contentType: 42
    },
    {
        id: 102,
        name: '施工图纸.dwg',
        type: 'file',
        createdAt: '2024-03-17',
        contentType: 141
    },
    {
        id: 103,
        name: '会议记录',
        type: 'folder',
        createdAt: '2024-03-18'
    },
    {
        id: 104,
        name: '项目计划.pdf',
        type: 'file',
        createdAt: '2024-03-19',
        contentType: 41
    }
])

// 计算属性：是否显示分页
const showPagination = computed(() => {
    return files.value.length > pageSize.value;
});

// 计算属性：根据当前路径层级决定显示内容
const files = computed(() => {
    const actualPath = filePath.value?.slice(1) || [];
    const showBackButton = actualPath.length > 0;
    const currentList = fileList.value || [];
    if (showBackButton) {
        return [{ id: 0, name: '返回上级', type: 'back' as const }, ...currentList];
    }
    return currentList;
});

// 当前页显示的数据
const currentPageData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    if (files.value.length > 0 && files.value[0].type === 'back') {
        const backButton = files.value[0];
        const restFiles = files.value.slice(1);
        const paginatedFiles = restFiles.slice(start, end);
        return [backButton, ...paginatedFiles];
    }
    return files.value.slice(start, end);
});

// 总数（不包括返回按钮）
const total = computed(() => {
    if (files.value.length === 0) return 0;
    return files.value[0].type === 'back' ? files.value.length - 1 : files.value.length;
});

const onPageChange = (page: number) => {
    currentPage.value = page;
};

// 切换详情模式
const toggleDetailMode = (show: boolean) => {
    detailMode.value = show
}

// 单击选中
const handleFileClick = (item: FileItem) => {
    selectedFile.value = item;
    currentProject.value = item;
};

// 双击进入文件夹或返回上级
const handleFileDblClick = (item: FileItem) => {
    if (item.type === 'back') {
        // 返回上级
        filePath.value = filePath.value.slice(0, -1);
    } else if (item.type === 'folder') {
        // 进入文件夹
        filePath.value.push(item.name);
        toggleDetailMode(true);
        activeMenu.value = 'space'; // 默认显示协同空间
        // 跳转到协同空间路由
        router.push('/collaboration');
    }
};

// 面包屑路径计算
const breadcrumbPath = computed(() => {
    if (!showDetailMode.value) {
        // 非详情模式：显示基本路径
        return ['协同空间'];
    } else {
        // 详情模式：只显示到项目名，不显示子路由
        const basePath = ['协同空间'];
        if (currentProject.value) {
            basePath.push(currentProject.value.name);
        }
        
        return basePath;
    }
});

// 面包屑点击
const handleBreadcrumbClick = (index: number) => {
    if (index === 0) {
        // 点击"协同空间"：返回项目列表
        filePath.value = ['协同空间'];
        toggleDetailMode(false);
        router.push('/collaboration');
    } else if (index === 1) {
        // 点击项目名：返回项目根目录（协同空间）
        activeMenu.value = 'space';
        router.push('/collaboration');
    }
};

// 处理菜单选择
const handleMenuSelect = (index: string) => {
    if (index === 'back') {
        // 返回所有项目：清理所有状态
        toggleDetailMode(false);
        filePath.value = ['协同空间'];
        currentProject.value = null;
        selectedFile.value = null;
        activeMenu.value = 'space';
        router.push('/collaboration');
    } else if (index === 'space') {
        // 协同空间：显示项目内的文件列表
        activeMenu.value = 'space';
        // 清除路由，显示项目内容
        router.push('/collaboration');
    } else {
        // 其他菜单项：跳转到对应路由
        activeMenu.value = index;
        router.push(`/collaboration/${index}`);
    }
}

// 计算背景色
const cardBgColor = computed(() => isDark ? '#000' : '#faf9f5')
const menuTextColor = computed(() => isDark ? '#EDEDED' : '#13343C')
const desktopBboder = computed(() => isDark ? 'rgba(231,231,224,.3)' : '#D7D7D7')
const subTextColor = computed(() => isDark ? '#A1A1A1' : '#A1A1A1')
const borderColor = computed(() => isDark ? 'transparent' : 'rgba(228, 231, 237, 0.6)')
const containerColor = computed(() => isDark ? '#000' : '#faf9f5')
const menuBgColor = computed(() => isDark ? '#000' : '#faf9f5')

// 右侧操作按钮
const defaultTabs = [
    { name: '邀请成员', icon: Refresh },
]

const rightTabs = ref(defaultTabs)
const rightActiveTab = ref(0)

// 处理标签点击
const handleFileOperation = (tab: any) => {
    console.log('点击了标签:', tab.name)
}

// 计算是否为协同空间路由
const isSpaceRoute = computed(() => {
    // 当在详情模式下且当前路由是 /collaboration 时，显示协同空间内容
    return showDetailMode.value && router.currentRoute.value.path === '/collaboration';
});

// 处理项目内文件的双击逻辑
const handleProjectFileDblClick = (item: FileItem) => {
    if (item.type === 'folder') {
        // 进入文件夹
        filePath.value.push(item.name);
        toggleDetailMode(true);
        activeMenu.value = 'space'; // 默认显示协同空间
        // 跳转到协同空间路由
        router.push('/collaboration');
    }
};
</script>

<style scoped lang="less">
:deep(.el-card) {
    border: none !important;
    background-color: transparent !important;
    box-shadow: none !important;
    
    .el-card__header {
        border-bottom: none !important;
    }
}

:deep(.el-card__body) {
    // padding: 0 !important;
    border: none !important;
}

:deep(.el-card.is-always-shadow) {
    box-shadow: none !important;
}

:deep(.el-card.is-hover-shadow:focus),
:deep(.el-card.is-hover-shadow:hover) {
    box-shadow: none !important;
}

.desktop-container {
    padding: 20px;
    height: 100%;
    background-color: v-bind(containerColor) !important;
    display: flex;
    justify-content: center;

    .box-card {
        width: 100%;
        margin-bottom: 20px;
        transition: background-color 0.3s ease;
        max-width: 1200px;
        min-width: 830px;
        border: none !important;
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--el-text-color-primary);
        font-size: 24px;
        // margin-bottom: 20px;
        color: v-bind(menuTextColor);
        height: 30px;
        transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .desktop-content {
        min-height: 300px;
        color: var(--el-text-color-regular);
        border: 1px solid v-bind(desktopBboder);

        .dcontent-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 55px;
            padding: 20px 10px 20px 20px;
            border-bottom: 1px solid v-bind(desktopBboder);

            .dcontent-top-left {
                display: flex;
                align-items: center;

                .dcontent-top-left-item {
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
                            bottom: -2px;
                            left: -2px;
                            right: -2px;
                            height: 2px;
                            background-color: #C4C4D3;
                        }
                    }

                    span {
                        color: #C4C4D3;
                    }

                    &:not(.active) span {
                        color: #8E9094;
                    }
                }
            }

            .dcontent-top-right {
                display: flex;
                align-items: center;
                gap: 16px;

                .search-input {
                    width: 300px;
                    padding-right: 30px;

                    :deep(.el-input__wrapper) {
                        background-color: v-bind(menuBgColor);
                        border: 1px solid v-bind(borderColor);
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
                        font-size: 16px;
                        color: #8E9094;
                        cursor: pointer;
                        padding: 0 10px;
                        height: 32px;
                        border-radius: 4px 4px 0 0;
                        transition: color 0.2s, opacity 0.2s;
                        opacity: 1;

                        &:hover {
                            opacity: 0.7;
                        }

                        &.active {
                            color: #C4C4D3;
                            font-weight: bold;
                            position: relative;
                        }
                    }
                }
            }
        }

        .dcontent-cont {
            min-height: 540px;
            display: flex;

            .file-library {
                width: 100%;
                height: 100%;
                overflow-y: auto;

                .file-section {
                    width: 100%;
                    border-radius: 20px;

                    .section-header {
                        padding-left: 10px;
                        margin-top: 10px;

                        :deep(.el-breadcrumb) {
                            .el-breadcrumb__item {
                                .el-breadcrumb__inner {
                                    color: var(--el-text-color-primary);
                                    font-size: 14px;
                                    cursor: pointer;
                                    transition: color 0.3s ease;
                                }
                            }
                        }
                    }

                    .file-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                        gap: 24px;
                        padding: 24px;

                        .file-item {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            cursor: pointer;
                            padding: 16px;
                            border-radius: 12px;
                            transition: all 0.3s ease;
                            position: relative;

                            &:hover {
                                background-color: var(--el-fill-color-light);
                            }

                            &.is-selected {
                                transform: scale(1.1);
                                z-index: 1;
                                background-color: var(--el-fill-color-light);
                                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                            }

                            .file-preview {
                                width: 100px;
                                height: 100px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                margin-bottom: 12px;
                                background-color: var(--el-fill-color-light);
                                border-radius: 8px;
                                overflow: hidden;

                                svg {
                                    width: 80px;
                                    height: 80px;
                                }

                                img {
                                    width: 100%;
                                    height: 100%;
                                    object-fit: contain;
                                }
                            }

                            .file-name {
                                font-size: 14px;
                                color: var(--el-text-color-primary);
                                text-align: center;
                                word-break: break-all;
                                max-width: 100%;
                            }
                        }
                    }
                }

                .pagination {
                    display: flex;
                    justify-content: center;
                    padding: 20px 0;
                }
            }

            // 详情模式样式
            &.detail-mode {
                .dcontent-cont-left {
                    width: 145px;
                    padding: 0;
                    border-right: 1px solid v-bind(desktopBboder);
                    margin-right: -1px;
                    position: relative;
                    z-index: 1;
                }

                .dcontent-cont-count {
                    // flex: 1;
                    width: 70%;
                    padding: 20px;
                    position: relative;
                    display: flex;
                    flex-direction: column;

                    .breadcrumb-container {
                        padding: 0 0 16px 0;
                        border-bottom: 1px solid v-bind(desktopBboder);
                        margin-bottom: 16px;

                        :deep(.el-breadcrumb) {
                            .el-breadcrumb__item {
                                .el-breadcrumb__inner {
                                    color: var(--el-text-color-primary);
                                    font-size: 14px;
                                    cursor: pointer;
                                    transition: color 0.3s ease;

                                    &:hover {
                                        color: var(--el-color-primary);
                                    }
                                }
                            }
                        }
                    }
                }

                .dcontent-cont-right {
                    width: 300px;
                    border-left: 1px solid v-bind(desktopBboder);
                    padding: 20px;
                }
            }
        }
    }
}

// 深色主题适配
:deep(.el-input) {
    .el-input__wrapper {
        background-color: var(--el-fill-color-light);
        border: 1px solid var(--el-border-color);
        box-shadow: none;
        transition: all 0.3s ease;

        &:hover {
            border-color: var(--el-color-primary);
        }

        &.is-focus {
            border-color: var(--el-color-primary);
        }
    }

    .el-input__inner {
        color: var(--el-text-color-regular);
    }
}

html.dark {
    :deep(.el-input) {
        .el-input__wrapper {
            background-color: #1B2126;
            border-color: #2B2B2B;

            &:hover {
                border-color: #C4C4D3;
            }

            &.is-focus {
                border-color: #C4C4D3;
            }
        }

        .el-input__inner {
            color: #C4C4D3;
        }
    }
}

.side-menu {
    border-right: none;
    background-color: transparent;

    :deep(.el-menu-item) {
        width: 125px;
        height: 25px;
        line-height: 50px;
        color: v-bind(menuTextColor);
        background-color: transparent;

        &:hover {
            background-color: v-bind('isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)"');
        }

        &.is-active {
            background-color: v-bind('isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"');
            color: var(--el-color-primary);
            border-right: 2px solid var(--el-color-primary);
        }

        .el-icon {
            color: inherit;
        }
    }
}

:deep(.el-table) {
    background-color: transparent !important;

    tr {
        background-color: transparent !important;
    }

    th {
        background-color: transparent !important;
    }

    td {
        background-color: transparent !important;
    }

    .el-table__inner-wrapper {
        background-color: transparent !important;
    }

    .el-table__header-wrapper {
        background-color: transparent !important;

        tr,
        th {
            background-color: transparent !important;
        }
    }

    .el-table__body-wrapper {
        background-color: transparent !important;
    }

    .el-table__footer-wrapper {
        background-color: transparent !important;
    }
}
</style>
<style scoped></style>