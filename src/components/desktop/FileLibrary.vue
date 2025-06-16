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
// import folder from '@/assets/folder-small.svg?component';
import { useFileLibraryStore } from '@/store/modules/fileLibrary';
import { Folder, Document } from '@element-plus/icons-vue'
import { isDark } from '../../utils/theme'
import { ElMessage } from 'element-plus'
import { getProjectResource, getProjectFile } from '@/api/project'

interface FileItem {
  id: string | number;
  name: string;
  type: 'folder' | 'file' | 'back';
  size?: string;
  createTime?: string;
  updateTime?: string;
  preview?: string;
}

const fileLibraryStore = useFileLibraryStore();
const selectedItem = ref<FileItem | null>(null);

const emit = defineEmits(['fileSelected'])

const props = defineProps({
  files: {
    type: Array,
    default: () => []
  }
})

// 使用store中的路径
const filePath = ref(['我的桌面', ...fileLibraryStore.currentPath]);

// 监听 store 中的路径变化
watch(() => fileLibraryStore.currentPath, (newPath) => {
  filePath.value = ['我的桌面', ...newPath];
});

// 子文件夹数据
// const subFolders = [
//   { id: 1, name: '2024年方案', type: 'folder' },
//   { id: 2, name: '2023年方案', type: 'folder' },
//   { id: 3, name: '历史方案', type: 'folder' },
//   { id: 4, name: '参考案例', type: 'folder' },
// ];

// 文件数据
// const fileList = [
//   { id: 1, name: 'CJJ 109-2012城镇道路路面设计规范.pdf', type: 'file' },
//   { id: 2, name: 'CJJ 109-2012城镇道路路面设计规范.pdf', type: 'file' },
//   { id: 3, name: 'CJJ 109-2012城镇道路路面设计规范.pdf', type: 'file' },
//   { id: 4, name: 'CJJ 109-2012城镇道路路面设计规范.pdf', type: 'file' },
//   { id: 5, name: 'CJJ 109-2012城镇道路路面设计规范.pdf', type: 'file' },
//   { id: 6, name: 'CJJ 109-2012城镇道路路面设计规范.pdf', type: 'file' },
// ];

// 计算属性：是否显示分页
const showPagination = computed(() => {
  const currentList = files.value;
  return currentList.length > pageSize.value;
});

// 计算属性：根据当前路径层级决定显示内容
const files = computed(() => {
  // 移除"我的桌面"后计算实际层级
  const actualPath = filePath.value?.slice(1) || [];
  const showBackButton = actualPath.length > 0; // 实际路径长度大于0时显示返回按钮

  // 使用 store 中的数据
  const currentList = fileLibraryStore.libraryList || [];

  if (showBackButton) {
    return [{ id: 0, name: '返回上级', type: 'back' as const }, ...currentList];
  }

  return currentList;
});

// 计算当前页显示的数据
const currentPageData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  // 如果有返回按钮，需要特殊处理
  if (files.value.length > 0 && files.value[0].type === 'back') {
    const backButton = files.value[0];
    const restFiles = files.value.slice(1);
    const paginatedFiles = restFiles.slice(start, end);
    return [backButton, ...paginatedFiles];
  }
  return files.value.slice(start, end);
});

// 计算总数（不包括返回按钮）
const total = computed(() => {
  if (files.value.length === 0) return 0;
  return files.value[0].type === 'back' ? files.value.length - 1 : files.value.length;
});

const pageSize = ref(20);
const currentPage = ref(1);

const onPageChange = (page: number) => {
  currentPage.value = page;
};

// 处理文件或文件夹单击
const handleFileClick = (item: FileItem) => {
  selectedItem.value = item;
  emit('fileSelected', item);
};

// 处理文件或文件夹双击
const handleFileDblClick = async (item: FileItem) => {
  if (item.type === 'back') {
    // 处理返回上级目录
    const actualPath = filePath.value.slice(1);
    if (actualPath.length > 0) {
      filePath.value = filePath.value.slice(0, -1);
      fileLibraryStore.setCurrentPath(filePath.value.slice(1));
      selectedItem.value = null; // 清除选中的文件
      emit('fileSelected', null); // 通知父组件清除选中状态
      
      // 根据路径层级获取列表
      try {
        if (filePath.value.length === 1) {
          // 返回到根目录
          const res = await getProjectFile({
            page: 1,
            pageSize: 20,
            search: ''
          });
          if (res.code === 200) {
            const list = res.data.data.map((item: any) => ({
              ...item,
              type: item.length === 0 ? 'folder' : 'file'
            }));
            fileLibraryStore.setLibraryList(list || []);
          }
        } else {
          // 返回到上级目录
          const parentFolder = fileLibraryStore.libraryList.find(folder => folder.name === filePath.value[filePath.value.length - 1]);
          if (parentFolder?.id) {
            const res = await getProjectResource({
              projectId: parentFolder.id,
              page: 1,
              pageSize: 20
            });
            if (res.code === 200) {
              fileLibraryStore.setLibraryList(res.data.data || []);
            }
          }
        }
      } catch (error) {
        ElMessage.error('获取列表失败');
      }
    }
  } else if (item.type === 'folder') {
    // 先更新路径
    filePath.value = [...filePath.value, item.name];
    fileLibraryStore.setCurrentPath(filePath.value.slice(1));
    selectedItem.value = null;
    emit('fileSelected', null); // 通知父组件清除选中状态
    
    // 获取子文件夹内容
    try {
      const res = await getProjectResource({
        projectId: item.id,
        page: 1,
        pageSize: 20
      });
      if (res.code === 200) {
        fileLibraryStore.libraryList = res.data.data;
      }
    } catch (error) {
      ElMessage.error('获取文件夹内容失败');
    }
  }
};

// 处理面包屑点击
const handleBreadcrumbClick = (index: number) => {
  if (index < filePath.value.length - 1) {
    filePath.value = filePath.value.slice(0, index + 1);
  }
};

// 在组件卸载时清除路径
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