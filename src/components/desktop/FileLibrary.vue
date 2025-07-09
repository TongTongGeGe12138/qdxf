<template>
  <div class="file-library" @click="handleContainerClick">
    <!-- 文件列表 -->
    <div class="file-section">
      <div class="section-header">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(item, index) in filePath" :key="index" @click.stop="handleBreadcrumbClick(index)">
            {{ item }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="file-grid" v-loading="false" element-loading-text="加载中..." element-loading-background="transparent !important">
        <!-- 空状态显示 -->
        <div v-if="files.length === 0 && !isLoading" class="empty-state">
          <el-empty description="暂无数据"  :image-size="40" :image="simplified" />
        </div>
        <!-- 文件列表 -->
        <transition-group v-else name="file-list" tag="div" class="file-list-container">
          <div v-for="item in currentPageData" :key="item.id" class="file-item"
            :class="{ 'is-selected': selectedItem?.id === item.id }" @click.stop="handleFileClick(item)"
            @dblclick.stop="handleFileDblClick(item)">
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
        </transition-group>
      </div>
    </div>

    <!-- CAD查看器 -->
    <div v-if="showCadViewer" class="cad-viewer">
      <div class="cad-header">
        <span class="title">CAD查看器</span>
        <el-icon class="close-btn" @click="closeCadViewer"><Close /></el-icon>
      </div>
      <div id="ibp-2d-container" v-loading="cadLoading" element-loading-text="CAD文件加载中..." style="color: #ff9900;"></div>
    </div>

    <!-- 分页 -->
    <div v-if="showPagination" class="pagination" @click.stop>
      <el-pagination 
        v-model:current-page="currentPage" 
        v-model:page-size="pageSize" 
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="onPageChange"
        @size-change="onSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, watch, onMounted, nextTick } from 'vue';
import folder from '@/assets/wjj.svg?component';
import { useFileLibraryStore } from '@/store/modules/fileLibrary';
import { getProjectResourceFileInfo } from '@/api/project';
import { getMyResourcesInfo } from '@/api/resource';
import { getP2d } from '@/api/cad';
import { ElMessage } from 'element-plus';
import { EngineContext } from '@/vendor/CadEngine/EngineContext.js';
import { Close } from '@element-plus/icons-vue';
import simplified from '@/assets/simplified_document_icon.svg?url';

interface P2dResponse {
  Code: number;
  Msg: string;
  Data: string;
}

interface FileItem {
  id: string | number;
  name: string;
  type: 'folder' | 'file' | 'back';
  url?: string;
  data?: any[];
  contentType?: number;
  size?: string;
  createTime?: string;
  updateTime?: string;
  preview?: string;
  projectId?: string | number;
  fileId?: string | number;
  folderId?: string | number;
}

const fileLibraryStore = useFileLibraryStore();
const emit = defineEmits(['fileSelected', 'openFile']);

// 添加props定义
interface Props {
  activeIndex?: number;
}

const props = withDefaults(defineProps<Props>(), {
  activeIndex: 0
});

const filePath = computed(() => ['我的桌面', ...fileLibraryStore.currentPath]);
const currentPage = ref(1);
const pageSize = ref(20);
const selectedItem = ref<FileItem | null>(null);
const showCadViewer = ref(false);
const cadLoading = ref(false);
const isLoading = ref(false);

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

// 路径变化时重置面包屑和分页
// watch(() => fileLibraryStore.currentPath, (newPath) => {
//   filePath.value = ['我的桌面', ...newPath];
//   currentPage.value = 1;
// }, { immediate: true });

// 文件列表变化时重置分页
// watch(() => fileLibraryStore.libraryList, () => {
//   currentPage.value = 1;
// }, { immediate: true });

// 计算属性：是否显示分页
const showPagination = computed(() => {
  return total.value > 0;
});

// 计算属性：根据当前路径层级决定显示内容
const files = computed<FileItem[]>(() => {
  const actualPath = filePath.value?.slice(1) || [];
  const showBackButton = actualPath.length > 0;
  const currentList = fileLibraryStore.libraryList || [];
  if (showBackButton) {
    return [{ id: 0, name: '返回上级', type: 'back' as const }, ...currentList];
  }
  return currentList;
});

// 当前页显示的数据
const currentPageData = computed(() => {
  return files.value;
});

// 总数（使用store中的total值）
const total = computed(() => {
  return fileLibraryStore.total;
});

// 添加加载状态管理
const setLoading = (loading: boolean) => {
  isLoading.value = loading;
};

// 监听store数据变化，自动设置加载状态
watch(() => fileLibraryStore.libraryList, (newList) => {
  if (newList.length > 0) {
    setLoading(false);
  }
}, { immediate: true });

// 修改分页方法，去掉加载状态
const onPageChange = async (page: number) => {
  currentPage.value = page;
  // 重新请求数据
  await fileLibraryStore.refreshCurrentList(page, pageSize.value);
};

const onSizeChange = async (size: number) => {
  pageSize.value = size;
  currentPage.value = 1; // 重置到第一页
  // 重新请求数据
  await fileLibraryStore.refreshCurrentList(1, size);
};

// 单击选中
const handleFileClick = (item: FileItem) => {
  // 检查item是否为null或undefined
  if (!item) {
    selectedItem.value = null;
    emit('fileSelected', null);
    return;
  }
  
  selectedItem.value = item;
  emit('fileSelected', item);
};

// 双击进入文件夹或返回上级
const handleFileDblClick = async (item: FileItem) => {
  // 检查item是否为null或undefined
  if (!item) {
    console.warn('handleFileDblClick: item is null or undefined');
    return;
  }

  if (item.type === 'back') {
    // setLoading(true); // 去掉loading
    try {
      fileLibraryStore.navigateUp();
      // 返回上级时取消选中状态
      selectedItem.value = null;
      emit('fileSelected', null);
    } finally {
      // setLoading(false); // 去掉loading
    }
  } else if (item.type === 'folder') {
    // setLoading(true); // 去掉loading
    try {
      fileLibraryStore.navigateToFolder({
        id: item.id,
        name: item.name,
        type: 'folder'
      });
      // 进入文件夹时不取消选中状态，让用户可以继续操作
    } finally {
      // setLoading(false); // 去掉loading
    }
  } else {
    // 处理文件双击
    try {
      // 判断是否在收藏资源场景
      const isFavoriteResource = fileLibraryStore.currentPath.length === 0 && props.activeIndex === 1;
      
      let fileInfo;
      if (isFavoriteResource) {
        // 收藏资源场景：使用 getMyResourcesInfo 接口
        const res = await getMyResourcesInfo(item.id);
        if (res.code === 200) {
          fileInfo = res.data;
        } else {
          ElMessage.error('获取文件信息失败');
          return;
        }
      } else {
        // 其他场景：使用原有的 getProjectResourceFileInfo 接口
        const isFirstLevel = fileLibraryStore.currentPath.length === 0;
        const params = isFirstLevel ? {
          projectId: item.id,
          fileId: item.id
        } : {
          projectId: fileLibraryStore.projectId,
          fileId: item.id
        };
        
        const res = await getProjectResourceFileInfo(params);
        if (res.code === 200) {
          fileInfo = res.data;
        } else {
          ElMessage.error('获取文件信息失败');
          return;
        }
      }

      // 更新选中文件的信息
      const updatedFile = {
        ...item,
        ...fileInfo
      };
      selectedItem.value = updatedFile;
      emit('fileSelected', updatedFile);

      // 根据文件类型处理
      if (updatedFile.contentType === 141) {  // DWG 文件
        // 显示CAD查看器
        showCadViewer.value = true;
        cadLoading.value = true;
        await nextTick();
        const container = document.getElementById('ibp-2d-container');
        if (container) {
          EngineContext.AttachContainer(container);
        }

        // 如果有 url，获取 P2D 文件
        if (updatedFile.url) {
          try {
            // 添加超时处理
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('请求超时')), 30000); // 30秒超时
            });
            
            const p2dPromise = getP2d({ DwgUrl: updatedFile.url });
            const p2dRes = await Promise.race([p2dPromise, timeoutPromise]) as P2dResponse;
            
            if (p2dRes.Code === 0) {
              const loading = ref(true);
              const finish = (e: any) => {
                if (e.isComplete === false) {
                  ElMessage.error('该路径无法打开');
                  loading.value = false;
                  cadLoading.value = false;
                  return;
                }
                if (e.isComplete === true) {
                  EngineContext.ViewManager.ZoomToFit();
                  EngineContext.LoadManager.removeEventListener('finish', finish);
                  loading.value = false;
                  cadLoading.value = false;
                  EngineContext.init();
                }
              };
              EngineContext.LoadManager.addEventListener('finish', finish);
              EngineContext.LoadManager.LoadModel({
                url: p2dRes.Data,
                type: 'p2d',
              });
              // ElMessage.success('获取P2D文件成功');
            } else {
              console.error('P2D接口返回错误:', p2dRes);
              ElMessage.error(p2dRes.Msg || '获取P2D文件失败');
              // 如果是dwg地址错误，尝试直接加载dwg文件
              if (p2dRes.Msg === 'dwg地址错误' && updatedFile.url) {
                ElMessage.info('尝试直接加载DWG文件...');
                EngineContext.LoadManager.LoadModel({
                  url: updatedFile.url,
                  type: 'dwg',
                });
              }
            }
          } catch (error) {
            console.error('P2D文件加载失败:', error);
            if (error instanceof Error && error.message === '请求超时') {
              ElMessage.error('P2D文件加载超时，请稍后重试');
            } else {
              ElMessage.error('获取P2D文件失败，请稍后重试');
            }
            // 尝试直接加载DWG文件作为备用方案
            try {
              ElMessage.info('尝试直接加载DWG文件...');
              EngineContext.LoadManager.LoadModel({
                url: updatedFile.url,
                type: 'dwg',
              });
            } catch (dwgError) {
              console.error('DWG文件加载也失败:', dwgError);
              ElMessage.error('无法加载CAD文件，请检查文件是否有效');
              cadLoading.value = false;
            }
          }
        } else {
          ElMessage.warning('文件URL不存在，无法预览');
          cadLoading.value = false;
        }
      } else {  // 非 DWG 文件（包括PDF等）
        // 在新窗口打开文件
        if (updatedFile.url) {
          window.open(updatedFile.url, '_blank');
        } else {
          ElMessage.warning('文件URL不存在，无法预览');
        }
      }
    } catch (error) {
      console.error('文件处理失败:', error);
      ElMessage.error('获取文件信息失败');
    }
  }
};

// 面包屑点击
const handleBreadcrumbClick = async (index: number) => {
  // 阻止事件冒泡，避免触发容器的点击事件
  event?.stopPropagation();
  
  // setLoading(true); // 去掉loading
  try {
    if (index === 0) {
      await fileLibraryStore.clearCurrentPath(true); // ✅ 等待加载完成，自动刷新
    } else {
      await fileLibraryStore.navigateToPath(index - 1); // ✅ 正确跳转层级
    }

    // 路径变化时取消选中状态
    selectedItem.value = null;
    emit('fileSelected', null);
    currentPage.value = 1;
  } catch (error) {
    console.error('面包屑导航失败:', error);
  } // 去掉finally中的loading设置
};

// 关闭CAD查看器
const closeCadViewer = () => {
  showCadViewer.value = false;
  cadLoading.value = false;
  if (EngineContext.Container) {
    EngineContext.Container.style.display = 'none';
  }
};
watch(() => fileLibraryStore.currentPath, (val) => {
  console.log('当前路径变化:', val);
});

// 组件挂载时初始化EngineContext
onMounted(async () => {
  nextTick(() => {
    EngineContext.init();
  });
});

// 卸载时清理
onUnmounted(() => {
  // 移除自动清空store的逻辑，避免路由切换时清空数据
  // fileLibraryStore.clearCurrentPath(false); // 不自动刷新
  if (EngineContext.Container) {
    EngineContext.Container.style.display = 'none';
  }
});

// 添加一个公开的方法来处理文件打开
const openFile = async (item: FileItem) => {
  await handleFileDblClick(item);
};

// 暴露方法给父组件
defineExpose({
  openFile
});

// 处理容器点击事件
const handleContainerClick = () => {
  // 点击容器时取消选中状态
  selectedItem.value = null;
  emit('fileSelected', null);
};
</script>

<style lang="less" scoped>
.file-library {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  .cad-viewer {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 80%;
    z-index: 1000;
    background: var(--el-bg-color);
    border-radius: 12px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    border: 1px solid var(--el-border-color-light);

    .cad-header {
      height: 48px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--el-border-color-light);
      background-color: var(--el-bg-color-overlay);

      .title {
        font-size: 16px;
        font-weight: 500;
        color: var(--el-text-color-primary);
      }

      .close-btn {
        font-size: 20px;
        color: var(--el-text-color-secondary);
        cursor: pointer;
        transition: color 0.3s;
        padding: 4px;
        border-radius: 4px;

        &:hover {
          color: var(--el-color-primary);
          background-color: var(--el-fill-color-light);
        }
      }
    }

    #ibp-2d-container {
      flex: 1;
      overflow: hidden;
      background-color: var(--el-bg-color);
      border-radius: 0 0 12px 12px;
      
      // 自定义loading圈圈颜色
      :deep(.el-loading-spinner) {
        .circular {
          .path {
            stroke: #ff9900 !important;
          }
        }
      }
      :deep(.el-loading-text){
        color: #ff9900 !important;
      }
      
      // 更强的优先级选择器
      :deep(.el-loading-spinner .circular .path) {
        stroke: #ff9900 !important;
      }
    }
  }

  .file-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0; // 重要：让flex子元素可以收缩
    border-radius: 20px;

    .section-header {
      padding: 10px 10px 0 10px;
      flex-shrink: 0; // 不收缩

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
      flex: 1;
      overflow-y: auto; // 内容超出时滚动
      padding: 24px;
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      justify-content: flex-start;
      min-height: 0; // 重要：让flex子元素可以收缩
      position: relative; // 为loading状态添加定位

      .empty-state {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 200px;
        color: var(--el-text-color-secondary);
      }

      .file-list-container {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
      }

      .file-item {
        width: 170px;
        height: 172px;
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
          // margin-bottom: 12px;
          // background-color: var(--el-bg-color-overlay);
          border-radius: 8px;
          padding: 12px;

          img {
            width: 72px;
            height: 72px;
            object-fit: contain;
          }

          :deep(svg) {
            width: 100%;
            height: 100%;
          }
        }

        .file-name {
          font-size: 14px;
          color: var(--el-text-color-primary);
          text-align: center;
          word-break: break-all;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 1.4;
        }
      }
    }
  }

  // 添加文件列表过渡动画
  .file-list-enter-active,
  .file-list-leave-active {
    transition: all 0.3s ease;
  }

  .file-list-enter-from {
    opacity: 0;
    transform: translateY(20px);
  }

  .file-list-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }

  .file-list-move {
    transition: transform 0.3s ease;
  }

  .pagination {
    flex-shrink: 0; // 不收缩，固定在底部
    display: flex;
    justify-content: center;
    padding: 20px 0;
    border-top: 1px solid var(--el-border-color-light);
    // background-color: var(--el-bg-color);
    
    :deep(.el-pagination) {
      --el-pagination-bg-color: transparent;
      --el-pagination-text-color: var(--el-text-color-regular);
      --el-pagination-border-radius: 4px;
      --el-pagination-button-color: var(--el-text-color-regular);
      --el-pagination-button-bg-color: transparent;
      --el-pagination-button-disabled-color: var(--el-text-color-placeholder);
      --el-pagination-button-disabled-bg-color: transparent;
      --el-pagination-hover-color: var(--el-color-primary);
      
      .el-pagination__total {
        color: var(--el-text-color-regular);
      }
      
      .el-pagination__sizes {
        .el-select {
          .el-input {
            .el-input__wrapper {
              background-color: var(--el-bg-color-overlay);
              border: 1px solid var(--el-border-color);
            }
          }
        }
      }
      
      .btn-prev,
      .btn-next {
        background-color: var(--el-bg-color-overlay);
        border: 1px solid var(--el-border-color);
        
        &:hover {
          background-color: var(--el-color-primary);
          color: white;
        }
      }
      
      .el-pager {
        li {
          background-color: var(--el-bg-color-overlay);
          border: 1px solid var(--el-border-color);
          color: var(--el-text-color-regular);
          
          &:hover {
            background-color: var(--el-color-primary);
            color: white;
          }
          
          &.active {
            background-color: var(--el-color-primary);
            color: white;
          }
        }
      }
      
      .el-pagination__jump {
        color: var(--el-text-color-regular);
        
        .el-input {
          .el-input__wrapper {
            background-color: var(--el-bg-color-overlay);
            border: 1px solid var(--el-border-color);
          }
        }
      }
    }
  }
}

// 深色主题
html.dark {
  .file-library {
    .file-section {
      .file-grid {
        .file-item {
          &:hover {
            background-color: #1B2126;
          }

          &.is-selected {
            background-color: #1B2126;
          }

          .file-preview {
            // background-color: #1B2126;
          }
        }
      }
    }
  }
}

// 浅色主题
html:not(.dark) {
  .file-library {
    .file-section {
      .file-grid {
        .file-item {
          &:hover {
            background-color: #E5F6E6;
          }

          &.is-selected {
            background-color: #E5F6E6;
          }

          .file-preview {
            background-color: transparent;
          }
        }
      }
    }
  }
}
</style> 