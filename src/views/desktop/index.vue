<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { isDark } from '../../utils/theme'
import { computed } from 'vue'
import { Refresh, UploadFilled, FolderAdd, Search, View, Edit, Download, Delete, Setting } from '@element-plus/icons-vue'
import FileLibrary from '@/components/desktop/FileLibrary.vue';
import { useFileLibraryStore } from '@/store/modules/fileLibrary';
import { ElMessage, ElMessageBox } from 'element-plus';
import { 
  getProjectFile, 
  addProjectFolder, 
  editProjectFoldeInfo,
  downProjectResourceFile,
  editProjectResourceFile,
  addProjectFile,
  transhFile,
  getTrashedList,
  deleteProjectFolder,
  deleteProjectResourceFile,
  recoverFile,
  addProjectResourceFile,
  getProjectResourceFile,
  addProjectResource
} from '@/api/project';
import { getResourceFiles } from '@/api/resource';
import { getResourcesList } from '@/api/resource';

interface FileItem {
  id: string | number;
  name: string;
  type: 'folder' | 'file';
  length?: number;
  createdAt?: string;
  preview?: string;
  projectId?: string | number;
  fileId?: string | number;
  folderId?: string | number;
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
  // 如果没有选中文件，返回默认标签
  if (!selectedFile.value) {
    return defaultTabs;
  }

  // 回收站场景
  if (activeIndex.value === 2) {
    return [
      { name: '还原', icon: Refresh },
      { name: '彻底删除', icon: Delete }
    ];
  }
  
  // 我收藏的资源场景
  if (activeIndex.value === 1) {
    return [
      { name: '通用规范', icon: Setting },
      { name: '通用图库', icon: Setting },
      { name: '供应商图库', icon: Setting },
      { name: '样例模板', icon: Setting }
    ];
  }

  // 我的项目场景
  // 如果是文件夹且当前路径不为空，显示上传和新建按钮
  if (selectedFile.value.type === 'folder' && fileLibraryStore.currentPath.length > 0) {
    return [
      { name: '上传文件', icon: UploadFilled },
      { name: '创建项目', icon: FolderAdd }
    ];
  }

  const baseTabs = [
    { name: '打开', icon: View },
    { name: '重命名', icon: Edit },
    { name: '下载', icon: Download },
    { name: '删除', icon: Delete }
  ];

  // 如果是第一层级的文件夹，添加编辑项目选项
  if (selectedFile.value.type === 'folder' && fileLibraryStore.currentPath.length === 0) {
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

// 添加操作弹框相关的变量定义
const operationDialogVisible = ref(false)
const operationType = ref<'recover' | 'delete' | 'upload' | 'trash' | 'rename' | 'edit' | 'create'>('recover')
const uploadForm = ref<{
  file: File;
  projectId: string;
} | null>(null)

// 添加重命名输入框的值
const renameValue = ref('');

// 监听 activeIndex 变化
watch(activeIndex, (newIndex) => {
  selectedFile.value = null;
  rightTabs.value = defaultTabs;
  rightActiveTab.value = 0;
  // 重置文件路径
  fileLibraryStore.clearCurrentPath();
  
  switch (newIndex) {
    case 0: // 我的项目
      getProjectFile({
        page: 1,
        pageSize: 20,
        search: ''
      }).then(res => {
        if (res.code === 200) {
          const list = res.data.data.map((item: any) => ({
            ...item,
            type: item.length === 0 ? 'folder' : 'file'
          }));
          fileLibraryStore.setLibraryList(list || []);
        }
      });
      break;
    case 1: // 我收藏的资源
      getFavoriteList();
      break;
    case 2: // 回收站
      getTrashList();
      break;
  }
});

// 添加获取回收站列表的方法
const getTrashList = async () => {
  try {
    const res = await getTrashedList({
      page: 1,
      pageSize: 20
    });
    if (res.code === 200) {
      const list = res.data.data.map((item: any) => ({
        ...item,
        type: item.length === 0 ? 'folder' : 'file'
      }));
      fileLibraryStore.setLibraryList(list || []);
    }
  } catch (error) {
    ElMessage.error('获取回收站列表失败');
  }
}

// 添加获取收藏资源列表的方法
const getFavoriteList = async () => {
  try {
    const res = await getResourceFiles({
      page: 1,
      pageSize: 20
    });
    if (res.code === 200) {
      const list = res.data.data.map((item: any) => ({
        ...item,
        type: item.length === 0 ? 'folder' : 'file'
      }));
      fileLibraryStore.setLibraryList(list || []);
    }
  } catch (error) {
    ElMessage.error('获取收藏资源列表失败');
  }
}

// 处理文件选中
const handleFileSelected = (file: FileItem) => {
  selectedFile.value = file;
  // 无论是文件夹还是文件，都切换到fileTabs
  rightTabs.value = fileTabs.value;
  rightActiveTab.value = 0;
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
  const operationDialog = document.querySelector('.el-dialog')

  // 检查点击是否在文件网格内、操作按钮区域内或操作弹框内
  const isClickInside = (fileGrid && fileGrid.contains(target)) ||
    (rightTabsElement && rightTabsElement.contains(target)) ||
    (operationDialog && operationDialog.contains(target))

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
    
    // 根据当前路径层级选择不同的上传接口
    if (fileLibraryStore.currentPath.length === 0) {
      // 一级目录
      formData.append('projectId', String(uploadProjectId.value))
      await addProjectFile(formData)
    } else {
      // 二级及n级目录
      const currentFolder = selectedFile.value
      if (!currentFolder?.id) {
        throw new Error('文件夹ID不存在')
      }
      await addProjectResourceFile({
        projectId: currentFolder.id,
        folderId: currentFolder.id,
        file: uploadFile.value
      })
    }
    
    ElMessage.success('上传成功')
    uploadDialogVisible.value = false
    
    // 刷新列表
    if (fileLibraryStore.currentPath.length === 0) {
      const res = await getProjectFile({
        page: 1,
        pageSize: 20,
        search: ''
      })
      if (res.code === 200) {
        const list = res.data.data.map((item: any) => ({
          ...item,
          type: item.length === 0 ? 'folder' : 'file'
        }))
        fileLibraryStore.setLibraryList(list || [])
      }
    } else {
      const currentFolder = selectedFile.value
      if (currentFolder?.id) {
        const res = await getProjectResourceFile({
          projectId: currentFolder.id,
          folderId: currentFolder.id,
          page: 1,
          pageSize: 20,
          search: ''
        })
        if (res.code === 200) {
          const list = res.data.data.map((item: any) => ({
            ...item,
            type: item.length === 0 ? 'folder' : 'file'
          }))
          fileLibraryStore.setLibraryList(list || [])
        }
      }
    }
  } catch (error) {
    ElMessage.error('上传失败')
  } finally {
    uploadLoading.value = false
    uploadFile.value = null
  }
}

// 修改文件操作处理函数
const handleFileOperation = async (tab: TabItem) => {
  // 上传文件和创建项目不需要选择文件
  if (tab.name === '上传文件' || tab.name === '创建项目' || tab.name === '刷新列表') {
    switch (tab.name) {
      case '上传文件':
        uploadDialogVisible.value = true;
        break;
      case '创建项目':
        operationDialogVisible.value = true;
        operationType.value = 'create';
        renameValue.value = '';
        break;
      case '刷新列表':
        try {
          if (activeIndex.value === 2) {
            await getTrashList();
          } else {
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
    case '还原':
      if (activeIndex.value === 2) {
        operationDialogVisible.value = true;
        operationType.value = 'recover';
      }
      break;
    case '彻底删除':
      if (activeIndex.value === 2) {
        operationDialogVisible.value = true;
        operationType.value = 'delete';
      }
      break;
    case '删除':
      if (activeIndex.value !== 2) {
        operationDialogVisible.value = true;
        operationType.value = 'trash';
      }
      break;
    case '重命名':
      operationDialogVisible.value = true;
      operationType.value = 'rename';
      break;
    case '编辑项目':
      if (file.type === 'folder') {
        operationDialogVisible.value = true;
        operationType.value = 'edit';
      } else {
        operationDialogVisible.value = true;
        operationType.value = 'rename';
      }
      break;
    case '下载':
      try {
        const res = await downProjectResourceFile({
          projectId: file.id,
          fileId: file.id
        });
        if (res.code === 200) {
          window.open(res.data);
        }
      } catch (error) {
        ElMessage.error('下载失败');
      }
      break;
  }
};

// 修改确认操作处理函数
const handleConfirmOperation = async () => {
  if (operationType.value === 'create') {
    if (!renameValue.value) {
      ElMessage.warning('请输入项目名称');
      return;
    }
    try {
      // 根据当前路径层级选择不同的创建接口
      if (fileLibraryStore.currentPath.length === 0) {
        // 一级目录创建项目
        const res = await addProjectFolder({
          name: renameValue.value
        });
        ElMessage.success('创建成功');
        // 刷新列表
        const listRes = await getProjectFile({
          page: 1,
          pageSize: 20,
          search: ''
        });
        if (listRes.code === 200) {
          const list = listRes.data.data.map((item: any) => ({
            ...item,
            type: item.length === 0 ? 'folder' : 'file'
          }));
          fileLibraryStore.setLibraryList(list || []);
        }
      } else {
        // 二级及n级目录创建项目
        const currentFolder = selectedFile.value;
        if (!currentFolder?.id) {
          throw new Error('文件夹ID不存在');
        }
        // 使用addProjectResource接口创建文件夹
        await addProjectResource({
          projectId: currentFolder.id,
          name: renameValue.value
        });
        ElMessage.success('创建成功');
        // 刷新列表
        const res = await getProjectResourceFile({
          projectId: currentFolder.id,
          folderId: currentFolder.id,
          page: 1,
          pageSize: 20,
          search: ''
        });
        if (res.code === 200) {
          // 确保新创建的文件夹length为0
          const list = res.data.data.map((item: any) => {
            // 如果是新创建的文件夹，设置length为0
            if (item.name === renameValue.value) {
              return {
                ...item,
                length: 0,
                type: 'folder'
              };
            }
            return {
              ...item,
              type: item.length === 0 ? 'folder' : 'file'
            };
          });
          fileLibraryStore.setLibraryList(list || []);
        }
      }
      operationDialogVisible.value = false;
      renameValue.value = '';
    } catch (error) {
      ElMessage.error('创建失败');
    }
    return;
  }

  if (!selectedFile.value) {
    ElMessage.warning('请先选择一个文件');
    return;
  }

  const file = selectedFile.value;

  try {
    switch (operationType.value) {
      case 'recover':
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
        break;
      case 'delete':
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
        // 刷新回收站列表
        await getTrashList();
        break;
      case 'trash':
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
        // 刷新列表
        const res = await getProjectFile({
          page: 1,
          pageSize: 20,
          search: ''
        });
        if (res.code === 200) {
          // 根据 length 是否为 0 来判断类型
          const list = res.data.data.map((item: any) => ({
            ...item,
            type: item.length === 0 ? 'folder' : 'file'
          }));
          fileLibraryStore.setLibraryList(list || []);
        }
        break;
      case 'upload':
        if (!uploadForm.value) {
          throw new Error('请选择要上传的文件');
        }
        const formData = new FormData();
        formData.append('file', uploadForm.value.file);
        formData.append('projectId', uploadForm.value.projectId);
        await addProjectFile(formData);
        ElMessage.success('上传成功');
        // 刷新列表
        const res2 = await getProjectFile({
          page: 1,
          pageSize: 20,
          search: ''
        });
        if (res2.code === 200) {
          // 根据 length 是否为 0 来判断类型
          const list = res2.data.data.map((item: any) => ({
            ...item,
            type: item.length === 0 ? 'folder' : 'file'
          }));
          fileLibraryStore.setLibraryList(list || []);
        }
        break;
      case 'rename':
        if (file.type === 'folder') {
          await editProjectFoldeInfo({
            id: file.id,
            name: renameValue.value
          });
        } else {
          await editProjectResourceFile({
            id: file.id,
            name: renameValue.value
          });
        }
        ElMessage.success('重命名成功');
        // 刷新列表
        const res3 = await getProjectFile({
          page: 1,
          pageSize: 20,
          search: ''
        });
        if (res3.code === 200) {
          // 根据 length 是否为 0 来判断类型
          const list = res3.data.data.map((item: any) => ({
            ...item,
            type: item.length === 0 ? 'folder' : 'file'
          }));
          fileLibraryStore.setLibraryList(list || []);
        }
        break;
      case 'edit':
        await editProjectFoldeInfo({
          id: file.id,
          name: renameValue.value
        });
        ElMessage.success('编辑成功');
        // 刷新列表
        const res4 = await getProjectFile({
          page: 1,
          pageSize: 20,
          search: ''
        });
        if (res4.code === 200) {
          // 根据 length 是否为 0 来判断类型
          const list = res4.data.data.map((item: any) => ({
            ...item,
            type: item.length === 0 ? 'folder' : 'file'
          }));
          fileLibraryStore.setLibraryList(list || []);
        }
        break;
    }
    operationDialogVisible.value = false;
    renameValue.value = '';
  } catch (error) {
    console.error('操作失败:', error);
    ElMessage.error(error instanceof Error ? error.message : '操作失败');
  }
};

// 监听操作类型变化
watch(operationType, (newType) => {
  if (newType === 'rename' || newType === 'edit') {
    renameValue.value = selectedFile.value?.name || '';
  }
});

// 添加文件大小转换函数
const formatFileSize = (bytes: number) => {
  if (!bytes || bytes === 0) return '0 MB';
  const mb = bytes / (1024 * 1024);
  return mb.toFixed(2) + ' MB';
};

// 初始化加载项目列表
onMounted(async () => {
  try {
    if (activeIndex.value === 0) {
      const res = await getProjectFile({
        page: 1,
        pageSize: 20,
        search: ''
      });
      console.log('初始化项目列表:', res);
      if (res.code === 200) {
        const list = res.data.data.map((item: any) => ({
          ...item,
          type: item.length === 0 ? 'folder' : 'file'
        }));
        fileLibraryStore.setLibraryList(list || []);
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
                <div class="info-item" v-if="selectedFile.createdAt">
                  <span class="label">创建时间：</span>
                  <span class="value">{{ selectedFile.createdAt }}</span>
                </div>
                <div class="info-item" v-if="selectedFile.length">
                  <span class="label">大小：</span>
                  <span class="value">{{ formatFileSize(selectedFile.length) }}</span>
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
      :on-change="handleFileSelect"
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
        <div class="dialog-button cancel" @click="uploadDialogVisible = false">取消</div>
        <div class="dialog-button confirm" @click="handleUpload" :loading="uploadLoading">
          上传
        </div>
      </span>
    </template>
  </el-dialog>

  <!-- 操作确认弹框 -->
  <el-dialog
    v-model="operationDialogVisible"
    :title="operationType === 'recover' ? '还原确认' : 
           operationType === 'delete' ? '删除确认' : 
           operationType === 'trash' ? '回收站确认' :
           operationType === 'rename' ? '重命名' :
           operationType === 'edit' ? '编辑项目' :
           operationType === 'create' ? '创建项目' : ''"
    width="30%"
    :close-on-click-modal="false"
  >
    <template v-if="operationType === 'rename' || operationType === 'edit' || operationType === 'create'">
      <el-input v-model="renameValue" :placeholder="operationType === 'create' ? '请输入项目名称' : 
                operationType === 'rename' ? '请输入新的名称' : 
                '请输入新的项目名称'" />
    </template>
    <template v-else>
      <span>{{ operationType === 'recover' ? '确定要还原该文件吗？' : 
              operationType === 'delete' ? '确定要彻底删除该文件吗？此操作不可恢复！' : 
              '确定要删除文件吗？若删除文件，之后可以在回收站中还原。' }}</span>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <div class="dialog-button cancel" @click="operationDialogVisible = false">取消</div>
        <div class="dialog-button confirm" @click="handleConfirmOperation">确定</div>
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
  margin-top: 20px;

  .dialog-button {
    padding: 8px 20px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
    margin-left: 12px;

    &.cancel {
      background-color: #F5F5F5;
      color: #666666;
      border: 1px solid #E4E4E4;

      &:hover {
        background-color: #E8E8E8;
        border-color: #D4D4D4;
      }
    }

    &.confirm {
      background-color: rgba(249, 222, 74, 1);
      color: #1B2126;

      &:hover {
        background-color: #B4B4C3;
      }
    }
  }
}

// 深色主题
html.dark {
  .dialog-button {
    &.cancel {
      background-color: #2B2B2B;
      color: #C4C4D3;
      border: 1px solid #3B3B3B;

      &:hover {
        background-color: #3B3B3B;
        border-color: #4B4B4B;
      }
    }

    &.confirm {
      background-color: rgba(249, 222, 74, 1);
      color: #1B2126;

      &:hover {
        background-color: #B4B4C3;
      }
    }
  }
}

// 添加输入框样式
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

// 深色主题
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

// 添加创建项目弹框的自定义样式
:deep(.custom-message-box) {
  .el-message-box__btns {
    .el-button {
      padding: 8px 20px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
      margin-left: 12px;

      &.el-button--default {
        background-color: #F5F5F5;
        color: #666666;
        border: 1px solid #E4E4E4;

        &:hover {
          background-color: #E8E8E8;
          border-color: #D4D4D4;
        }
      }

      &.el-button--primary {
        background-color: rgba(249, 222, 74, 1);
        color: #1B2126;
        border: none;

        &:hover {
          background-color: rgba(249, 222, 74, 0.8);
        }
      }
    }
  }
}

// 深色主题
html.dark {
  :deep(.custom-message-box) {
    .el-message-box__btns {
      .el-button {
        &.el-button--default {
          background-color: #2B2B2B;
          color: #C4C4D3;
          border: 1px solid #3B3B3B;

          &:hover {
            background-color: #3B3B3B;
            border-color: #4B4B4B;
          }
        }

        &.el-button--primary {
          background-color: rgba(249, 222, 74, 1);
          color: #1B2126;

          &:hover {
            background-color: rgba(249, 222, 74, 0.8);
          }
        }
      }
    }
  }
}
</style>