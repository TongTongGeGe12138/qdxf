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
              <img src="@/assets/doc-preview.png" alt="文件预览" />
            </template>
          </div>
          <div class="file-name">{{ item.name }}</div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="showPagination" class="pagination">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total"
        @current-change="onPageChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from 'vue';
import folder from '@/assets/wjj.svg?component';
import { useFileLibraryStore } from '@/store/modules/fileLibrary';

interface FileItem {
  id: string | number;
  name: string;
  type: 'folder' | 'file' | 'back';
}

const fileLibraryStore = useFileLibraryStore();
const emit = defineEmits(['fileSelected']);

const filePath = ref(['我的桌面']);
const currentPage = ref(1);
const pageSize = ref(20);
const selectedItem = ref<FileItem | null>(null);

// 路径变化时重置面包屑和分页
watch(() => fileLibraryStore.currentPath, (newPath) => {
  filePath.value = ['我的桌面', ...newPath];
  currentPage.value = 1;
}, { immediate: true });

// 文件列表变化时重置分页
watch(() => fileLibraryStore.libraryList, () => {
  currentPage.value = 1;
}, { immediate: true });

// 计算属性：是否显示分页
const showPagination = computed(() => {
  return files.value.length > pageSize.value;
});

// 计算属性：根据当前路径层级决定显示内容
const files = computed(() => {
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
const handleFileDblClick = (item: FileItem) => {
  if (item.type === 'back') {
    fileLibraryStore.navigateUp();
  } else if (item.type === 'folder') {
    fileLibraryStore.navigateToFolder({
      id: item.id,
      name: item.name,
      type: 'folder'
    });
  }
};

// 面包屑点击
const handleBreadcrumbClick = (index: number) => {
  if (index === 0) {
    fileLibraryStore.clearCurrentPath();
  } else {
    fileLibraryStore.navigateToPath(index - 1);
  }
};

// 卸载时清理
onUnmounted(() => {
  fileLibraryStore.clearCurrentPath();
});
</script>

<style lang="less" scoped>
.file-library {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  // padding: 20px;

  .file-section {
    width: 100%;
    border-radius: 20px;

    .section-header {
      // padding: 16px 20px;
      padding-left: 10px;

      :deep(.el-breadcrumb) {
        .el-breadcrumb__item {
          .el-breadcrumb__inner {
            color: var(--el-text-color-primary);
            font-size: 14px;
            sor: pointer;
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
            width: 100%;
            height: 100%;
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