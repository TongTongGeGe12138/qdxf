<template>
  <div class="knowledge-base-container">
    <h1 class="page-title">知识库</h1>
    <div class="main-panel">
      <div class="controls-header">
        <div class="main-tabs">
          <div
            v-for="(tab, index) in mainTabs"
            :key="index"
            class="tab"
            :class="{ active: activeMainTab === index }"
            @click="handleTabChange(index)"
          >
            {{ tab }}
          </div>
        </div>
        <el-input
          v-model="searchQuery"
          placeholder="搜索项目或文件"
          :prefix-icon="Search"
          class="search-input"
          clearable
        />
      </div>

      <div class="filter-section">
        <div
          v-for="(group, groupIndex) in filterGroups"
          :key="groupIndex"
          class="filter-group"
        >
          <div class="filter-title">{{ group.title }}</div>
          <div class="tags">
            <div
              v-for="(tag, tagIndex) in group.filters"
              :key="tagIndex"
              class="tag"
              :class="{ active: group.activeFilter === tag }"
              @click="handleFilterChange(groupIndex, tag)"
            >
              {{ tag }}
            </div>
          </div>
        </div>
      </div>

      <div class="content-area" @click="handleContainerClick">
        <div v-if="loading" class="loading-container">
          <el-loading-spinner />
          <p>加载中...</p>
        </div>
        
        <div v-else-if="displayFileList.length === 0" class="empty-container">
          <el-empty description="暂无数据" />
        </div>
        
        <div v-else class="file-list">
          <div
            v-for="file in displayFileList"
            :key="file.id"
            class="file-item"
            :class="{ 'is-selected': selectedFile?.id === file.id  }"
            @click.stop="handleFileClick(file)"
            @dblclick.stop="handleFileDblClick(file)"
          >
            <div class="file-icon">
              <template v-if="file.type === 'back' || file.type === 'folder' || file.contentType === 0">
                <folder />
              </template>
              <img 
                v-else-if="file.thumbUrl && file.type !== 'folder' && file.contentType !== 0" 
                :src="file.thumbUrl" 
                :alt="file.name"
                @error="handleImageError"
              />
              <img 
                v-else
                :src="getFileIcon(file.type || '', file.contentType)" 
                :alt="file.type || 'file'" 
              />
            </div>
            <div class="file-info">
              <div class="file-name">{{ file.name || '未命名文件' }}</div>
            </div>
            <div class="file-actions" v-if="file.type !== 'folder' && file.type !== 'back' && file.contentType !== 0">
              <button class="action-btn" @click.stop="viewFile(file)">查看</button>
              <button class="action-btn" @click.stop="addToMyResource(file.id)">收藏资源</button>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="fileList.length > 0" class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- CAD查看器 -->
  <CadViewer
    v-model:visible="cadViewerVisible"
    :file-id="currentCadFile?.id || ''"
    :file-name="currentCadFile?.name || ''"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { isDark } from '@/utils/theme';
import { ElMessage } from 'element-plus';
import {
  getBeeResources,
  getTopLevelFiles,
  getFistLevelFiles,
  getSecondLevelListApi,
  downloadFile as downloadFileApi,
  addMyResource,
  getBeeResourcesSecond,
  removeMyResource
} from '@/api/dict';
import { getMyResourcesInfo, deleteResourcesFile } from '@/api/resource';
import folder from '@/assets/wjj.svg?component';
import CadViewer from '@/components/CadViewer.vue';

// 文件类型接口
interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  updateTime: string;
  thumbUrl?: string;
  contentType?: number;
  url?: string;
}

// 分类项接口
interface ClassificationItem {
  id: string;
  name: string;
}

// 响应式数据
const activeMainTab = ref(0);
const mainTabs = ref(['通用规范', '通用图库', '供应商图库', '样例模板']);
const searchQuery = ref('');
const loading = ref(false);
const fileList = ref<FileItem[]>([]);
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);
const selectedFile = ref<FileItem | null>(null);

// 当前选中的分类
const currentCategory = ref('');
const currentLv1 = ref('');

// 添加独立文件夹状态
const isInIndependentFolder = ref(false);
const currentFolderId = ref('');

// 分类相关数据
const standardClassificationList = ref<ClassificationItem[]>([]);
const normativeClassification = ref<ClassificationItem[]>([]);
const activeStandard = ref(0);
const activeNormative = ref(0);

const filterGroups = ref([
  {
    title: '标准分类',
    activeFilter: '',
    filters: []
  },
  {
    title: '规范分类',
    activeFilter: '全部',
    filters: ['全部']
  }
]);

// CAD查看器相关状态
const cadViewerVisible = ref(false);
const currentCadFile = ref<FileItem | null>(null);

// 计算属性：显示的文件列表（包含返回上级按钮）
const displayFileList = computed(() => {
  // 如果当前在二级分类中（不是"全部"）或在独立文件夹中，显示返回上级按钮
  if ((filterGroups.value[1].activeFilter && filterGroups.value[1].activeFilter !== '全部') || isInIndependentFolder.value) {
    const backItem: FileItem = {
      id: 'back',
      name: '返回上级',
      type: 'back',
      size: 0,
      updateTime: '',
      thumbUrl: undefined,
      contentType: undefined
    };
    return [backItem, ...fileList.value];
  }
  return fileList.value;
});

// 获取文件列表
const fetchFileList = async () => {
  loading.value = true;
  
  try {
    let response;
    const params = {
      all: false,
      search: searchQuery.value,
      page: currentPage.value,
      pageSize: pageSize.value
    };

    // 根据筛选条件获取数据
    if (filterGroups.value[0].activeFilter && (!filterGroups.value[1].activeFilter || filterGroups.value[1].activeFilter === '全部')) {
      // 如果选择了一级分类且二级分类为空或选择"全部"，显示该分类下的二级分类作为文件夹
      console.log('显示二级分类作为文件夹');
      console.log('二级分类数据:', normativeClassification.value);
      
      // 过滤掉"全部"选项，只显示实际的二级分类
      let folders = normativeClassification.value.filter(item => item.name !== '全部');
      
      // 如果有搜索关键词，在本地过滤文件夹名称
      if (searchQuery.value.trim()) {
        folders = folders.filter(item => 
          item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }
      
      fileList.value = folders.map((item: any, index: number) => {
        console.log(`处理第${index}项:`, item);
        return {
          id: item.id || item.folderId || item._id,
          name: item.name || item.title || item.folderName || '未命名文件夹',
          type: 'folder',
          size: item.size || 0,
          updateTime: item.updateTime || item.createTime || item.updatedAt || new Date().toISOString()
        };
      });
      total.value = folders.length;
    } else if (filterGroups.value[1].activeFilter && filterGroups.value[1].activeFilter !== '全部') {
      // 如果选择了二级分类，获取该分类下的文件
      try {
        // 找到对应的二级分类对象以获取ID
        const selectedCategory = normativeClassification.value.find(item => item.name === filterGroups.value[1].activeFilter);
        if (!selectedCategory) {
          console.error('未找到对应的二级分类:', filterGroups.value[1].activeFilter);
          fileList.value = [];
          total.value = 0;
          return;
        }
        
        // 使用getSecondLevelListApi获取二级分类下的文件
        response = await getSecondLevelListApi({
          id: selectedCategory.id,
          ...params
        });
        
        if (response && response.code === 200) {
          console.log('获取二级分类文件数据:', response.data);
          let fileData = [];
          if (response.data?.data && Array.isArray(response.data.data)) {
            fileData = response.data.data;
          } else if (response.data?.list && Array.isArray(response.data.list)) {
            fileData = response.data.list;
          } else if (Array.isArray(response.data)) {
            fileData = response.data;
          }
          
          if (Array.isArray(fileData)) {
            fileList.value = fileData;
            total.value = response.data?.total || fileData.length;
          } else {
            console.error('文件数据不是数组:', fileData);
            fileList.value = [];
            total.value = 0;
          }
        }
      } catch (error) {
        console.error('获取二级分类文件失败:', error);
        // 如果失败，尝试使用getFistLevelFiles
        try {
          response = await getFistLevelFiles({
            category: currentCategory.value,
            fist: filterGroups.value[0].activeFilter,
            second: filterGroups.value[1].activeFilter,
            ...params
          });
          
          if (response && response.code === 200) {
            console.log('获取二级分类文件数据(备用方法):', response.data);
            let fileData = [];
            if (response.data?.data && Array.isArray(response.data.data)) {
              fileData = response.data.data;
            } else if (response.data?.list && Array.isArray(response.data.list)) {
              fileData = response.data.list;
            } else if (Array.isArray(response.data)) {
              fileData = response.data;
            }
            
            if (Array.isArray(fileData)) {
              fileList.value = fileData;
              total.value = response.data?.total || fileData.length;
            } else {
              console.error('备用方法文件数据不是数组:', fileData);
              fileList.value = [];
              total.value = 0;
            }
          }
        } catch (secondError) {
          console.error('备用方法也失败:', secondError);
          ElMessage.error('获取文件数据失败');
        }
      }
    } else {
      // 默认获取顶级分类下的文件
      response = await getTopLevelFiles({
        category: currentCategory.value,
        ...params
      });
      
      if (response && response.code === 200) {
        console.log('获取顶级分类文件数据:', response.data);
        let fileData = [];
        if (response.data?.data && Array.isArray(response.data.data)) {
          fileData = response.data.data;
        } else if (response.data?.list && Array.isArray(response.data.list)) {
          fileData = response.data.list;
        } else if (Array.isArray(response.data)) {
          fileData = response.data;
        }
        
        if (Array.isArray(fileData)) {
          fileList.value = fileData;
          total.value = response.data?.total || fileData.length;
        } else {
          console.error('顶级分类文件数据不是数组:', fileData);
          fileList.value = [];
          total.value = 0;
        }
      }
    }

    if (response && response.code !== 200) {
      ElMessage.error(response.message || '获取文件列表失败');
    }
  } catch (error) {
    console.error('获取文件列表失败:', error);
    ElMessage.error('获取文件列表失败');
  } finally {
    loading.value = false;
  }
};

// 处理标签页切换
const handleTabChange = (index: number) => {
  activeMainTab.value = index;
  currentCategory.value = getCategoryByTab(index);
  currentLv1.value = '';
  currentPage.value = 1;
  
  // 重置筛选条件
  filterGroups.value[0].activeFilter = '';
  filterGroups.value[1].activeFilter = '';
  
  // 重置独立文件夹状态
  isInIndependentFolder.value = false;
  currentFolderId.value = '';
  
  // 获取分类数据
  getBeeResourcesFn();
};

// 根据标签页获取分类
const getCategoryByTab = (tabIndex: number) => {
  // 根据参考页面，使用正确的中文分类名称
  const categories = ['通用规范', '通用图库', '供应商图库', '样例模板'];
  return categories[tabIndex] || '通用规范';
};

// 处理筛选条件变化
const handleFilterChange = (groupIndex: number, filter: string) => {
  filterGroups.value[groupIndex].activeFilter = filter;
  
  // 重置独立文件夹状态
  isInIndependentFolder.value = false;
  currentFolderId.value = '';
  
  if (groupIndex === 0) {
    // 标准分类（一级分类）
    // 找到对应的分类对象以获取ID
    const selectedCategory = standardClassificationList.value.find(item => item.name === filter);
    currentLv1.value = filter;
    // 重置二级分类选择
    filterGroups.value[1].activeFilter = '';
    // 获取该一级分类下的二级分类
    getBeeResourcesSecondFn(filter);
  } else if (groupIndex === 1) {
    // 规范分类（二级分类）
    if (filter === '全部') {
      // 如果选择全部，重新获取二级分类数据并显示为文件夹
      currentLv1.value = filterGroups.value[0].activeFilter;
      // 重新获取二级分类数据
      getBeeResourcesSecondFn(filterGroups.value[0].activeFilter);
    } else {
      // 使用二级分类
      currentLv1.value = filter;
      // 获取该分类下的文件
      fetchFileList();
    }
  }
  
  currentPage.value = 1;
  // 只有在选择具体二级分类时才调用fetchFileList
  if (groupIndex !== 1 || filter !== '全部') {
    fetchFileList();
  }
};

// 处理搜索
const handleSearch = () => {
  console.log('执行搜索，关键词:', searchQuery.value);
  currentPage.value = 1;
  fetchFileList();
};

// 处理文件点击
const handleFileClick = (file: FileItem) => {
  console.log('点击文件:', file);
  
  // 设置选中状态
  selectedFile.value = file;
};

// 处理文件双击事件
const handleFileDblClick = async (file: FileItem) => {
  console.log('双击文件:', file);
  
  // 如果双击的是返回上级按钮
  if (file.type === 'back') {
    console.log('返回上级');
    handleBackToParent();
    return;
  }
  
  // 如果双击的是文件夹，进入该文件夹
  if (file.type === 'folder' || file.contentType === 0) {
    console.log('进入文件夹:', file.name);
    
    // 如果是通过二级分类创建的文件夹，使用原来的逻辑
    const selectedCategory = normativeClassification.value.find(item => item.name === file.name);
    if (selectedCategory) {
      // 设置选中的二级分类
      filterGroups.value[1].activeFilter = selectedCategory.name;
      // 获取该分类下的文件
      fetchFileList();
    } else {
      // 如果是独立的文件夹（contentType为0），直接使用文件夹ID获取内容
      console.log('使用文件夹ID获取内容:', file.id);
      enterFolder(file.id);
    }
    return;
  }

  // 如果是文件，则在新窗口打开预览
  viewFile(file);
};

// 处理容器点击事件
const handleContainerClick = () => {
  // 点击容器时取消选中状态
  selectedFile.value = null;
};

// 下载文件
const downloadFile = async (fileId: string) => {
  try {
    const response = await downloadFileApi(fileId);
    if (response.code === 200) {
      ElMessage.success('下载成功');
      // 这里可以添加实际的下载逻辑
    } else {
      ElMessage.error(response.message || '下载失败');
    }
  } catch (error) {
    console.error('下载失败:', error);
    ElMessage.error('下载失败');
  }
};

// 在新窗口预览文件
const viewFile = async (file: FileItem) => {
  try {
    // 检查文件类型，如果是DWG格式，使用CAD查看器
    if (file.contentType === 141 || file.type?.toLowerCase() === 'dwg') {
      // 使用CAD查看器组件
      currentCadFile.value = file;
      cadViewerVisible.value = true;
    } else {
      // 其他文件类型获取链接后在新窗口打开
      const res = await getMyResourcesInfo(file.id);
      if (res.code === 200 && res.data.url) {
        window.open(res.data.url, '_blank');
      } else {
        ElMessage.warning('获取文件链接失败或链接不存在');
      }
    }
  } catch (error) {
    console.error('获取文件链接失败:', error);
    ElMessage.error('获取文件链接失败');
  }
};

// 处理分页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
  fetchFileList();
};

// 处理当前页变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page;
  fetchFileList();
};

// 获取文件图标
const getFileIcon = (fileType: string, contentType?: number) => {
  if (!fileType) {
    return '/src/assets/file-icons/fileSvg.svg';
  }
  
  // 如果是文件夹，返回文件夹图标
  if (fileType === 'folder' || contentType === 0) {
    return '/src/assets/file-icons/folder-large.svg';
  }
  
  // 如果有contentType，优先使用contentType映射
  if (contentType) {
    const contentTypeMap: Record<number, string> = {
      41: '/src/assets/file-icons/PDF.png',
      42: '/src/assets/file-icons/DOC.png',
      43: '/src/assets/file-icons/XLSX.png',
      45: '/src/assets/file-icons/PPT.png',
      61: '/src/assets/file-icons/JPG.png',
      62: '/src/assets/file-icons/PNG.png',
      141: '/src/assets/file-icons/DWG.png',
      142: '/src/assets/file-icons/DXF.png',
      161: '/src/assets/file-icons/RVT.png',
      162: '/src/assets/file-icons/RFA.png',
      163: '/src/assets/file-icons/RTE.png',
      164: '/src/assets/file-icons/IFG.png',
      121: '/src/assets/file-icons/ZIP.png',
      122: '/src/assets/file-icons/RAR.png',
      21: '/src/assets/file-icons/TXT.png'
    };
    return contentTypeMap[contentType] || '/src/assets/file-icons/fileSvg.svg';
  }
  
  const iconMap: Record<string, string> = {
    'pdf': '/src/assets/file-icons/PDF.png',
    'doc': '/src/assets/file-icons/DOC.png',
    'docx': '/src/assets/file-icons/DOCX.png',
    'xlsx': '/src/assets/file-icons/XLSX.png',
    'pptx': '/src/assets/file-icons/PPTX.png',
    'dwg': '/src/assets/file-icons/DWG.png',
    'dxf': '/src/assets/file-icons/DXF.png',
    'jpg': '/src/assets/file-icons/JPG.png',
    'png': '/src/assets/file-icons/PNG.png',
    'zip': '/src/assets/file-icons/ZIP.png',
    'rar': '/src/assets/file-icons/RAR.png'
  };
  return iconMap[fileType.toLowerCase()] || '/src/assets/file-icons/fileSvg.svg';
};

// 处理图片加载失败
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  // 当预览图加载失败时，回退到文件类型图标
  const fileItem = fileList.value.find(file => file.thumbUrl === img.src);
  if (fileItem) {
    img.src = getFileIcon(fileItem.type || '', fileItem.contentType);
  }
};

// 格式化文件大小
const formatFileSize = (size: number) => {
  if (size < 1024) return size + ' B';
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
  if (size < 1024 * 1024 * 1024) return (size / (1024 * 1024)).toFixed(1) + ' MB';
  return (size / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
};

// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN');
};

// 监听搜索查询变化
watch(searchQuery, () => {
  // 防抖处理
  clearTimeout((window as any).searchTimer);
  (window as any).searchTimer = setTimeout(() => {
    currentPage.value = 1; // 重置页码
    handleSearch();
  }, 500);
});

// 组件挂载时获取数据
onMounted(() => {
  // 设置初始分类
  currentCategory.value = getCategoryByTab(activeMainTab.value);
  
  // 获取分类数据，这个函数会接着调用 fetchFileList
  getBeeResourcesFn();
});

// Style-related computed properties
const menuTextColor = computed(() => isDark.value ? '#EDEDED' : '#13343C');
const subTextColor = computed(() => isDark.value ? '#A1A1A1' : '#13343C');
const borderColor = computed(() => isDark.value ? 'rgba(231, 231, 224, 0.2)' : 'rgba(0, 0, 0, 0.1)');
const menuBgColor = computed(() => isDark.value ? '#0A0A0A' : '#FFFFFF');
const tagHoverBgColor = computed(() => isDark.value ? '#2b2b2b' : '#f0f0f0');
const tagActiveColor = computed(() => isDark.value ? '#ff9900' : '#ff9900');
const tagActiveBgColor = computed(() => isDark.value ? '#F9DE4A' : '#F9DE4A');

// 获取一级分类
const getBeeResourcesFn = async () => {
  try {
    const { data, code } = await getBeeResources(currentCategory.value);
    if (code === 200) {
      console.log('获取一级分类数据:', data);
      standardClassificationList.value = data;
      // 更新筛选条件
      updateFilterGroups();
      const fist = data[activeStandard.value]?.name;
      const id = data[activeStandard.value]?.id;
      if (fist) {
        // 获取二级分类
        await getBeeResourcesSecondFn(fist);
        // fetchFileList已经在getBeeResourcesSecondFn中调用了
      }
    }
  } catch (err) {
    console.log('获取一级分类失败:', err);
  }
};

// 获取二级分类
const getBeeResourcesSecondFn = async (fist: string) => {
  try {
    const result = await getBeeResourcesSecond({
      category: currentCategory.value,
      lv1: fist,
    });
    if (result.code === 200) {
      console.log('获取二级分类数据:', result.data);
      normativeClassification.value = result.data;
      // 更新筛选条件
      updateFilterGroups();
      // 获取文件夹数据
      fetchFileList();
    }
  } catch (err) {
    console.log('获取二级分类失败:', err);
  }
};

// 更新筛选条件
const updateFilterGroups = () => {
  // 根据当前页面标题动态设置筛选组标题
  const pageTitle = mainTabs.value[activeMainTab.value];
  
  if (pageTitle === '通用规范') {
    filterGroups.value[0].title = '标准分类';
    filterGroups.value[1].title = '规范分类';
  } else if (pageTitle === '通用图库') {
    filterGroups.value[0].title = '专业分类';
    filterGroups.value[1].title = '构件分类';
  } else if (pageTitle === '供应商图库') {
    filterGroups.value[0].title = '材料设备分类';
    filterGroups.value[1].title = '供应商列表';
  } else if (pageTitle === '样例模板') {
    filterGroups.value[0].title = '专业分类';
    filterGroups.value[1].title = '建筑类别';
  }
  
  // 更新一级分类筛选条件
  if (standardClassificationList.value.length > 0) {
    filterGroups.value[0].filters = standardClassificationList.value.map(item => item.name);
    // 自动选择第一个分类
    if (!filterGroups.value[0].activeFilter) {
      filterGroups.value[0].activeFilter = standardClassificationList.value[0].name;
      console.log('自动选择第一个一级分类:', filterGroups.value[0].activeFilter);
    }
  }
  
  // 更新二级分类筛选条件
  if (normativeClassification.value.length > 0) {
    filterGroups.value[1].filters = ['全部', ...normativeClassification.value.map(item => item.name)];
  } else {
    // 即使没有二级分类数据，也要显示"全部"选项
    filterGroups.value[1].filters = ['全部'];
  }
};

// 处理一级分类选择
const handleStandardChange = async (item: any, index: number) => {
  if (item.name !== standardClassificationList.value[activeStandard.value]?.name) {
    try {
      const { data, code } = await getBeeResourcesSecond({ 
        category: currentCategory.value, 
        lv1: item.name 
      });
      if (code === 200) {
        normativeClassification.value = data;
        updateFilterGroups();
      }
    } catch (err) {
      console.log('获取二级分类失败:', err);
    }
    activeStandard.value = index;
    activeNormative.value = 0;
    currentLv1.value = item.name;
    currentPage.value = 1;
    fetchFileList();
  }
};

// 处理二级分类选择
const handleNormativeChange = (index: number) => {
  if (normativeClassification.value[index]?.name !== normativeClassification.value[activeNormative.value]?.name) {
    activeNormative.value = index;
    if (index) {
      const second = normativeClassification.value[activeNormative.value].name;
      const id = normativeClassification.value[activeNormative.value].id;
      // 这里可以添加二级分类的处理逻辑
    } else {
      const fist = standardClassificationList.value[activeStandard.value]?.name;
      const id = standardClassificationList.value[activeStandard.value]?.id;
      currentLv1.value = fist || '';
    }
    currentPage.value = 1;
    fetchFileList();
  }
};

// 返回上一级
const handleBackToParent = () => {
  if (isInIndependentFolder.value) {
    // 如果是在独立文件夹中，返回到原来的状态
    isInIndependentFolder.value = false;
    currentFolderId.value = '';
    // 重新获取原来的数据
    fetchFileList();
  } else {
    // 原来的逻辑：返回到二级分类的"全部"状态
    filterGroups.value[1].activeFilter = '';
    currentLv1.value = '';
    currentPage.value = 1;
    fetchFileList();
  }
};

// 添加到我的资源
const addToMyResource = async (fileId: string) => {
  try {
    const response = await addMyResource(fileId);
    if (response.code === 200) {
      ElMessage.success('已添加到我的资源');
    } else {
      ElMessage.error(response.message || '添加失败');
    }
  } catch (error) {
    console.error('添加失败:', error);
    ElMessage.error('添加失败');
  }
};

// 进入独立文件夹
const enterFolder = async (folderId: string) => {
  loading.value = true;
  
  // 设置独立文件夹状态
  isInIndependentFolder.value = true;
  currentFolderId.value = folderId;
  
  try {
    const params = {
      all: false,
      search: searchQuery.value,
      page: currentPage.value,
      pageSize: pageSize.value
    };

    // 使用文件夹ID获取文件夹内容
    const response = await getSecondLevelListApi({
      id: folderId,
      ...params
    });
    
    if (response && response.code === 200) {
      console.log('获取文件夹内容:', response.data);
      let fileData = [];
      if (response.data?.data && Array.isArray(response.data.data)) {
        fileData = response.data.data;
      } else if (response.data?.list && Array.isArray(response.data.list)) {
        fileData = response.data.list;
      } else if (Array.isArray(response.data)) {
        fileData = response.data;
      }
      
      if (Array.isArray(fileData)) {
        fileList.value = fileData;
        total.value = response.data?.total || fileData.length;
      } else {
        console.error('文件夹数据不是数组:', fileData);
        fileList.value = [];
        total.value = 0;
      }
    } else {
      ElMessage.error(response?.message || '获取文件夹内容失败');
    }
  } catch (error) {
    console.error('获取文件夹内容失败:', error);
    ElMessage.error('获取文件夹内容失败');
  } finally {
    loading.value = false;
  }
};

</script>

<style scoped lang="less">
.knowledge-base-container {
  padding: 20px;
  width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;

  .page-title {
    font-size: 24px;
    color: v-bind(menuTextColor);
    margin-bottom: 20px;
  }
}

.main-panel {
  border: 1px solid v-bind(borderColor);
  border-radius: 8px;
  padding: 20px;
}

.controls-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid v-bind(borderColor);
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.main-tabs {
  display: flex;
  gap: 30px;

  .tab {
    font-size: 16px;
    color: v-bind(subTextColor);
    cursor: pointer;
    position: relative;
    padding-bottom: 10px;

    &.active {
      color: v-bind(menuTextColor);
      font-weight: 500;

      &::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 2px;
        background-color: v-bind(menuTextColor);
      }
    }
  }
}

.search-input {
  width: 300px;

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

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-group {
  display: flex;
  align-items: flex-start;
  min-height: 30px;

  .filter-title {
    font-size: 14px;
    color: v-bind(menuTextColor);
    margin-right: 30px;
    white-space: nowrap;
    font-weight: 700;
    flex-shrink: 0;
    padding-top: 3px;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 20px;
    align-items: flex-start;

    .tag {
      font-size: 14px;
      color: v-bind(subTextColor);
      cursor: pointer;
      padding: 3px 8px;
      border-radius: 4px;
      transition: all 0.2s ease;

      &:hover {
        color: v-bind(menuTextColor);
        background-color: v-bind(tagHoverBgColor);
      }

      &.active {
        color: v-bind(tagActiveColor);
        // background-color: v-bind(tagActiveBgColor);
      }
    }
  }
}

.content-area {
  margin-top: 30px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: v-bind(subTextColor);
}

.empty-container {
  padding: 40px;
}

.file-list {
  display: flex;
  padding: 24px;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  min-height: 200px;
  gap: 24px;
}

.file-item {
  width: 170px;
  height: 230px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 0;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  background-color: transparent;
  overflow: hidden;

  &:hover {
    transform: scale(1.05);
    z-index: 2;
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
  }

  &.is-selected {
    transform: scale(1.05);
    z-index: 1;
    background-color: var(--el-fill-color-light);
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1);
  }

  // 文件夹样式 - 参考桌面页面
  &:has(.file-icon svg), &:has(.file-icon img[alt*="folder"]) {
    width: 170px;
    height: 172px;
    padding: 16px;
    
    &:hover {
      background-color: var(--el-fill-color-light);
      transform: none;
      box-shadow: none;
      
      .file-info {
        display: block !important;
      }
    }
    
    &.is-selected {
      transform: scale(1.1);
      background-color: var(--el-fill-color-light);
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      
      .file-info {
        display: block !important;
      }
    }
    
    .file-icon {
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      padding: 12px;
      background-color: transparent;
      margin-bottom: 12px;
      
      :deep(svg) {
        width: 100%;
        height: 100%;
      }
    }
    
    .file-info {
      position: static;
      color: var(--el-text-color-primary);
      padding: 0;
      text-align: center;
      display: block !important;
      
      .file-name {
        font-size: 14px;
        color: var(--el-text-color-primary);
        margin-bottom: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        max-width: 100%;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-height: 1.4;
      }
    }
    
    .file-actions {
      display: none !important;
    }
  }

  .file-icon {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    padding: 0;
    margin-right: 0;
    margin-bottom: 0;
    background-color: v-bind(menuBgColor);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }

    :deep(svg) {
      width: 100px;
      height: 100px;
    }
  }

  .file-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    color: white;
    padding: 12px 8px;
    min-width: 0;
    text-align: center;
    
    .file-name {
      font-size: 14px;
      color: #FFFFFF;
      margin-bottom: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      max-width: 100%;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      line-height: 1.4;
    }
  }

  .file-actions {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items:  flex-end;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &:hover .file-actions {
    opacity: 1;
    pointer-events: auto;
  }

  &:hover .file-info {
    display: none;
  }
  
  .action-btn {
    width: 64px;
    height: 32px;
    border: none;
    color: #1B2126;
    background-color: #F9DE4A;
    font-size: 12px;
    font-weight: 500;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 20px;

    &:hover {
      opacity: 0.8;
    }
  }
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

// 深色主题
html.dark {
  .file-list {
    .file-item {
      &:hover {
        background-color: #1B2126;
      }

      &.is-selected {
        background-color: #1B2126;
      }

      .file-icon {
        background-color: transparent;
      }
      
      // 文件夹在深色主题下的样式
      &:has(.file-icon svg), &:has(.file-icon img[alt*="folder"]) {
        &:hover {
          background-color: #1B2126;
        }

        &.is-selected {
          background-color: #1B2126;
        }
      }
    }
  }
}

// 浅色主题
html:not(.dark) {
  .file-list {
    .file-item {
      &:hover {
        background-color: #E5F6E6;
      }

      &.is-selected {
        background-color: #E5F6E6;
      }

      .file-icon {
        background-color: transparent;
      }
      
      // 文件夹在浅色主题下的样式
      &:has(.file-icon svg), &:has(.file-icon img[alt*="folder"]) {
        &:hover {
          background-color: #E5F6E6;
        }

        &.is-selected {
          background-color: #E5F6E6;
        }
      }
    }
  }
}
</style> 