<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { isDark } from '../../utils/theme'
import { computed } from 'vue'
import { Refresh, UploadFilled, FolderAdd, Search, View, Edit, Download, Delete, Setting } from '@element-plus/icons-vue'
import FileLibrary from '@/components/desktop/FileLibrary.vue';
import { useFileLibraryStore } from '@/store/modules/fileLibrary';
import { ElMessage, ElMessageBox } from 'element-plus';
import { 
  getProjectFolderList, 
  addProjectFolder, 
  getProjectResource, 
  editProjectFoldeInfo,
  downProjectResourceFile,
  editProjectResourceFile,
  addProjectFile,
  transhFile,
  getTrashedList,
  deleteProjectFolder,
  deleteProjectResourceFile,
  recoverFile
} from '@/api/project';

interface FileItem {
  id: string | number;
  name: string;
  type: 'folder' | 'file';
  size?: string;
  createTime?: string;
  updateTime?: string;
  preview?: string;
  projectId?: string | number;  // 项目ID
  fileId?: string | number;     // 文件ID
  folderId?: string | number;   // 文件夹ID
}

interface TabItem {
  name: string;
  icon: any;
}

const title = ref('我的桌面')
const navtitle = ref(['我的项目', '我收藏的资源', '回收站'])
const activeIndex = ref(0)
const selectedFile = ref<FileItem | null>(null)

const defaultTabs = [
  { name: '刷新列表', icon: Refresh },
  { name: '上传文件', icon: UploadFilled },
  { name: '创建项目', icon: FolderAdd }
]

const fileLibraryStore = useFileLibraryStore();

const fileTabs = computed(() => {
  if (activeIndex.value === 2) {
    // 在回收站中只显示删除和还原选项
    return [
      { name: '还原', icon: View },
      { name: '删除', icon: Delete }
    ];
  }

  // 不在回收站中显示常规操作选项
  const baseTabs = [
    { name: '打开', icon: View },
    { name: '重命名', icon: Edit },
    { name: '下载', icon: Download },
    { name: '删除', icon: Delete }
  ];

  // 如果是第一层级的文件夹，添加编辑项目选项
  if (selectedFile.value?.type === 'folder' && fileLibraryStore.currentPath.length === 0) {
    baseTabs.unshift({ name: '编辑项目', icon: Setting });
  }

  return baseTabs;
});

const rightTabs = ref(defaultTabs)
const rightActiveTab = ref(0)
const searchValue = ref('')

// 添加文件上传相关的状态
const uploadDialogVisible = ref(false)
const uploadLoading = ref(false)
const uploadFile = ref<File | null>(null)
const uploadProjectId = ref<string | number>('')

// 添加重命名弹框相关的状态
const renameDialogVisible = ref(false)
const renameForm = ref({
  name: ''
})

// 添加获取回收站列表的方法
const getTrashList = async () => {
  try {
    const res = await getTrashedList({
      page: 1,
      pageSize: 20
    });
    if (res.code === 200) {
      fileLibraryStore.setLibraryList(res.data.data || []);
    }
  } catch (error) {
    ElMessage.error('获取回收站列表失败');
  }
}

// 监听 activeIndex 变化
watch(activeIndex, (newIndex) => {
  selectedFile.value = null;
  rightTabs.value = defaultTabs;
  rightActiveTab.value = 0;
  
  switch (newIndex) {
    case 0: // 我的项目
      getProjectFolderList().then(res => {
        if (res.code === 200) {
          fileLibraryStore.setLibraryList(res.data.data || []);
        }
      });
      break;
    case 1: // 我收藏的资源
      // TODO: 实现收藏资源列表
      break;
    case 2: // 回收站
      getTrashList();
      break;
  }
});

// 处理文件选中
const handleFileSelected = (file: FileItem) => {
  selectedFile.value = file
  // 无论是文件夹还是文件，都切换到fileTabs
  rightTabs.value = fileTabs.value
  rightActiveTab.value = 0
  // console.log(selectedFile.value, 9999999999);

}

// 计算背景色
const cardBgColor = computed(() => isDark.value ? 'var(--el-bg-color-overlay)' : '#ffffff')
const menuTextColor = computed(() => isDark.value ? '#EDEDED' : '#13343C')
// const navTextColor = computed(() => isDark.value ? '#EDEDED' : '#13343C')
const desktopBboder = computed(() => isDark.value ? 'rgba(231,231,224,.3)' : '#D7D7D7')
const subTextColor = computed(() => isDark.value ? '#A1A1A1' : '#A1A1A1')
// const vTextColor = computed(() => isDark.value ? '#EDEDED' : '#13343C')
const borderColor = computed(() => isDark.value ? 'transparent' : 'rgba(228, 231, 237, 0.6)')
// const menuBgColor = computed(() => isDark.value ? '#000' : '#ffffff')

// 处理点击事件
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const fileGrid = document.querySelector('.file-grid')
  const rightTabsElement = document.querySelector('.right-tabs')

  // 检查点击是否在文件网格内或操作按钮区域内
  const isClickInside = (fileGrid && fileGrid.contains(target)) ||
    (rightTabsElement && rightTabsElement.contains(target))

  if (!isClickInside) {
    selectedFile.value = null
    rightTabs.value = defaultTabs
    rightActiveTab.value = 0
  }
}

// 处理文件选择
const handleFileSelect = (file: { raw: File }) => {
  uploadFile.value = file.raw
}

// 处理文件上传
const handleUpload = async () => {
  if (!uploadFile.value) {
    ElMessage.warning('请选择要上传的文件')
    return
  }

  uploadLoading.value = true
  try {
    const formData = new FormData()
    formData.append('file', uploadFile.value)
    formData.append('projectId', String(uploadProjectId.value))

    await addProjectFile(formData)
    ElMessage.success('上传成功')
    uploadDialogVisible.value = false
    
    // 刷新列表
    const res = await getProjectFolderList()
    if (res.code === 200) {
      fileLibraryStore.setLibraryList(res.data.data || [])
    }
  } catch (error) {
    ElMessage.error('上传失败')
  } finally {
    uploadLoading.value = false
    uploadFile.value = null
  }
}

// 处理重命名弹框的打开
const handleRename = () => {
  if (!selectedFile.value) return;
  renameForm.value.name = selectedFile.value.name;
  renameDialogVisible.value = true;
}

// 处理重命名提交
const handleRenameSubmit = async () => {
  if (!selectedFile.value) return;
  
  try {
    if (selectedFile.value.type === 'folder') {
      await editProjectFoldeInfo({
        projectId: selectedFile.value.id,
        name: renameForm.value.name
      });
    } else {
      await editProjectResourceFile({
        projectId: selectedFile.value.projectId,
        fileId: selectedFile.value.fileId,
        name: renameForm.value.name
      });
    }
    ElMessage.success('重命名成功');
    renameDialogVisible.value = false;
    
    // 刷新列表
    if (activeIndex.value === 2) {
      await getTrashList();
    } else {
      const res = await getProjectFolderList();
      if (res.code === 200) {
        fileLibraryStore.setLibraryList(res.data.data || []);
      }
    }
  } catch (error) {
    ElMessage.error('重命名失败');
  }
}

// 修改文件操作处理函数
const handleFileOperation = async (tab: TabItem) => {
  // 上传文件和创建项目不需要选择文件
  if (tab.name === '上传文件' || tab.name === '创建项目' || tab.name === '刷新列表') {
    switch (tab.name) {
      case '上传文件':
        uploadDialogVisible.value = true
        break;
      case '创建项目':
        ElMessageBox.prompt('请输入项目名称', '创建项目', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(async ({ value }) => {
          try {
            await addProjectFolder({
              name: value
            });
            ElMessage.success('创建成功');
            // 刷新列表
            const res = await getProjectFolderList();
            if (res.code === 200) {
              fileLibraryStore.setLibraryList(res.data.data || []);
            }
          } catch (error) {
            ElMessage.error('创建失败');
          }
        });
        break;
      case '刷新列表':
        try {
          const res = await getProjectFolderList();
          if (res.code === 200) {
            fileLibraryStore.setLibraryList(res.data.data || []);
          }
        } catch (error) {
          ElMessage.error('刷新失败');
        }
        break;
    }
    return;
  }

  // 其他操作需要选择文件
  if (!selectedFile.value) {
    ElMessage.warning('请先选择一个文件');
    return;
  }

  const file = selectedFile.value;  // 保存引用以避免重复检查

  switch (tab.name) {
    case '编辑项目':
      if (file.type === 'folder') {
        ElMessageBox.prompt('请输入新的项目名称', '编辑项目', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: file.name,
        }).then(async ({ value }) => {
          try {
            await editProjectFoldeInfo({
              projectId: file.id,
              name: value
            });
            ElMessage.success('修改成功');
            // 刷新列表
            const res = await getProjectFolderList();
            if (res.code === 200) {
              fileLibraryStore.setLibraryList(res.data.data || []);
            }
          } catch (error) {
            ElMessage.error('修改失败');
          }
        });
      }
      break;
    case '打开':
      if (file.type === 'folder') {
        // 检查是否有子文件夹
        const hasSubFolders = fileLibraryStore.libraryList.some(folder => folder.name === file.name);
        if (hasSubFolders) {
          fileLibraryStore.setCurrentPath([...fileLibraryStore.currentPath, file.name]);
          // 获取子文件夹内容
          const res = await getProjectResource({
            projectId: file.id,
            page: 1,
            pageSize: 20
          });
          console.log('API响应:', res);
          if (res.code === 200) {
            console.log('响应数据:', res.data);
            fileLibraryStore.setLibraryList(res.data.data || []);
          }
        }
      } else {
        // 打开文件
        window.open(file.preview);
      }
      break;
    case '重命名':
      handleRename();
      break;
    case '下载':
      try {
        const response = await downProjectResourceFile({
          projectId: file.projectId,
          fileId: file.fileId
        });
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        ElMessage.success('下载成功');
      } catch (error) {
        ElMessage.error('下载失败');
      }
      break;
    case '删除':
      ElMessageBox.confirm('确定要删除该文件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          console.log('删除文件信息:', file);
          if (activeIndex.value === 2) {
            // 在回收站中，执行真正的删除
            if (file.type === 'folder') {
              if (!file.id) {
                throw new Error('文件夹ID不存在');
              }
              await deleteProjectFolder(file.id);
            } else {
              if (!file.id) {
                throw new Error('文件ID不存在');
              }
              await deleteProjectResourceFile({
                projectId: file.id,
                fileId: file.id
              });
            }
            ElMessage.success('删除成功');
          } else {
            // 不在回收站中，放入回收站
            if (file.type === 'folder') {
              if (!file.id) {
                throw new Error('文件夹ID不存在');
              }
              await transhFile({
                projectId: file.id,
                id: file.id
              });
            } else {
              if (!file.id) {
                throw new Error('文件ID不存在');
              }
              await transhFile({
                projectId: file.id,
                id: file.id
              });
            }
            ElMessage.success('已放入回收站');
          }
          
          // 刷新列表
          const res = await getProjectFolderList();
          if (res.code === 200) {
            fileLibraryStore.setLibraryList(res.data.data || []);
          }
        } catch (error) {
          console.error('删除失败:', error);
          ElMessage.error(error instanceof Error ? error.message : '删除失败');
        }
      });
      break;
    case '还原':
      if (activeIndex.value === 2) {
        try {
          if (!file.id) {
            throw new Error('文件ID不存在');
          }
          await recoverFile({
            projectId: file.id,
            id: file.id
          });
          ElMessage.success('还原成功');
          // 刷新回收站列表
          await getTrashList();
        } catch (error) {
          console.error('还原失败:', error);
          ElMessage.error(error instanceof Error ? error.message : '还原失败');
        }
      }
      break;
    default:
      break;
  }
}

// 初始化加载项目列表
onMounted(async () => {
  try {
    if (activeIndex.value === 0) {
      const res = await getProjectFolderList();
      console.log('初始化项目列表:', res);
      if (res.code === 200) {
        fileLibraryStore.setLibraryList(res.data.data || []);
      }
    } else if (activeIndex.value === 2) {
      await getTrashList();
    }
  } catch (error) {
    ElMessage.error('加载列表失败');
  }
  // 使用捕获阶段监听点击事件
  document.addEventListener('click', handleClickOutside, true)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true)
})

</script>

<template>
  <div class="desktop-container" @click.stop>
    <el-card class="box-card" :style="{ backgroundColor: cardBgColor }">
      <template #header>
        <div class="card-header">
          <span>{{ title }}</span>
        </div>
      </template>
      <div class="desktop-content">
        <!-- 这里可以添加桌面内容 -->
        <!-- <el-empty description="暂无内容" /> -->
        <div class="dcontent-top">
          <div class="dcontent-top-left">
            <div class="dcontent-top-left-item" v-for="(item, index) in navtitle" :key="item" :class="{ active: activeIndex === index }" @click="activeIndex = index">
              <span>{{ item }}</span>
            </div>
          </div>
          <div class="dcontent-top-right">
            <el-input v-model="searchValue" placeholder="搜索" class="search-input" :prefix-icon="Search" clearable
              size="small" />
            <div class="right-tabs">
              <div v-for="(tab, idx) in rightTabs" :key="tab.name"
                :class="['right-tab', { active: rightActiveTab === idx }]" @click="rightActiveTab = idx">
                <el-icon :size="18" style="margin-right: 4px;">
                  <component :is="tab.icon" />
                </el-icon>
                <span @click="handleFileOperation(tab)">{{ tab.name }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="dcontent-cont">
          <div class="dcontent-cont-left">
            <FileLibrary @fileSelected="handleFileSelected" />
          </div>
          <div class="dcontent-cont-right" v-if="selectedFile">
            <div class="file-detail">
              <div class="file-preview" v-if="selectedFile.preview">
                <img :src="selectedFile.preview" :alt="selectedFile.name">
              </div>
              <div class="file-info">
                <h3>项目详情</h3>
                <!-- <div class="info-item"> -->
                <!-- <span class="label">项目详情</span> -->
                <!-- <span class="value">{{ selectedFile.type === 'folder' ? '文件夹' : '文件' }}</span> -->
                <!-- </div> -->
                <div class="info-item" v-if="selectedFile.name">
                  <span class="label">项目名称：</span>
                  <span class="value">{{ selectedFile.name }}</span>
                </div>
                <div class="info-item" v-if="selectedFile.size">
                  <span class="label">大小：</span>
                  <span class="value">{{ selectedFile.size }}</span>
                </div>
                <div class="info-item" v-if="selectedFile.createTime">
                  <span class="label">创建时间：</span>
                  <span class="value">{{ selectedFile.createTime }}</span>
                </div>
                <div class="info-item" v-if="selectedFile.updateTime">
                  <span class="label">更新时间：</span>
                  <span class="value">{{ selectedFile.updateTime }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>

  <!-- 添加文件上传对话框 -->
  <el-dialog
    v-model="uploadDialogVisible"
    title="上传文件"
    width="400px"
    :close-on-click-modal="false"
  >
    <el-upload
      class="upload-demo"
      drag
      :auto-upload="false"
      :show-file-list="false"
      :on-change="(file) => handleFileSelect(file)"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        将文件拖到此处，或<em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          已选择文件: {{ uploadFile?.name || '未选择' }}
        </div>
      </template>
    </el-upload>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="uploadDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpload" :loading="uploadLoading">
          上传
        </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 添加重命名弹框 -->
  <el-dialog
    v-model="renameDialogVisible"
    title="修改文件名"
    width="502px"
    :close-on-click-modal="false"
  >
    <el-form :model="renameForm" label-width="80px" class="rename-form">
      <el-form-item label="文件名">
        <el-input v-model="renameForm.name" placeholder="请输入新的名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="renameDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleRenameSubmit">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">
.desktop-container {
  padding: 20px;
  height: 100%;
  background-color: var(--theme-background);
}

.box-card {
  width: 100%;
  margin-bottom: 20px;
  transition: background-color 0.3s ease;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--el-text-color-primary);
  font-size: 24px;
  /* font-weight: bold; */
  margin-bottom: 20px;
  color: v-bind(menuTextColor);
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
        width: 180px;
        margin-right: 16px;
        background: transparent;

        :deep(.el-input__wrapper) {
          // background-color: v-bind(menuBgColor);
          border: 1px solid v-bind(borderColor);
          border-radius: 5px;
          padding: 0 12px;
          height: 40px;
        }

        :deep(.el-input__inner) {
          color: v-bind(menuTextColor);
          height: 40px;
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
            // &::after {
            //   content: '';
            //   position: absolute;
            //   left: 2px;
            //   right: 2px;
            //   bottom: -6px;
            //   height: 2px;
            //   background: #C4C4D3;
            //   border-radius: 1px;
            // }
          }
        }
      }
    }
  }

  .dcontent-cont {
    min-height: 540px;
    display: flex;

    .dcontent-cont-left {
      flex: 1;
      padding: 20px;
    }

    .dcontent-cont-right {
      width: 300px;
      border-left: 1px solid v-bind(desktopBboder);
      padding: 20px;

      .file-detail {
        .file-preview {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 20px;
          background-color: var(--el-bg-color-overlay);

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .file-info {
          h3 {
            margin: 0 0 16px;
            color: v-bind(menuTextColor);
            font-size: 18px;
          }

          .info-item {
            margin-bottom: 12px;
            display: flex;
            align-items: center;

            .label {
              color: v-bind(subTextColor);
              width: 80px;
              flex-shrink: 0;
            }

            .value {
              color: v-bind(menuTextColor);
            }
          }
        }
      }
    }
  }
}

.upload-demo {
  width: 100%;
  
  :deep(.el-upload) {
    width: 100%;
  }
  
  :deep(.el-upload-dragger) {
    width: 100%;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.rename-form {
  :deep(.el-form-item__label) {
    padding-right: 38px;
  }
}
</style>