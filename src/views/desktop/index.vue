<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { isDark } from '../../utils/theme'
import { computed } from 'vue'
import { Refresh, UploadFilled, FolderAdd, Search, View, Edit, Download, Delete, Setting, Tickets } from '@element-plus/icons-vue'
import FileLibrary from '@/components/desktop/FileLibrary.vue';
import { useFileLibraryStore } from '@/store/modules/fileLibrary';
import { ElMessage, } from 'element-plus';
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
  addProjectResource,
  addThirdResource,
  editProjectResource,
  getProjectFoldeInfo
} from '@/api/project';
import { getResourceFiles, deleteResourcesFile, getMyResourcesInfo } from '@/api/resource';
import { getProvinceList, getCityList } from '@/api/location';
import simplified from '@/assets/simplified_document_icon.svg?url';


interface AddressOption {
  value: string | number;
  label: string;
  children?: AddressOption[];
}

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
  address?: string;
  addressId?: string | number;
  clientName?: string;
  contentType?: number;
  locationId?: string | number;
}

interface TabItem {
  name: string;
  icon: any;
}

const title = ref('我的桌面')
const navtitle = ref(['我的项目', '我收藏的资源', '回收站'])
const activeIndex = ref(0)
const selectedFile = ref<FileItem | null>(null)

const defaultTabs = computed(() => {
  const tabs = [
    { name: '刷新列表', icon: Refresh }
  ];

  // 只有在我的项目场景下才显示上传和创建按钮
  if (activeIndex.value === 0) {
    // 第一层目录显示上传文件和创建项目按钮
    if (fileLibraryStore.currentPath.length === 0) {
      tabs.push({ name: '上传文件', icon: UploadFilled });
      tabs.push({ name: '创建项目', icon: FolderAdd });
    }
    // 如果当前在某个项目内部（有路径层级），显示上传文件和新建文件夹按钮
    if (fileLibraryStore.currentPath.length > 0) {
      tabs.push({ name: '上传文件', icon: UploadFilled });
      tabs.push({ name: '新建文件夹', icon: FolderAdd });
    }
  }

  return tabs;
});

const fileLibraryStore = useFileLibraryStore();

const rightTabs = computed(() => {
  // 如果没有选中文件，返回默认标签
  if (!selectedFile.value) {
    return defaultTabs.value;
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
      { name: '打开', icon: View },
      { name: '取消收藏', icon: Delete },
    ];
  }

  // 我的项目场景
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

  // 除了第一层外，其他层级都显示baseTabs
  return baseTabs;
});

const rightActiveTab = ref(0)
const searchValue = ref('')

// 添加文件上传相关的状态
const uploadDialogVisible = ref(false)
const uploadLoading = ref(false)
const uploadFile = ref<File | null>(null)

// 添加操作弹框相关的变量定义
const operationDialogVisible = ref(false)
const operationType = ref<'recover' | 'delete' | 'upload' | 'trash' | 'rename' | 'edit' | 'create' | 'removeFavorite'>('recover')

// 添加重命名输入框的值
const renameValue = ref('');

// 添加loading状态
const operationLoading = ref(false)
const searchLoading = ref(false)

// 添加项目表单数据
const formDatassss = ref<any>({
  address: '中国',
  clientName: '',
  name: '',
  createdAt: '',
  id: '',
  url: '',
  contentType: null,
  locationId: null,
  resourceId: null,
  selectedProvince: '',
  selectedCity: '',
});

// 添加创建项目表单数据
const createProjectForm = ref<any>({
  name: '',
  address: '中国',
  clientName: '',
  locationId: null,
  selectedProvince: '',
  selectedCity: '',
});

// 地址选择相关
const country = ref('中国');
const selectedProvince = ref<string | number>('');
const selectedCity = ref<string | number>('');
const provinceOptions = ref<AddressOption[]>([]);
const cityOptions = ref<AddressOption[]>([]);

// 获取省份列表
const getProvinceData = async () => {
  try {
    const res = await getProvinceList();
    if (res.code === 200) {
      provinceOptions.value = res.data.map((item: any) => ({
        value: item.id,
        label: item.name
      }));
    }
  } catch (error) {
    ElMessage.error('获取省份列表失败');
  }
};

// 获取城市列表
const getCityData = async (provinceId: string | number) => {
  try {
    const res = await getCityList(provinceId);
    if (res.code === 200) {
      cityOptions.value = res.data.map((item: any) => ({
        value: item.id,
        label: item.name
      }));
    } else {
      cityOptions.value = [];
    }
  } catch (error) {
    ElMessage.error('获取城市列表失败');
    cityOptions.value = [];
  }
};

// 省份变化时
const onProvinceChange = async (provinceId: string | number) => {
  console.log('省份变化，provinceId:', provinceId);
  console.log('当前操作类型:', operationType.value);
  console.log('当前路径长度:', fileLibraryStore.currentPath.length);
  
  // 如果是在创建项目表单中，清空城市选择
  if (operationType.value === 'create' && fileLibraryStore.currentPath.length === 0) {
    createProjectForm.value.selectedCity = '';
    console.log('清空 createProjectForm.selectedCity');
  } else {
    selectedCity.value = '';
    console.log('清空 selectedCity');
  }
  
  await getCityData(provinceId);
  console.log('省份变化后，createProjectForm:', createProjectForm.value);
};

// 监听 activeIndex 变化
watch(activeIndex, (newIndex) => {
  selectedFile.value = null;
  rightActiveTab.value = 0;

  // 先清空文件列表，避免显示错误的数据
  fileLibraryStore.setLibraryList([]);

  // 重置文件路径（但不触发refreshCurrentList）
  fileLibraryStore.currentPath = [];
  fileLibraryStore.projectId = null;
  fileLibraryStore.folderPath = [];

  switch (newIndex) {
    case 0: // 我的项目
      getProjectFile({
        page: 1,
        pageSize: 20,
        search: searchValue.value
      }).then(res => {
        if (res.code === 200) {
          const list = res.data.data.map((item: any) => ({
            ...item,
            type: isFolder(item) ? 'folder' : 'file'
          }));
          fileLibraryStore.setLibraryList(list || []);
          fileLibraryStore.setTotal(res.data.total || 0);
        } else {
          // API调用成功但返回错误状态码时，清空列表
          fileLibraryStore.setLibraryList([]);
          fileLibraryStore.setTotal(0);
        }
      }).catch(() => {
        ElMessage.error('获取项目列表失败');
        // API调用失败时，清空列表
        fileLibraryStore.setLibraryList([]);
        fileLibraryStore.setTotal(0);
      });
      break;
    case 1: // 我收藏的资源
      getFavoriteList(searchValue.value);
      break;
    case 2: // 回收站
      getTrashList(searchValue.value);
      break;
  }
});

// 添加获取回收站列表的方法
const getTrashList = async (search = '') => {
  try {
    const res = await getTrashedList({
      page: 1,
      pageSize: 20,
      search
    });
    if (res.code === 200) {
      const list = res.data.data.map((item: any) => ({
        ...item,
        type: isFolder(item) ? 'folder' : 'file'
      }));
      fileLibraryStore.setLibraryList(list || []);
      fileLibraryStore.setTotal(res.data.total || 0);
    } else {
      // API调用成功但返回错误状态码时，清空列表
      fileLibraryStore.setLibraryList([]);
      fileLibraryStore.setTotal(0);
    }
  } catch (error) {
    ElMessage.error('获取回收站列表失败');
    // API调用失败时，清空列表
    fileLibraryStore.setLibraryList([]);
    fileLibraryStore.setTotal(0);
  }
}

// 添加获取收藏资源列表的方法
const getFavoriteList = async (search = '') => {
  try {
    const res = await getResourceFiles({
      page: 1,
      pageSize: 20,
      search
    });
    if (res.code === 200) {
      const list = res.data.data.map((item: any) => ({
        ...item,
        type: isFolder(item) ? 'folder' : 'file'
      }));
      fileLibraryStore.setLibraryList(list || []);
      fileLibraryStore.setTotal(res.data.total || 0);
    } else {
      // API调用成功但返回错误状态码时，清空列表
      fileLibraryStore.setLibraryList([]);
      fileLibraryStore.setTotal(0);
    }
  } catch (error) {
    ElMessage.error('获取收藏资源列表失败');
    // API调用失败时，清空列表
    fileLibraryStore.setLibraryList([]);
    fileLibraryStore.setTotal(0);
  }
}

// 辅助函数：判断是否为文件夹
const isFolder = (item: any) => {
  return item.length === 0 || item.contentType === 0 || item.type === 'folder';
};

// 添加获取客户端名称的辅助函数
const getClientName = (file: FileItem) => {
  // 如果是一级目录的项目文件夹，直接返回其clientName
  if (file.type === 'folder' && fileLibraryStore.currentPath.length === 0) {
    return file.clientName || '未设置';
  }
  
  // 如果是子层级（文件或文件夹），从当前项目信息中获取建设方/委托方
  if (fileLibraryStore.currentPath.length > 0) {
    // 从store中获取当前项目信息
    if (fileLibraryStore.currentProject && fileLibraryStore.currentProject.clientName) {
      return fileLibraryStore.currentProject.clientName;
    }
    // 如果项目信息中没有，尝试从文件自身获取
    return file.clientName || '未设置';
  }
  
  // 如果都没有，返回默认值
  return '未设置';
};

// 处理文件选中
const handleFileSelected = async (file: FileItem) => {
  // 检查file是否为null或undefined
  if (!file) {
    selectedFile.value = null;
    rightActiveTab.value = 0;
    return;
  }

  // 允许在所有层级选中文件，但只在第一层目录显示项目详情
  selectedFile.value = file;
  rightActiveTab.value = 0;
  
  // 如果是第一层目录的文件夹，获取详细信息
  if (file.type === 'folder' && fileLibraryStore.currentPath.length === 0) {
    try {
      const res = await getProjectFoldeInfo(file.id);
      if (res.code === 200) {
        // 合并详细信息到文件对象
        const detailedFile = {
          ...file,
          ...res.data
        };
        selectedFile.value = detailedFile;
        
        // 更新store中的项目信息
        fileLibraryStore.setCurrentProject({
          id: detailedFile.id,
          name: detailedFile.name,
          clientName: detailedFile.clientName,
          address: detailedFile.address,
          locationId: detailedFile.locationId
        });
      }
    } catch (error) {
      console.error('获取项目详细信息失败:', error);
    }
  }
}


// 计算背景色
const cardBgColor = computed(() => isDark.value ? '#000' : '#faf9f5')
const menuTextColor = computed(() => isDark.value ? '#EDEDED' : '#13343C')
// const navTextColor = computed(() => isDark.value ? '#EDEDED' : '#13343C')
const desktopBboder = computed(() => isDark.value ? 'rgba(231,231,224,.3)' : '#D7D7D7')//11111
const subTextColor = computed(() => isDark.value ? '#A1A1A1' : '#A1A1A1')
const vTextColor = computed(() => isDark.value ? '#EDEDED' : '#13343C')
const borderColor = computed(() => isDark.value ? 'transparent' : 'rgba(228, 231, 237, 0.6)')
const menuBgColor = computed(() => isDark.value ? '#000' : '#faf9f5')

// 处理点击事件
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const fileGrid = document.querySelector('.file-grid')
  const rightTabsElement = document.querySelector('.right-tabs')
  
  // 检查是否在任何弹框内（包括对话框、下拉菜单、选择器等）
  const isInAnyDialog = target.closest('.el-dialog') || 
                       target.closest('.el-select-dropdown') || 
                       target.closest('.el-select') ||
                       target.closest('.el-popper') ||
                       target.closest('.el-message-box') ||
                       target.closest('.el-notification') ||
                       target.closest('.el-loading-mask') ||
                       target.closest('.el-upload') ||
                       target.closest('.el-form') ||
                       target.closest('.el-form-item')

  // 检查点击是否在文件网格内、操作按钮区域内或任何弹框内
  const isClickInside = (fileGrid && fileGrid.contains(target)) ||
    (rightTabsElement && rightTabsElement.contains(target)) ||
    isInAnyDialog

  if (!isClickInside) {
    selectedFile.value = null
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
      // 一级目录：直接使用addProjectFile接口，不需要选择项目
      await addProjectFile(formData)
    } else {
      // 二级及n级目录：通过面包屑层级确定上传位置
      if (!fileLibraryStore.projectId) {
        throw new Error('项目ID不存在')
      }

      // 获取当前文件夹ID（面包屑最后一级）
      const currentFolderId = fileLibraryStore.folderPath[fileLibraryStore.folderPath.length - 1]?.id
      if (!currentFolderId) {
        throw new Error('当前文件夹ID不存在')
      }

      await addProjectResourceFile({
        projectId: fileLibraryStore.projectId,
        folderId: currentFolderId,
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
          type: isFolder(item) ? 'folder' : 'file'
        }));
        fileLibraryStore.setLibraryList(list || []);
        fileLibraryStore.setTotal(res.data.total || 0);
      }
    } else {
      const res = await getProjectResourceFile({
        projectId: fileLibraryStore.projectId,
        folderId: fileLibraryStore.folderPath[fileLibraryStore.folderPath.length - 1]?.id,
        page: 1,
        pageSize: 20,
        search: ''
      })
      if (res.code === 200) {
        const list = res.data.data.map((item: any) => ({
          ...item,
          type: isFolder(item) ? 'folder' : 'file'
        }));
        fileLibraryStore.setLibraryList(list || []);
        fileLibraryStore.setTotal(res.data.total || 0);
      }
    }
  } catch (error) {
    ElMessage.error('上传失败')
  } finally {
    uploadLoading.value = false
    uploadFile.value = null
  }
}

const fileLibraryRef = ref();

const handleFileOperation = async (tab: TabItem) => {
  // 上传文件、创建项目、新建文件夹和刷新列表不需要选择文件
  if (tab.name === '上传文件' || tab.name === '创建项目' || tab.name === '新建文件夹' || tab.name === '刷新列表') {
    switch (tab.name) {
      case '上传文件':
        uploadDialogVisible.value = true;
        break;
      case '创建项目':
        operationDialogVisible.value = true;
        operationType.value = 'create';
        // 重置创建项目表单
        createProjectForm.value = {
          name: '',
          address: '中国',
          clientName: '',
          locationId: null,
          selectedProvince: '',
          selectedCity: '',
        };
        selectedProvince.value = '';
        selectedCity.value = '';
        cityOptions.value = [];
        break;
      case '新建文件夹':
        operationDialogVisible.value = true;
        operationType.value = 'create';
        renameValue.value = '';
        break;
      case '刷新列表':
        try {
          if (activeIndex.value === 2) {
            await getTrashList(searchValue.value);
          } else if (activeIndex.value === 1) {
            await getFavoriteList(searchValue.value);
          } else {
            const res = await getProjectFile({
              page: 1,
              pageSize: 20,
              search: searchValue.value
            });
            if (res.code === 200) {
              const list = res.data.data.map((item: any) => ({
                ...item,
                type: isFolder(item) ? 'folder' : 'file'
              }));
              fileLibraryStore.setLibraryList(list || []);
              fileLibraryStore.setTotal(res.data.total || 0);
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
    case '打开':
      // 使用 FileLibrary 组件的 openFile 方法
      if (fileLibraryRef.value) {
        operationLoading.value = true;
        try {
          // 如果是收藏资源场景，先获取文件详细信息
          if (activeIndex.value === 1) {
            try {
              const detailRes = await getMyResourcesInfo(file.id);
              if (detailRes.code === 200) {
                // 合并详细信息到文件对象
                const detailedFile = {
                  ...file,
                  ...detailRes.data
                };
                await fileLibraryRef.value.openFile(detailedFile);
              } else {
                // 如果获取详细信息失败，使用原始文件
                await fileLibraryRef.value.openFile(file);
              }
            } catch (error) {
              console.error('获取文件详细信息失败:', error);
              // 如果获取详细信息失败，使用原始文件
              await fileLibraryRef.value.openFile(file);
            }
          } else {
            // 其他场景直接使用原始文件
            await fileLibraryRef.value.openFile(file);
          }
        } finally {
          operationLoading.value = false;
        }
      }
      break;
    case '取消收藏':
      operationDialogVisible.value = true;
      operationType.value = 'removeFavorite';
      break;
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
      renameValue.value = selectedFile.value.name;
      break;
    case '编辑项目':
      if (file.type === 'folder' && fileLibraryStore.currentPath.length === 0) {
        operationDialogVisible.value = true;
        operationType.value = 'edit';
        formDatassss.value = {
          id: file.id,
          name: file.name,
          address: file.address || '',
          clientName: file.clientName || '',
          createdAt: file.createdAt || ''
        };
        
        // 先清空之前的选择
        selectedProvince.value = '';
        selectedCity.value = '';
        cityOptions.value = [];
        
        // 通过 locationId 回显省市信息
        if (file.locationId) {
          // 先检查是否是省份ID
          const provinceOption = provinceOptions.value.find(province => 
            province.value.toString() === file.locationId?.toString()
          );
          
          if (provinceOption) {
            // 如果是省份ID
            selectedProvince.value = provinceOption.value;
            selectedCity.value = '';
            // 获取该省份的城市列表
            await getCityData(provinceOption.value);
          } else {
            // 如果不是省份ID，可能是城市ID，需要遍历所有省份的城市
            for (const province of provinceOptions.value) {
              // 获取该省份的城市列表
              await getCityData(province.value);
              // 在城市列表中查找
              const cityOption = cityOptions.value.find(city => 
                city.value.toString() === file.locationId?.toString()
              );
              if (cityOption) {
                selectedProvince.value = province.value;
                selectedCity.value = cityOption.value;
                break;
              }
            }
          }
        }
      }
      break;
    case '下载':
      // 如果是收藏资源场景，禁用下载功能
      if (activeIndex.value === 1) {
        ElMessage.warning('收藏资源暂不支持下载');
        return;
      }

      try {
        // 如果是文件夹，提示不能下载
        if (file.type === 'folder') {
          ElMessage.warning('文件夹不能下载');
          return;
        }

        operationLoading.value = true;

        // 其他场景：使用原有的项目文件下载逻辑
        // 根据当前路径层级选择不同的下载参数
        let downloadParams;
        if (fileLibraryStore.currentPath.length === 0) {
          // 一级目录：直接使用文件ID作为项目ID
          downloadParams = {
            projectId: file.id,
            fileId: file.id
          };
        } else {
          // 二级及n级目录：使用当前项目ID和文件ID
          if (!fileLibraryStore.projectId) {
            throw new Error('项目ID不存在');
          }
          downloadParams = {
            projectId: fileLibraryStore.projectId,
            fileId: file.id
          };
        }

        const res = await downProjectResourceFile(downloadParams);
        if (res.code === 200) {
          // 创建下载链接
          const blob = new Blob([res.data]);
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = file.name || 'download';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          ElMessage.success('下载成功');
        }
      } catch (error) {
        console.error('下载失败:', error);
        ElMessage.error('下载失败');
      } finally {
        operationLoading.value = false;
      }
      break;
  }
};

// 监听操作类型变化
watch(operationType, (newType) => {
  if (newType === 'rename' || newType === 'edit') {
    renameValue.value = selectedFile.value?.name || '';
  }
});

// 监听对话框关闭，清空表单数据
watch(operationDialogVisible, (visible) => {
  if (!visible && operationType.value === 'create') {
    // 对话框关闭时清空创建项目表单
    createProjectForm.value = {
      name: '',
      address: '中国',
      clientName: '',
      locationId: null,
      selectedProvince: '',
      selectedCity: '',
    };
    selectedProvince.value = '';
    selectedCity.value = '';
    cityOptions.value = [];
  }
});

// 监听 createProjectForm 变化，用于调试
watch(createProjectForm, (newVal, oldVal) => {
  console.log('createProjectForm 发生变化:', {
    old: oldVal,
    new: newVal
  });
}, { deep: true });

// 修改确认操作处理函数
const handleConfirmOperation = async () => {
  operationLoading.value = true;

  if (operationType.value === 'create') {
    // 根据当前路径层级选择不同的创建逻辑
    if (fileLibraryStore.currentPath.length === 0) {
      // 一级目录创建项目
      if (!createProjectForm.value.name) {
        ElMessage.warning('请输入项目名称');
        operationLoading.value = false;
        return;
      }
      if (!createProjectForm.value.selectedProvince) {
        ElMessage.warning('请选择项目地址');
        operationLoading.value = false;
        return;
      }

      try {
        const params = {
          name: createProjectForm.value.name,
          locationId: createProjectForm.value.selectedProvince,
          clientName: createProjectForm.value.clientName
        };
        console.log('创建项目参数:', params);
        console.log('createProjectForm 完整数据:', createProjectForm.value);
        const res = await addProjectFolder(params);
        console.log('API 响应:', res);
        console.log('API 响应 data:', res.data);
        console.log('API 响应完整内容:', JSON.stringify(res, null, 2));
        ElMessage.success('创建成功');
        // 刷新列表
        const listRes = await getProjectFile({
          page: 1,
          pageSize: 20,
          search: searchValue.value
        });
        if (listRes.code === 200) {
          const list = listRes.data.data.map((item: any) => ({
            ...item,
            type: isFolder(item) ? 'folder' : 'file'
          }));
          fileLibraryStore.setLibraryList(list || []);
        }
      } catch (error) {
        ElMessage.error('创建失败');
        operationLoading.value = false;
        return;
      }
      } else {
        // 二级及n级目录创建文件夹
        if (!renameValue.value) {
          ElMessage.warning('请输入文件夹名称');
          operationLoading.value = false;
          return;
        }
        try {
          if (!fileLibraryStore.projectId) {
            throw new Error('项目ID不存在');
          }

          // 获取当前文件夹ID（面包屑最后一级）
          const currentFolderId = fileLibraryStore.folderPath[fileLibraryStore.folderPath.length - 1]?.id;
          if (!currentFolderId) {
            throw new Error('当前文件夹ID不存在');
          }

        // 根据当前路径层级选择不同的API
        if (fileLibraryStore.currentPath.length === 1) {
          // 第二层：使用 addProjectResource（项目根目录下创建文件夹）
          await addProjectResource({
            projectId: fileLibraryStore.projectId,
            name: renameValue.value
          });
        } else {
          // 第三层及以上：使用 addThirdResource（子文件夹中创建文件夹）
          await addThirdResource({
            projectId: fileLibraryStore.projectId,
            folderId: currentFolderId,
            name: renameValue.value
          });
        }
        
        ElMessage.success('创建成功');
        // 刷新列表 - 使用store的refreshCurrentList方法
        await fileLibraryStore.refreshCurrentList(1, 20);
      } catch (error) {
        ElMessage.error('创建失败');
        operationLoading.value = false;
        return;
      }
    }
    operationDialogVisible.value = false;
    renameValue.value = '';
    operationLoading.value = false;
    return;
  }

  if (!selectedFile.value) {
    ElMessage.warning('请先选择一个文件');
    operationLoading.value = false;
    return;
  }

  const file = selectedFile.value;

  try {
    switch (operationType.value) {
      case 'removeFavorite':
        await deleteResourcesFile(file.id);
        ElMessage.success('取消收藏成功');
        await getFavoriteList(searchValue.value);
        break;
      case 'recover':
        if (!file.id) {
          throw new Error('文件ID不存在');
        }
        // 回收站还原：根据文件类型确定正确的projectId
        let recoverProjectId;
        
        if (file.type === 'folder') {
          // 文件夹还原：
          // 1. 如果是第一层项目文件夹，使用自身ID作为projectId
          // 2. 如果是子文件夹，尝试从多个可能的字段获取项目ID
          recoverProjectId = file.projectId || file.folderId || file.id;
        } else {
          // 文件还原：
          // 1. 优先使用 projectId 字段
          // 2. 其次使用 folderId 字段（可能是父文件夹ID）
          // 3. 最后使用 fileId 或 id 字段
          recoverProjectId = file.projectId || file.folderId || file.fileId || file.id;
        }
        
        console.log('还原文件信息:', {
          fileId: file.id,
          fileName: file.name,
          fileType: file.type,
          projectId: file.projectId,
          folderId: file.folderId,
          originalFileId: file.fileId,
          selectedProjectId: recoverProjectId
        });
        
        await recoverFile({
          projectId: recoverProjectId,
          id: file.id
        });
        ElMessage.success('还原成功');
        // 刷新回收站列表
        await getTrashList(searchValue.value);
        break;
      case 'delete':
        if (file.type === 'folder') {
          if (!file.id) {
            throw new Error('文件夹ID不存在');
          }
          // 根据当前路径层级选择不同的删除逻辑
          if (fileLibraryStore.currentPath.length === 0) {
            // 第一层目录：直接删除项目文件夹
            await deleteProjectFolder(file.id);
          } else {
            // 子目录：需要传递projectId
            if (!fileLibraryStore.projectId) {
              throw new Error('项目ID不存在');
            }
            await deleteProjectFolder(file.id);
          }
        } else {
          if (!file.id) {
            throw new Error('文件ID不存在');
          }
          // 根据当前路径层级选择不同的删除参数
          if (fileLibraryStore.currentPath.length === 0) {
            // 第一层目录：直接使用文件ID作为项目ID
            await deleteProjectResourceFile({
              projectId: file.id,
              fileId: file.id
            });
          } else {
            // 子目录：使用当前项目ID
            if (!fileLibraryStore.projectId) {
              throw new Error('项目ID不存在');
            }
            await deleteProjectResourceFile({
              projectId: fileLibraryStore.projectId,
              fileId: file.id
            });
          }
        }
        ElMessage.success('删除成功');
        // 刷新回收站列表
        await getTrashList(searchValue.value);

        // 如果当前在回收站且删除成功后列表为空，自动回到第一级目录
        if (activeIndex.value === 2) {
          const trashRes = await getTrashedList({
            page: 1,
            pageSize: 20,
            search: searchValue.value
          });
          if (trashRes.code === 200 && trashRes.data.data.length === 0) {
            // 如果回收站为空，切换到我的项目
            activeIndex.value = 0;
            fileLibraryStore.currentPath = [];
            fileLibraryStore.projectId = null;
            fileLibraryStore.folderPath = [];
            // 刷新项目列表
            const projectRes = await getProjectFile({
              page: 1,
              pageSize: 20,
              search: searchValue.value
            });
            if (projectRes.code === 200) {
              const list = projectRes.data.data.map((item: any) => ({
                ...item,
                type: isFolder(item) ? 'folder' : 'file'
              }));
              fileLibraryStore.setLibraryList(list || []);
              fileLibraryStore.setTotal(projectRes.data.total || 0);
            }
          }
        }
        break;
      case 'trash':
        if (file.type === 'folder') {
          if (!file.id) {
            throw new Error('文件夹ID不存在');
          }
          // 根据当前路径层级选择不同的删除参数
          if (fileLibraryStore.currentPath.length === 0) {
            // 第一层目录：直接使用文件夹ID作为项目ID
            await transhFile({
              projectId: file.id,
              id: file.id
            });
          } else {
            // 子目录：使用当前项目ID
            if (!fileLibraryStore.projectId) {
              throw new Error('项目ID不存在');
            }
            await transhFile({
              projectId: fileLibraryStore.projectId,
              id: file.id
            });
          }
        } else {
          if (!file.id) {
            throw new Error('文件ID不存在');
          }
          // 根据当前路径层级选择不同的删除参数
          if (fileLibraryStore.currentPath.length === 0) {
            // 第一层目录：直接使用文件ID作为项目ID
            await transhFile({
              projectId: file.id,
              id: file.id
            });
          } else {
            // 子目录：使用当前项目ID
            if (!fileLibraryStore.projectId) {
              throw new Error('项目ID不存在');
            }
            await transhFile({
              projectId: fileLibraryStore.projectId,
              id: file.id
            });
          }
        }
        ElMessage.success('已放入回收站');
        // 刷新列表
        const res = await getProjectFile({
          page: 1,
          pageSize: 20,
          search: searchValue.value
        });
        if (res.code === 200) {
          // 根据 length 是否为 0 来判断类型
          const list = res.data.data.map((item: any) => ({
            ...item,
            type: isFolder(item) ? 'folder' : 'file'
          }));
          fileLibraryStore.setLibraryList(list || []);

          // 如果当前在子目录且删除成功后回到第一级，自动重置路径
          if (fileLibraryStore.currentPath.length > 0) {
            fileLibraryStore.currentPath = [];
            fileLibraryStore.projectId = null;
            fileLibraryStore.folderPath = [];
          }
        }
        break;
      case 'upload':
        if (!uploadFile.value) {
          throw new Error('请选择要上传的文件');
        }
        const formData = new FormData();
        formData.append('file', uploadFile.value);
        await addProjectFile(formData);
        ElMessage.success('上传成功');
        // 刷新列表
        const res2 = await getProjectFile({
          page: 1,
          pageSize: 20,
          search: searchValue.value
        });
        if (res2.code === 200) {
          // 根据 length 是否为 0 来判断类型
          const list = res2.data.data.map((item: any) => ({
            ...item,
            type: isFolder(item) ? 'folder' : 'file'
          }));
          fileLibraryStore.setLibraryList(list || []);
        }
        break;
      case 'rename':
        if (file.type === 'folder') {
          // 如果是第一层文件夹（项目），使用 editProjectFoldeInfo
          if (fileLibraryStore.currentPath.length === 0) {
            await editProjectFoldeInfo({
              projectId: file.id,
              name: renameValue.value
            });
          } else {
            // 如果是子文件夹，使用 editProjectResource
            await editProjectResource({
              projectId: fileLibraryStore.projectId || file.id,
              folderId: file.id,
              name: renameValue.value
            });
          }
        } else {
          // 如果是文件，使用 editProjectResourceFile
          await editProjectResourceFile({
            projectId: fileLibraryStore.projectId || file.id,
            fileId: file.id,
            name: renameValue.value
          });
        }
        ElMessage.success('重命名成功');
        // 刷新列表
        await fileLibraryStore.refreshCurrentList();
        break;
      case 'edit':
        await editProjectFoldeInfo({
          projectId: formDatassss.value.id,
          name: formDatassss.value.name,  // 使用项目名称
          locationId: selectedCity.value || selectedProvince.value,
          clientName: formDatassss.value.clientName,  // 建设方/委托方
          createdAt: formDatassss.value.createdAt
        });
        ElMessage.success('编辑成功');
        await fileLibraryStore.refreshCurrentList();
        break;
    }
    operationDialogVisible.value = false;
    renameValue.value = '';
  } catch (error) {
    console.error('操作失败:', error);
    ElMessage.error(error instanceof Error ? error.message : '操作失败');
  } finally {
    operationLoading.value = false;
  }
};

// 添加文件大小转换函数
const formatFileSize = (bytes: number) => {
  if (!bytes || bytes === 0) return '0 MB';
  const mb = bytes / (1024 * 1024);
  return mb.toFixed(2) + ' MB';
};

// 添加日期格式化函数
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// 监听搜索值变化
watch(searchValue, async (newValue) => {
  searchLoading.value = true;
  try {
    if (activeIndex.value === 0) {
      // 我的项目搜索
      const res = await getProjectFile({
        page: 1,
        pageSize: 20,
        search: newValue
      });
      if (res.code === 200) {
        const list = res.data.data.map((item: any) => ({
          ...item,
          type: item.length === 0 ? 'folder' : 'file'
        }));
        fileLibraryStore.setLibraryList(list || []);
      } else {
        // API调用成功但返回错误状态码时，清空列表
        fileLibraryStore.setLibraryList([]);
      }
    } else if (activeIndex.value === 1) {
      // 我收藏的资源搜索
      const res = await getResourceFiles({
        page: 1,
        pageSize: 20,
        search: newValue
      });
      if (res.code === 200) {
        const list = res.data.data.map((item: any) => ({
          ...item,
          type: isFolder(item) ? 'folder' : 'file'
        }));
        fileLibraryStore.setLibraryList(list || []);
        fileLibraryStore.setTotal(res.data.total || 0);
      } else {
        // API调用成功但返回错误状态码时，清空列表
        fileLibraryStore.setLibraryList([]);
        fileLibraryStore.setTotal(0);
      }
    } else if (activeIndex.value === 2) {
      // 回收站搜索
      const res = await getTrashedList({
        page: 1,
        pageSize: 20,
        search: newValue
      });
      if (res.code === 200) {
        const list = res.data.data.map((item: any) => ({
          ...item,
          type: item.length === 0 ? 'folder' : 'file'
        }));
        fileLibraryStore.setLibraryList(list || []);
      } else {
        // API调用成功但返回错误状态码时，清空列表
        fileLibraryStore.setLibraryList([]);
      }
    }
  } catch (error) {
    ElMessage.error('搜索失败');
    // API调用失败时，清空列表
    fileLibraryStore.setLibraryList([]);
  } finally {
    searchLoading.value = false;
  }
});

// 初始化加载项目列表
onMounted(async () => {
  try {
    if (activeIndex.value === 0) {
      const res = await getProjectFile({
        page: 1,
        pageSize: 20,
        search: searchValue.value
      });
      console.log('初始化项目列表:', res);
      if (res.code === 200) {
        const list = res.data.data.map((item: any) => ({
          ...item,
          type: item.length === 0 ? 'folder' : 'file'
        }));
        fileLibraryStore.setLibraryList(list || []);
        fileLibraryStore.setTotal(res.data.total || 0);
      } else {
        // API调用成功但返回错误状态码时，清空列表
        fileLibraryStore.setLibraryList([]);
        fileLibraryStore.setTotal(0);
      }
    } else if (activeIndex.value === 1) {
      await getFavoriteList(searchValue.value);
    } else if (activeIndex.value === 2) {
      await getTrashList(searchValue.value);
    }
  } catch (error) {
    fileLibraryStore.setLibraryList([]);
    fileLibraryStore.setTotal(0);
  }
  // 使用捕获阶段监听点击事件
  document.addEventListener('click', handleClickOutside, true)
  await getProvinceData();
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
              size="small" v-loading="searchLoading" />
            <div class="right-tabs">
              <div v-for="tab in rightTabs" :key="tab.name" class="right-tab">
                <el-icon :size="18" style="margin-right: 4px;">
                  <component :is="tab.icon" />
                </el-icon>
                <span @click="handleFileOperation(tab)" :class="{ 'loading': operationLoading }">{{ tab.name }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="dcontent-cont">
          <div class="dcontent-cont-left" v-loading="searchLoading">
            <FileLibrary ref="fileLibraryRef" @fileSelected="handleFileSelected" :activeIndex="activeIndex" />
          </div>
          <div class="dcontent-cont-right" v-if="selectedFile">
            <div class="file-detail">
              <div class="file-preview" v-if="selectedFile?.preview">
                <img :src="selectedFile.preview" :alt="selectedFile.name">
              </div>
              <div class="file-info">
                <h3 style="font-size: 14px;"><el-icon>
                    <Tickets />
                  </el-icon> {{ fileLibraryStore.currentPath.length === 0 ? '项目详情' : '文件详情' }}</h3>
                <!-- <div class="info-item"> -->
                <!-- <span class="label">项目详情</span> -->
                <!-- <span class="value">{{ selectedFile.type === 'folder' ? '文件夹' : '文件' }}</span> -->
                <!-- </div> -->
                <div class="info-item" v-if="selectedFile?.name">
                  <span class="label">{{ fileLibraryStore.currentPath.length === 0 ? '项目名称：' : '文件名称：' }}</span>
                  <span class="value">{{ selectedFile.name }}</span>
                </div>
                <div class="info-item" v-if="selectedFile?.createdAt">
                  <span class="label">创建时间：</span>
                  <span class="value">{{ formatDate(selectedFile.createdAt) }}</span>
                </div>
                <div class="info-item" v-if="selectedFile?.length">
                  <span class="label">大小：</span>
                  <span class="value">{{ formatFileSize(selectedFile.length) }}</span>
                </div>
                <div class="info-item" >
                  <span class="label">建设方/委托方</span>
                  <span class="value">{{ getClientName(selectedFile) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="dcontent-cont-right" v-else>
            <div class="empty-container">
              <el-empty description="请选择一个文件或者文件夹预览" :image-size="40" :image="simplified" />
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>

  <!-- 添加文件上传对话框 -->
  <el-dialog v-model="uploadDialogVisible" title="上传文件" width="400px" :close-on-click-modal="false">
    <el-upload class="upload-demo" drag :auto-upload="false" :show-file-list="false" :on-change="handleFileSelect">
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
        <div class="dialog-button cancel" @click="() => {
          uploadDialogVisible = false;
          uploadFile = null;
        }">取消</div>
        <div class="dialog-button confirm" @click="handleUpload" :loading="uploadLoading">
          上传
        </div>
      </span>
    </template>
  </el-dialog>

  <!-- 操作确认弹框 -->
  <el-dialog v-model="operationDialogVisible" :title="operationType === 'recover' ? '还原确认' :
    operationType === 'delete' ? '删除确认' :
      operationType === 'trash' ? '回收站确认' :
        operationType === 'rename' ? '重命名' :
          operationType === 'edit' ? '编辑项目' :
            operationType === 'removeFavorite' ? '取消收藏确认' :
              operationType === 'create' ? (fileLibraryStore.currentPath.length === 0 ? '创建项目' : '新建文件夹') : ''"
    width="30%" :close-on-click-modal="false">
    <template v-if="operationType === 'rename'">
      <el-input v-model="renameValue" placeholder="请输入新的名称" />
    </template>
    <template v-else-if="operationType === 'create' && fileLibraryStore.currentPath.length === 0">
      <el-form :model="createProjectForm" label-width="130px">
        <el-form-item label="项目名称">
          <el-input v-model="createProjectForm.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="项目地址">
          <el-select v-model="country" style="width: 130px; margin-right: 10px;" disabled>
            <el-option label="中国" value="中国" />
          </el-select>
          <el-select v-model="createProjectForm.selectedProvince" placeholder="选择省份" style="width: 130px; margin-right: 10px;"
            @change="onProvinceChange">
            <el-option v-for="item in provinceOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-model="createProjectForm.selectedCity" placeholder="选择城市" style="width: 130px;" :disabled="!createProjectForm.selectedProvince">
            <el-option v-for="item in cityOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="建设方/委托方">
          <el-input v-model="createProjectForm.clientName" placeholder="请输入建设方/委托方" />
        </el-form-item>
      </el-form>
    </template>
    <template v-else-if="operationType === 'create' && fileLibraryStore.currentPath.length > 0">
      <el-input v-model="renameValue" placeholder="请输入文件夹名称" />
    </template>
    <template v-else-if="operationType === 'edit'">
      <el-form :model="formDatassss" label-width="130px">
        <el-form-item label="项目名称">
          <el-input v-model="formDatassss.name" />
        </el-form-item>
        <el-form-item label="项目地址">
          <el-select v-model="country" style="width: 130px; margin-right: 10px;" disabled>
            <el-option label="中国" value="中国" />
          </el-select>
          <el-select v-model="selectedProvince" placeholder="选择省份" style="width: 130px; margin-right: 10px;"
            @change="onProvinceChange">
            <el-option v-for="item in provinceOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-model="selectedCity" placeholder="选择城市" style="width: 130px;" :disabled="!selectedProvince">
            <el-option v-for="item in cityOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="建设方/委托方">
          <el-input v-model="formDatassss.clientName" />
        </el-form-item>
        <!-- <el-form-item label="创建日期">
          <el-input v-model="formDatassss.createdAt" />
        </el-form-item> -->
      </el-form>
    </template>
    <template v-else>
      <span>{{ operationType === 'recover' ? '确定要还原该文件吗？' :
        operationType === 'delete' ? '确定要彻底删除该文件吗？此操作不可恢复！' :
          operationType === 'removeFavorite' ? '确定要取消收藏该文件吗？' :
            '确定要删除文件吗？若删除文件，之后可以在回收站中还原。' }}</span>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <div class="dialog-button cancel" @click="operationDialogVisible = false">取消</div>
        <div class="dialog-button confirm" @click="handleConfirmOperation" :loading="operationLoading">确定</div>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">
.desktop-container {
  // padding: 20px;
  height: 100%;
  // background-color: var(--theme-background);

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
  color: var(--el-text-color-primary);
  font-size: 24px;
  /* font-weight: bold; */
  // margin-bottom: 20px;
  color: v-bind(menuTextColor);
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);

}

.desktop-content {
  min-height: 300px;
  color: var(--el-text-color-regular);
  border: 1px solid v-bind(desktopBboder);
  border-radius: 10px;

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
            bottom: -15px;
            left: -2px;
            right: -2px;
            height: 2px;
            background-color: v-bind(vTextColor);
          }
        }

        span {
          // color: #C4C4D3;
        }

        &:not(.active) span {
          // color: #8E9094;
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
          font-size: 12px;
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

          span {
            &.loading {
              opacity: 0.6;
              cursor: not-allowed;
            }
          }
        }
      }
    }
  }

  .dcontent-cont {
    min-height: 540px;
    display: flex;
    position: relative;

    .dcontent-cont-left {
      flex: 1;
      padding: 20px;
      padding-right: 280px; // 为右侧面板预留空间
    }

    .dcontent-cont-right {
      position: absolute;
      right: 0;
      top: 0;
      width: 260px;
      border-left: 1px solid v-bind(desktopBboder);
      padding: 20px;
      // background-color: var(--el-bg-color);
      height: 100%;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      opacity: 1;
      visibility: visible;
      padding-top: 30px;

      &:not([style*="display: none"]) {
        opacity: 1;
        visibility: visible;
      }

      &[style*="display: none"] {
        opacity: 0;
        visibility: hidden;
      }

      .file-detail {
        .file-preview {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 20px;
          // background-color: var(--el-bg-color-overlay);

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
            margin-bottom: 15px;
            display: flex;
            align-items: flex-start;
            font-size: 12px;

            .label {
              color: v-bind(subTextColor);
              width: 80px;
              flex-shrink: 0;
              line-height: 1.4;
            }

            .value {
              color: v-bind(menuTextColor);
              flex: 1;
              line-height: 1.4;
              word-wrap: break-word;
              word-break: break-all;
              text-align: right;
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

  // 自定义上传文字颜色
  :deep(.el-upload__text) {
    // color: #F9DE4A !important;

    em {
      color: #ff9900 !important;
    }
  }

  // 自定义上传图标颜色
  :deep(.el-icon--upload) {
    // color: #F9DE4A !important;
  }

  // 自定义提示文字颜色
  :deep(.el-upload__tip) {
    // color: #F9DE4A !important;
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
      background-color: #FABD33;
      color: #1B2126;

      &:hover {
        background-color: rgba(250,189,51, .6);
      }

      // 自定义loading圈圈颜色
      :deep(.el-loading-spinner) {
        .circular {
          .path {
            stroke: #F9DE4A !important;
          }
        }
      }

      // 更强的优先级选择器
      :deep(.el-loading-spinner .circular .path) {
        stroke: #F9DE4A !important;
      }

      // 直接针对loading状态
      &.is-loading {
        :deep(.el-loading-spinner .circular .path) {
          stroke: #F9DE4A !important;
        }
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

      // 自定义loading圈圈颜色
      :deep(.el-loading-spinner) {
        .circular {
          .path {
            stroke: #F9DE4A !important;
          }
        }
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

        // 自定义loading圈圈颜色
        :deep(.el-loading-spinner) {
          .circular {
            .path {
              stroke: #F9DE4A !important;
            }
          }
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

.empty-container {
  display: flex;
  align-items: center;
  height: 100%;
  min-height: 400px;
  align-content: flex-start;
  flex-direction: column;
  padding-top: 150px;
}

// 全局覆盖loading圈圈颜色
:deep(.el-loading-spinner .circular .path) {
  stroke: #F9DE4A !important;
}

// 针对按钮的loading圈圈
:deep(.el-button .el-loading-spinner .circular .path) {
  stroke: #F9DE4A !important;
}

// 针对对话框按钮的loading圈圈
:deep(.dialog-button .el-loading-spinner .circular .path) {
  stroke: #F9DE4A !important;
}

.file-grid-item {

  &.active,
  &:hover {
    .file-info {
      display: flex;
      align-items: center;

      .file-name-input {
        color: #ff9900 !important;
      }
    }
  }

  .file-name-input {
    color: #ff9900 !important;
  }
}
</style>