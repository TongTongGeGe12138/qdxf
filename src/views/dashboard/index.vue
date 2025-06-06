<template>
    <div class="dashboard-container">
        <div class="title">👋 欢迎使用 BeesFQD</div>
        <div class="container">
            <div class="container-left">
                <div class="left-title">
                    <div class="main-title">智能测绘</div>
                    <div class="sub-title">用智能设计重新定义消防工程，五分钟解决消防点线布置</div>
                </div>
                <div class="search-section">
                    <el-input v-model="searchText" placeholder="搜索应用..." class="search-input">
                        <template #prefix>
                            <el-icon>
                                <Search />
                            </el-icon>
                        </template>
                    </el-input>
                    <div class="tags">
                        <el-tag 
                            v-for="tag in tags" 
                            :key="tag.name"
                            :class="{ 'is-active': activeTag === tag.name }"
                            @click="activeTag = tag.name"
                        >
                            {{ tag.name }}
                        </el-tag>
                    </div>
                </div>
                <div class="card-grid">
                    <div class="card" 
                        v-for="(item, index) in secondaryList" 
                        :key="index"
                            @click="handleCardClick(item)"
                    >
                        <div class="card-icon">
                            <el-icon>
                                <Monitor />
                            </el-icon>
                        </div>
                        <div class="card-content">
                            <div class="card-title">{{ item.name }}</div>
                            <div class="card-desc">{{ item.description }}</div>
                        </div>
                    </div>
                </div>
                <div class="left-title" style="margin-top: 40px;margin-bottom: 0;">
                    <div class="main-title">更多应用</div>
                    <div class="sub-title">专注服务于建筑设计的云端应用</div>
                </div>
                <div class="card-grid">
                    <div class="card" v-for="(item, index) in hvacCardList" :key="index">
                        <div class="card-icon">
                            <el-icon>
                                <Monitor />
                            </el-icon>
                        </div>
                        <div class="card-content">
                            <div class="card-title">{{ item.title }}</div>
                            <div class="card-desc">{{ item.description }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container-right">
                <div class="right-title">
                    <div class="main-title">供应链精选</div>
                    <div class="sub-title">平台精选供应商，品质保证</div>
                </div>
                <div class="equipment-list">
                    <div class="list-header">
                        <el-icon><Setting /></el-icon>
                        <span>消防设备选型</span>
                        <el-icon class="expand-icon"><More /></el-icon>
                    </div>
                    <div class="list-items">
                        <div class="list-item" v-for="item in equipmentList" :key="item">
                            {{ item }}
                        </div>
                        <div class="list-item more">更多选型 <el-icon><ArrowRight /></el-icon></div>
                    </div>
                </div>
                <div class="supplier-list">
                    <div class="list-header">
                        <el-icon><Shop /></el-icon>
                        <span>消防认证供应商</span>
                        <el-icon class="expand-icon"><More /></el-icon>
                    </div>
                    <div class="supplier-grid">
                        <div class="supplier-item" 
                            v-for="supplier in supplierList" 
                            :key="supplier.name"
                            @click="handleSupplierClick(supplier.url)"
                        >
                            <img :src="supplier.imageUrl" :alt="supplier.name">
                            <span>{{ supplier.name }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <!-- 标准说明弹框 -->
    <el-dialog
        v-model="dialogVisible"
        title="撬点智能绘制平台上传图纸标准"
        width="800px"
        :close-on-click-modal="false"
        class="standard-dialog"
    >
        <div class="operate-box">
            <div class="text-box">
                <div class="standard-item">
                    <span>1. 应确保图纸文件在本地能够使用AutoCAD正常打开。</span>
                </div>
                <div class="standard-item">
                    <span>2. 天正绘制的图纸在上传平台前，应先导出为T3版本，非T3版本图纸上传后，部分图线无法解析显示。</span>
                    <img src="@/assets/operate/one.png" alt="示例1" />
                </div>
                <div class="standard-item">
                    <span>3. 上传的图纸中，构件应按图层绘制，不同的构件类型不可混用图层，如使用柱图层进行门窗构件的绘制、在0图层下绘制门窗等。</span>
                    <img src="@/assets/operate/two.png" alt="示例2" />
                </div>
                <div class="standard-item">
                    <span>4. 应该闭合的图线应保证闭合，如墙与门窗之间应能闭合，不可留有间隙。</span>
                    <img src="@/assets/operate/three.png" alt="示例3" />
                </div>
                <div class="standard-item">
                    <span>5. 图纸中，围合构件的图线（如墙线、幕墙线、门窗线等）不可存在断线。</span>
                    <img src="@/assets/operate/four.png" alt="示例4" />
                </div>
                <div class="standard-item">
                    <span>6. 存在多轴网时，应避免同一房间中存在多个方向的轴网，否则在进行组件自动生成时可能采用错误的方向进行布置。</span>
                    <img src="@/assets/operate/five.png" alt="示例5" />
                </div>
                <div class="standard-item">
                    <span>7. 图纸中部分线段是在三位坐标视图下绘制，会出现二维多段线等与3D相关线段，导致区域识别时，程序在未加载3D引擎的前提下无法正确定位。</span>
                    <img src="@/assets/operate/six.png" alt="示例6" />
                </div>
                <div class="standard-item">
                    <span>8. 图纸中图线应尽量避免重叠，过多的重线会导致解析与区域分析等待时间变长。</span>
                    <img src="@/assets/operate/seven.png" alt="示例7" />
                </div>
                <div class="standard-item">
                    <span>9. 图纸中房间注释文字应正确，否则区域分析时，会判断出错，从而导致组件智能生成时采用错误的方案。</span>
                </div>
                <div class="standard-item">
                    <span>10. 在进行图层指定时，带"*"的图层为必选项，指定遗漏后无法进行区域的智能分析。</span>
                    <img src="@/assets/operate/eight.png" alt="示例8" />
                </div>
                <div class="standard-item">
                    <span>11. 图纸中若是存在隐藏的图元、图线，请确保隐藏的图元、图线不在需要指定的图层列表中，否则程序将一同将该部分图层信息提取，导致区域分析出错或分析时间变长。</span>
                </div>
                <div class="standard-item">
                    <span>12. 存在环形轴网的图纸暂不支持组件的智能生成。</span>
                    <img src="@/assets/operate/nine.png" alt="示例9" />
                </div>
            </div>
        </div>
        <div class="dialog-footer">
            <el-checkbox v-model="neverShowAgain" label="我已知晓，下次不再提示" size="large" />
            <el-button type="primary" @click="handleConfirm">确定</el-button>
        </div>
    </el-dialog>

    <!-- 添加卡片详情弹框 -->
    <el-dialog
        v-model="cardDialogVisible"
        width="700px"
        :close-on-click-modal="false"
        class="standard-dialog app-dialog"
    >
        <div class="app-dialog-content">
            <div class="app-header">
                <div class="app-icon">
                    <el-icon :size="32">
                        <Monitor />
                    </el-icon>
                </div>
                <div class="app-title">
                    <div class="name">{{ currentCard?.name }}</div>
                    <div class="desc">{{ currentCard?.description }}</div>
                </div>
                <el-button type="primary" class="launch-btn" @click="handleLaunchClick">启动应用</el-button>
            </div>
            <div class="app-desc">
                {{ currentCard?.name }}，无需本地部署，通过云端在线服务，实现智能给排水调试、喷头一键生成、管线自动布置。基于消防规范与智能算法，快速生成合规设计方案，支持多场景应用，助力企业高效完成消防系统设计与运维，降低成本与安全风险。
            </div>
            <div class="app-preview">
                <h3>应用介绍</h3>
                <div class="preview-container">
                    <img src="@/assets/operate/one.png" alt="应用截图" class="preview-image" />
                </div>
            </div>
        </div>
        <div class="version-info">
            版本：{{ currentCard?.extra?.version }}
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { Search, Monitor, Setting, Shop, More, ArrowRight } from '@element-plus/icons-vue'
import { computed, ref, onMounted } from 'vue'
import { isDark } from '../../utils/theme'
import { getAigcPrimaryList, getAigcChildrenList } from '@/api/aigc'
import type { ProjectItem } from '@/api/model/detailModel'
import { ElMessage } from 'element-plus'






// 类型定义
interface ProjectItemExtended extends ProjectItem {
    contentShow?: boolean;
    extra?: {
        version?: string;
        url?: string;
        tip?: string;
        englishName?: string;
        group?: string;
    };
}



interface AigcModuleComponent {
  title: string;
  description: string;
  content?: string;
  name?: string;
}



interface Supplier {
  name: string;
  imageUrl: string;
  url: string;
}

const searchText = ref('')
const activeTag = ref('所有')
const allList = ref<ProjectItemExtended[]>([])
const applicationList = ref<ProjectItemExtended[]>([])
const fireList = ref<AigcModuleComponent[]>([])
const aigcList = ref<ProjectItemExtended[]>([])
const current = ref('')
const secondary = ref('')
const secondaryList = ref<ProjectItemExtended[]>([])
const threeStatus = ref(false)

// 常量配置
const AIGC_MODULES = {
    WATER: '智能给排水',
    HVAC: '智能暖通',
    ELECTRIC: '智能电气',
    FIRE: '智能消防'
} as const;

// 定义 AIGC 模块列表
const aigcModuleSkuList = [
  {
    name: '智能消防',
    content: 'AigcCmpPkgFirefighting',
    components: [] as AigcModuleComponent[]
  },
  {
    name: '装饰消防',
    content: 'AigcCmpPkgDecoration',
    components: [] as AigcModuleComponent[]
  },
  {
    name: '智能给排水',
    content: 'AigcCmpPkgPlumbing',
    components: [
      { title: '给排水1', content: 'plumbing1', status: 1, description: '智能给排水・喷头一键生成，管线自动布置' } as AigcModuleComponent,
      { title: '给排水2', content: 'plumbing2', status: 1, description: '智能给排水・消火栓布置，管线智能连接' } as AigcModuleComponent
    ]
  },
  {
    name: '智能暖通',
    content: 'AigcCmpPkgHvac',
    components: [
      { title: '暖通1', content: 'hvac1', status: 1, description: '智能暖通・排烟设计，风管智能布置' } as AigcModuleComponent,
      { title: '暖通2', content: 'hvac2', status: 1, description: '智能暖通・防烟分区，系统自动设计' } as AigcModuleComponent
    ]
  },
  {
    name: '智能电气',
    content: 'AigcCmpPkgElectrical',
    components: [
      { title: '电气1', content: 'electrical1', status: 1, description: '智能电气・探测器布置，线路智能连接' } as AigcModuleComponent,
      { title: '电气2', content: 'electrical2', status: 1, description: '智能电气・应急照明，疏散指示设计' } as AigcModuleComponent
    ]
  }
];

// 获取数据的方法
const fetchData = async () => {
    try {
        // 获取主分类数据
        const primaryRes = await getAigcPrimaryList();
        console.log('主分类响应数据:', primaryRes);
        
        if (primaryRes?.code !== 200 || !Array.isArray(primaryRes?.data)) {
            throw new Error('获取主分类数据失败');
        }

        const list = primaryRes.data;
        console.log('主分类列表:', list);
        
        // 合并所有消防相关组件
        const componentsList = [
            ...aigcModuleSkuList[2].components,
            ...aigcModuleSkuList[3].components,
            ...aigcModuleSkuList[4].components
        ];
        console.log('合并后的组件列表:', componentsList);

        // 处理数据
        if (Array.isArray(aigcList.value)) {
            handleAigcListData(list, componentsList);
        }

        allList.value = list;
        console.log('更新后的 allList:', allList.value);
        
        // 处理智能消防应用
        await handleFireApplication(list, componentsList);

    } catch (error) {
        console.error('获取数据失败:', error);
        ElMessage.error(error instanceof Error ? error.message : '获取数据失败');
    }
};

// 处理 AIGC 列表数据
const handleAigcListData = (list: ProjectItem[], componentsList: AigcModuleComponent[]) => {
    console.log('当前 aigcList:', aigcList.value);
    
    for (const element of aigcList.value) {
        for (const key of list) {
            if (element.name !== key.name) continue;

            key.content = element.content;
            console.log(`匹配到项目 ${key.name}, 设置 content:`, element.content);

            updateFireList(key.name);
            
            if (fireList.value.length === componentsList.length && key.name === AIGC_MODULES.FIRE) {
                key.content = 'AigcCmpPkgFirefighting';
                console.log('设置智能消防 content:', key);
            }
        }
    }
};

// 更新消防列表
const updateFireList = (moduleName: string) => {
    switch (moduleName) {
        case AIGC_MODULES.WATER:
            fireList.value = [...aigcModuleSkuList[2].components, ...fireList.value];
            console.log('更新给排水 fireList:', fireList.value);
            break;
        case AIGC_MODULES.HVAC:
            fireList.value = [...aigcModuleSkuList[3].components, ...fireList.value];
            console.log('更新暖通 fireList:', fireList.value);
            break;
        case AIGC_MODULES.ELECTRIC:
            fireList.value = [...aigcModuleSkuList[4].components, ...fireList.value];
            console.log('更新电气 fireList:', fireList.value);
            break;
    }
};

// 处理智能消防应用
const handleFireApplication = async (list: ProjectItem[], componentsList: AigcModuleComponent[]) => {
  const fireApps = list.filter((item: ProjectItem) => item.name === '智能消防');
  applicationList.value = fireApps;
  console.log('智能消防应用列表:', fireApps);
  
  const fireApp = fireApps[0];
  if (!fireApp?.value) return;
  
  const childrenRes = await getAigcChildrenList(fireApp.value);
  if (childrenRes.code === 200) {
    current.value = fireApp.value;
    const childrenData = Array.isArray(childrenRes.data) ? childrenRes.data : [];
    if (childrenData.length > 0) {
      secondary.value = childrenData[0].value;
      const processedData = getAigcCadStatus(childrenData);
      secondaryList.value = processedData;
      threeStatus.value = true;
    }
  }
};

// 弹框相关
const dialogVisible = ref(false)
const neverShowAgain = ref(false)

// 处理确认按钮点击
const handleConfirm = () => {
    if (neverShowAgain.value) {
        localStorage.setItem('hideStandardDialog', 'true')
    }
    dialogVisible.value = false
}

// 在页面加载时检查是否需要显示弹框
onMounted(() => {
    // 检查并应用保存的主题
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
        isDark.value = savedTheme === 'dark'
    }
    
    // 检查是否显示弹框
    const hideDialog = localStorage.getItem('hideStandardDialog')
    if (!hideDialog) {
        dialogVisible.value = true
    }
    
    fetchData()
})

const tags = [
    { name: '所有' },
    { name: '智能给排水' },
    { name: '智能电气' },
    { name: '智能暖通' }
]

// 计算样式
const menuTextColor = computed(() => isDark.value ? '#e5eaf3' : '#303133')
const subTextColor = computed(() => isDark.value ? '#a3a6ad' : '#909399')
const borderColor = computed(() => isDark.value ? 'rgba(65, 66, 67, 0.5)' : 'rgba(228, 231, 237, 0.6)')
const menuBgColor = computed(() => isDark.value ? '#1d1e1f' : '#ffffff')
const menuHoverBgColor = computed(() => isDark.value ? '#2b2b2b' : '#f5f7fa')
const dialogBgColor = computed(() => isDark.value ? '#141414' : '#ffffff')
const dialogHeaderBgColor = computed(() => isDark.value ? '#1d1e1f' : '#f5f7fa')

const hvacCardList = [
    {
        title: 'CloudBeeCAD',
        description: '基于云架构，完全自主产权的新一代 CAD'
    },
    {
        title: '智能物联',
        description: '基于云架构，完全自主产权的新一代 CAD'
    },
    {
        title: '智能建筑',
        description: '基于云架构，完全自主产权的新一代 CAD'
    },

]

const equipmentList = [
    '火灾自动报警系统',
    '烟感火灾探测系统',
    '防火门监控系统',
    '消防水喷淋系统',
    '可燃有害气体探测'
]

const supplierList = ref<Array<Supplier>>([
    {
        name: '博特睿',
        imageUrl: '/aigcIcon/1.png',
        url: 'http://www.pescotech.cn/',
    },
    {
        name: '鼎信通讯消防',
        imageUrl: '/aigcIcon/2.png',
        url: 'http://firetopscomm.com/',
    },
    {
        name: '青鸟消防',
        imageUrl: '/aigcIcon/3.png',
        url: 'https://www.jbufa.com/',
    },
    {
        name: '台谊消防',
        imageUrl: '/aigcIcon/4.png',
        url: 'https://taiyifire.com/',
    },
    {
        name: '深圳嘉泰',
        imageUrl: '/aigcIcon/5.png',
        url: 'http://www.gtwaytec.com/',
    },
    {
        name: '赛特威尔',
        imageUrl: '/aigcIcon/6.png',
        url: 'https://www.china-siter.cn/',
    },
    {
        name: '左向科技',
        imageUrl: '/aigcIcon/7.png',
        url: 'http://www.zgzxzm.com/',
    },
    {
        name: '海湾公司',
        imageUrl: '/aigcIcon/8.png',
        url: 'https://www.gst.com.cn/',
    },
]);

// 处理供应商链接点击
const handleSupplierClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
};

// 添加新的响应式变量
const cardDialogVisible = ref(false)
const currentCard = ref<any>(null)

// 添加卡片点击事件处理函数
const handleCardClick = (item: ProjectItemExtended) => {
    currentCard.value = item;
    console.log('当前卡片数据:', {
        名称: item.name,
        值: item.value,
        描述: item.description,
        额外信息: {
            版本: item.extra?.version,
            链接: item.extra?.url,
            提示: item.extra?.tip,
            英文名: item.extra?.englishName,
            分组: item.extra?.group
        },
        显示状态: item.contentShow
    });
    cardDialogVisible.value = true;
};



// 添加计算属性
const iconBgColor = computed(() => isDark.value ? '#141414' : '#f5f7fa')
const iconColor = computed(() => isDark.value ? '#fff' : '#303133')
// const btnBorderColor = computed(() => 'rgba(231, 231, 224, 0.2980392156862745)')
const closeHoverColor = computed(() => isDark.value ? '#f3cc2e' : '#409eff')

// 获取并处理子分类数据
const getAigcChildren = async (val: any) => {
  try {
    console.log('开始获取子分类数据，参数:', val);
    const { data, code } = await getAigcChildrenList(val.value);
    console.log('子分类接口返回的原始数据:', data);
    
    if (code === 200) {
      current.value = val.value;
      if (Array.isArray(data) && data.length > 0) {
        // 先过滤有 version 的数据
        const uniqueData = unique(data);
        console.log('unique 过滤后的数据:', uniqueData);
        
        secondary.value = uniqueData[0]?.value || '';
        
        // 处理数据状态
        const processedData = getAigcCadStatus(uniqueData);
        console.log('CAD状态处理后的数据:', processedData);
        
        secondaryList.value = processedData;
        threeStatus.value = true;
      } else {
        console.warn('接口返回的数据为空或不是数组');
      }
    } else {
      console.warn('接口返回非200状态码:', code);
    }
  } catch (error) {
    console.error('获取子分类数据失败:', error);
    ElMessage.error(error instanceof Error ? error.message : '获取子分类数据失败');
  }
};

// 处理 CAD 状态
const getAigcCadStatus = (data: ProjectItem[]) => {
  console.log('进入 getAigcCadStatus 函数，原始数据:', data);
  
  const val = allList.value.filter((key: any) => key.value === current.value)[0];
  console.log('找到的当前项:', val);
  
  if (!val) {
    console.warn('未找到匹配的当前项，返回原始数据');
    return data;
  }
  
  // 首先过滤掉没有 version 的项目
  const filteredData = data.filter(item => item.extra && item.extra.version);
  console.log('过滤后的数据:', filteredData);
  
  const result = filteredData.map((item: ProjectItem) => {
    const newItem = { ...item };
    if (val.name === '智能消防' || val.name === '装饰消防') {
      newItem.contentShow = fireList.value.some(fireItem => fireItem.title === item.name);
    } else {
      newItem.contentShow = !!val.content;
    }
    return newItem;
  });
  
  console.log('最终处理后的数据:', result);
  return result;
};

// 获取主分类数据
const getAigcPrimary = async () => {
  try {
    console.log('开始获取主分类数据');
    const result = await getAigcPrimaryList();
    console.log('主分类接口返回数据:', result);
    
    if (result.code === 200 && Array.isArray(result.data)) {
      console.log('主分类数据是数组，长度:', result.data.length);
      
      const componentsToAdd: AigcModuleComponent[] = [];
      
      // 处理数据并收集组件
      aigcList.value.forEach(element => {
        console.log('处理 aigcList 元素:', element);
        result.data.forEach(key => {
          if (element.name === key.name) {
            key.content = element.content;
            // 根据不同类型收集组件
            switch(key.name) {
              case '智能给排水':
                componentsToAdd.push(...aigcModuleSkuList[2].components);
                console.log('添加给排水组件');
                break;
              case '智能暖通':
                componentsToAdd.push(...aigcModuleSkuList[3].components);
                console.log('添加暖通组件');
                break;
              case '智能电气':
                componentsToAdd.push(...aigcModuleSkuList[4].components);
                console.log('添加电气组件');
                break;
            }
          }
        });
      });
      
      // 使用 Set 去重
      const uniqueComponents = [...new Set(componentsToAdd.map(comp => JSON.stringify(comp)))].map(str => JSON.parse(str) as AigcModuleComponent);
      console.log('去重后的组件列表:', uniqueComponents);
      
      fireList.value = uniqueComponents;
      allList.value = result.data;
      
      // 处理智能消防应用
      await handleFireApplication(result.data, uniqueComponents);
    } else {
      console.warn('主分类数据异常:', { code: result.code, isArray: Array.isArray(result.data) });
    }
  } catch (error) {
    console.error('获取主分类数据失败:', error);
    ElMessage.error(error instanceof Error ? error.message : '获取主分类数据失败');
  }
};

function unique(arr: any) {
  console.log('进入 unique 函数，原始数据:', arr);
  const list = [];
  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];
    console.log('检查数据项:', {
      name: element.name,
      hasExtra: !!element.extra,
      hasVersion: element.extra?.version,
      version: element.extra?.version
    });
    if (element.extra?.version) {
      list.push(element);
    }
  }
  console.log('unique 函数处理后的数据:', list);
  return list;
}

// 添加启动应用点击处理函数
const handleLaunchClick = () => {
    console.log('启动应用数据:', {
        名称: currentCard.value?.name,
        值: currentCard.value?.value,
        描述: currentCard.value?.description,
        额外信息: {
            版本: currentCard.value?.extra?.version,
            链接: currentCard.value?.extra?.url,
            提示: currentCard.value?.extra?.tip,
            英文名: currentCard.value?.extra?.englishName,
            分组: currentCard.value?.extra?.group
        },
        显示状态: currentCard.value?.contentShow
    });
    if (currentCard.value?.extra?.url) {
        const baseUrl = 'http://cloud.dev.ifeng.com';
        const fullUrl = `${baseUrl}${currentCard.value.extra.url}`;
        window.open(fullUrl, '_blank', 'noopener,noreferrer');
    } else {
        ElMessage.info('未配置跳转链接');
    }
    cardDialogVisible.value = false;
};
</script>

<style scoped>
.dashboard-container {
    padding: 20px;
    width: 100%;
    min-width: 895px;
    margin: 0 auto;
    border: 1px solid v-bind(borderColor);
    box-sizing: border-box;
}

.title {
    font-size: 24px;
    /* font-weight: bold; */
    margin-bottom: 20px;
    color: v-bind(menuTextColor);
    transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.container {
    display: flex;
    gap: 20px;
    width: 100%;
}

.container-left,
.container-right {
    display: flex;
    flex-direction: column;
}

.left-title,
.right-title {
    margin-bottom: 30px;
    height: 80px;
    /* 固定高度确保对齐 */
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.container-left {
    flex: 1;
    min-width: 595px;
    border: 1px solid v-bind(borderColor);
    padding: 10px;
    box-sizing: border-box;
}

.container-right {
    width: 260px;
    flex-shrink: 0;
    border: 1px solid v-bind(borderColor);
    padding: 10px;
    box-sizing: border-box;
}

.container-left .main-title {
    font-size: 28px;
    font-weight: 700;
    color: v-bind(menuTextColor);
    margin-bottom: 16px;
    transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.container-left .sub-title {
    font-size: 12px;
    color: v-bind(subTextColor);
    line-height: 1.5;
    transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.container-right .main-title {
    font-size: 20px;
    font-weight: 700;
    color: v-bind(menuTextColor);
    margin-bottom: 12px;
    transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.container-right .sub-title {
    font-size: 12px;
    color: v-bind(subTextColor);
    line-height: 1.5;
    transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@media screen and (max-width: 1440px) {
    .dashboard-container {
        margin: 0 20px;
    }
}

@media screen and (max-width: 1135px) {
    .dashboard-container {
        margin: 0;
        overflow-x: auto;
    }
}

.search-section {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    width: 100%;
}

.search-input {
    flex: 1;
    min-width: 0;
    /* 防止flex项目溢出 */
}

.search-input :deep(.el-input__wrapper) {
    background-color: v-bind(menuBgColor);
    box-shadow: none;
    border: 1px solid v-bind(borderColor);
    border-radius: 8px;
    padding: 8px 12px;
}

.search-input :deep(.el-input__inner) {
    color: v-bind(menuTextColor);
    height: 24px;
    font-size: 14px;
}

.search-input :deep(.el-input__prefix) {
    color: v-bind(subTextColor);
}

.tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    width: 400px;
    flex-shrink: 0;
    border: 1px solid v-bind(borderColor);
    border-radius: 8px;
    padding: 8px;
    background-color: v-bind(menuBgColor);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tags :deep(.el-tag) {
    background-color: transparent;
    border: none;
    color: v-bind(subTextColor);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 0 16px;
    height: 32px;
    display: flex;
    align-items: center;
    border-radius: 16px;
    margin: 0;
}

.tags :deep(.el-tag:hover) {
    background-color: v-bind(menuHoverBgColor);
    color: #409EFF;
}

.tags :deep(.el-tag.is-active) {
    background-color: #409EFF15;
    color: #409EFF;
}

.card-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 20px;
}

@media screen and (max-width: 1440px) {
    .card-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

.card {
    background-color: v-bind(menuBgColor);
    border-radius: 8px;
    padding: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    height: 66px;
    box-sizing: border-box;
}

.card:hover {
    transform: translateY(-2px);
    background-color: v-bind(menuHoverBgColor);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card:hover .card-icon {
    background-color: #409EFF;
    color: #FFFFFF;
}

.card-icon {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background-color: #409EFF15;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #409EFF;
    font-size: 18px;
    flex-shrink: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-content {
    flex: 1;
    overflow: hidden;
}

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

.equipment-list, .supplier-list {
    background-color: v-bind(menuBgColor);
    border-radius: 8px;
    margin-bottom: 20px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-header {
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: v-bind(menuTextColor);
    font-size: 14px;
    font-weight: 500;
    border-bottom: 1px solid v-bind(borderColor);
}

.list-header .expand-icon {
    margin-left: auto;
    font-size: 16px;
    color: v-bind(subTextColor);
    cursor: pointer;
    transition: all 0.3s;
}

.list-header .expand-icon:hover {
    color: #409EFF;
}

.list-items {
    padding: 12px;
}

.list-item {
    padding: 8px 12px;
    color: v-bind(subTextColor);
    font-size: 13px;
    cursor: pointer;
    transition: color 0.3s;
    display: flex;
    align-items: center;
}

.list-item:hover {
    color: rgb(249, 211, 74);
}

.list-item.more {
    color: #858694;
    justify-content: space-between;
    font-size: 12px;
}

.list-item.more:hover {
    color: rgb(249, 211, 74);
}

.list-item.more .el-icon {
    font-size: 12px;
}

.supplier-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 12px;
}

.supplier-item {
    background-color: v-bind(menuBgColor);
    border-radius: 6px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.3s;
}

.supplier-item:hover {
    background-color: v-bind(menuHoverBgColor);
    transform: translateY(-2px);
}

.supplier-item img {
    width: 100%;
    height: 32px;
    object-fit: contain;
}

.supplier-item span {
    font-size: 12px;
    color: v-bind(subTextColor);
}

.standard-dialog :deep(.el-dialog) {
    display: flex;
    flex-direction: column;
    max-height: 90vh;
    margin: 15vh auto 0 !important;
    background-color: v-bind(dialogBgColor);
    border: 1px solid v-bind(borderColor);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.standard-dialog :deep(.el-dialog__header) {
    margin: 0;
    padding: 20px;
    border-bottom: 1px solid v-bind(borderColor);
    background-color: v-bind(dialogHeaderBgColor);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.standard-dialog :deep(.el-dialog__title) {
    color: v-bind(menuTextColor);
    font-weight: 600;
}

.standard-dialog :deep(.el-dialog__headerbtn:hover .el-dialog__close) {
    color: #409EFF;
}

.standard-dialog :deep(.el-dialog__body) {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    margin: 0;
    background-color: v-bind(dialogBgColor);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.standard-dialog :deep(.el-dialog__footer) {
    margin: 0;
    padding: 20px;
    border-top: 1px solid v-bind(borderColor);
    background-color: v-bind(dialogHeaderBgColor);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.standard-dialog :deep(.el-scrollbar__thumb) {
    background-color: v-bind(subTextColor);
    opacity: 0.3;
}

.standard-dialog :deep(.el-scrollbar__thumb:hover) {
    opacity: 0.5;
}

.operate-box {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.operate-box .title {
    width: 100%;
    color: v-bind(menuTextColor);
    font-size: 24px;
    text-align: center;
    font-weight: 600;
    margin-bottom: 24px;
}

.operate-box .text-box {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    font-size: 14px;
    color: v-bind(menuTextColor);
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
    text-align: justify;
}

.operate-box .text-box img {
    width: 100%;
    max-width: 400px;
    margin: 12px auto;
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid v-bind(borderColor);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.standard-item {
    margin-bottom: 16px;
}

.standard-item span {
    line-height: 1.6;
    display: block;
    margin-bottom: 8px;
}

.dialog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.dialog-footer .el-checkbox {
    color: v-bind(subTextColor);
}

.dialog-footer .el-button {
    min-width: 100px;
    background-color: v-bind(menuBgColor);
    border-color: v-bind(borderColor);
    color: v-bind(menuTextColor);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dialog-footer .el-button:hover {
    background-color: v-bind(menuHoverBgColor);
    border-color: #409EFF;
    color: #409EFF;
}

.dialog-footer .el-button--primary {
    background-color: #409EFF;
    border-color: #409EFF;
    color: #ffffff;
}

.dialog-footer .el-button--primary:hover {
    background-color: #66b1ff;
    border-color: #66b1ff;
    color: #ffffff;
}

/* 修改卡片弹框样式 */
.app-dialog {
    :deep(.el-dialog__header) {
        display: none;
    }
    
    :deep(.el-dialog__body) {
        padding: 0;
        margin: 0;
        background-color: v-bind(dialogBgColor);
    }

    :deep(.el-dialog) {
        background-color: v-bind(dialogBgColor);
        border: 1px solid v-bind(borderColor);
    }
}

.app-dialog-content {
    position: relative;
    padding: 24px;
    color: v-bind(menuTextColor);
}

.app-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid v-bind(borderColor);
}

.app-icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background-color: v-bind(iconBgColor);
    display: flex;
    align-items: center;
    justify-content: center;
    color: v-bind(iconColor);
    flex-shrink: 0;
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
    background-color: rgba(249, 222, 74, 1);
    box-sizing: border-box;
    border: none;
    border-radius: 5px;
    filter: drop-shadow(none);
    transition: none;
    font-family: "PingFangHK-Semibold", "PingFang HK Semibold", "PingFang HK", sans-serif;
    font-weight: 650;
    font-style: normal;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.launch-btn:hover {
    background-color: rgba(249, 222, 74, 0.8);
    color: #000;
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

.preview-container {
    width: 100%;
    border-radius: 4px;
    overflow: hidden;
}

.preview-image {
    width: 100%;
    display: block;
}

.version-info {
    position: relative;
    left: 0;
    width: 100%;
    height: 40px;
    margin-top: 20px;
    padding: 0 24px;
    font-size: 12px;
    color: v-bind(subTextColor);
    border-top: 1px solid v-bind(borderColor);
    display: flex;
    align-items: center;
}

/* 关闭按钮样式 */
:deep(.el-dialog__headerbtn) {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 10;
}

:deep(.el-dialog__close) {
    color: v-bind(menuTextColor);
    font-size: 18px;
}

:deep(.el-dialog__close:hover) {
    color: v-bind(closeHoverColor);
}
</style>