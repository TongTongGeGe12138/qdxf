<template>
  <div class="file-library">
    <!-- 文件列表 -->
    <div class="file-section">
      <div class="section-header">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(item, index) in filePath" :key="index" @click="handleBreadcrumbClick(index)">
            {{ item }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="file-grid">
        <div v-for="item in currentPageData" :key="item.id" class="file-item"
          :class="{ 'is-selected': selectedItem?.id === item.id }" @click="handleFileClick(item)"
          @dblclick="handleFileDblClick(item)">
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

    <!-- CAD查看器 -->
    <div v-if="showCadViewer" class="cad-viewer">
      <div class="cad-header">
        <span class="title">CAD查看器</span>
        <el-icon class="close-btn" @click="closeCadViewer"><Close /></el-icon>
      </div>
      <div id="ibp-2d-container" v-loading="cadLoading" element-loading-text="CAD文件加载中..."></div>
    </div>

    <!-- 分页 -->
    <div v-if="showPagination" class="pagination">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total"
        @current-change="onPageChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, watch, onMounted, nextTick } from 'vue';
import folder from '@/assets/wjj.svg?component';
import { useFileLibraryStore } from '@/store/modules/fileLibrary';
import { getProjectResourceFileInfo } from '@/api/project';
import { getP2d } from '@/api/cad';
import { ElMessage } from 'element-plus';
import { EngineContext } from '@/vendor/CadEngine/EngineContext.js';
import { Close } from '@element-plus/icons-vue';

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

const filePath = computed(() => ['我的桌面', ...fileLibraryStore.currentPath]);
const currentPage = ref(1);
const pageSize = ref(20);
const selectedItem = ref<FileItem | null>(null);
const showCadViewer = ref(false);
const cadLoading = ref(false);

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
watch(() => fileLibraryStore.libraryList, () => {
  currentPage.value = 1;
}, { immediate: true });

// 计算属性：是否显示分页
const showPagination = computed(() => {
  return files.value.length > pageSize.value;
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

// 单击选中
const handleFileClick = (item: FileItem) => {
  selectedItem.value = item;
  emit('fileSelected', item);
};

// 双击进入文件夹或返回上级
const handleFileDblClick = async (item: FileItem) => {
  if (item.type === 'back') {
    fileLibraryStore.navigateUp();
  } else if (item.type === 'folder') {
    fileLibraryStore.navigateToFolder({
      id: item.id,
      name: item.name,
      type: 'folder'
    });
  } else {
    // 处理文件双击
    try {
      // 判断是否在第一层目录
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
        // 更新选中文件的信息
        const updatedFile = {
          ...item,
          ...res.data
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
              const p2dRes = await getP2d({ DwgUrl: updatedFile.url });
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
                ElMessage.success('获取P2D文件成功');
              } else {
                ElMessage.error(p2dRes.Msg || '获取P2D文件失败');
                // 如果是dwg地址错误，尝试直接加载dwg文件
                if (p2dRes.Msg === 'dwg地址错误' && updatedFile.url) {
                  EngineContext.LoadManager.LoadModel({
                    url: updatedFile.url,
                    type: 'p2d',
                  });
                }
              }
            } catch (error) {
              ElMessage.error('获取P2D文件失败');
            }
          }
        } else {  // 非 DWG 文件
          // 在新窗口打开文件
          if (updatedFile.url) {
            window.open(updatedFile.url, '_blank');
          } else {
            ElMessage.warning('文件URL不存在，无法预览');
          }
        }
      } else {
        ElMessage.error('获取文件信息失败');
      }
    } catch (error) {
      ElMessage.error('获取文件信息失败');
    }
  }
};

// 面包屑点击
const handleBreadcrumbClick = async (index: number) => {
  if (index === 0) {
    await fileLibraryStore.clearCurrentPath(); // ✅ 等待加载完成
  } else {
    await fileLibraryStore.navigateToPath(index - 1); // ✅ 正确跳转层级
  }

  selectedItem.value = null;
  currentPage.value = 1;
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
  fileLibraryStore.clearCurrentPath();
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
</script>

<style lang="less" scoped>
.file-library {
  width: 100%;
  height: 100%;
  overflow-y: auto;
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
    }
  }

  .file-section {
    width: 100%;
    border-radius: 20px;

    .section-header {
      padding-left: 10px;

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
          background-color: var(--el-bg-color-overlay);
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

  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
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
            background-color: #1B2126;
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
            background-color: #E5F6E6;
          }
        }
      }
    }
  }
}
</style> 