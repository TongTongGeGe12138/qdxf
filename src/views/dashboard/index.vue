<template>
    <div class="dashboard-container">
        <div class="title">{{ t('message.welcome') }}</div>
        <div class="container">
            <div class="container-left">
                <div class="left-title-g">
                    <div style="display: flex;">
                        <div class="main-title" style="font-size: 28px;display: flex;">{{ t('message.smartDrawing2') }}
                        </div>
                        <div
                            style="background: url('../../assets/beta_icon.png');width: 45px;height: 20px;box-sizing: border-box;background-size: 100% 100%;margin-left: 10px;margin-top: 10px;">
                        </div>
                    </div>

                    <div class="sub-title">{{ t('message.newAlgorithm') }} <span
                            style="color: #ffbd33;padding-left: 10px;text-decoration: underline; cursor: pointer;" @click="handlegoClick('more')">{{ t('message.releaseNotes') }}</span></div>
                    <div class="search-section">
                        <div class="search-input">
                            <el-input v-model="searchText2" :placeholder="t('message.searchApps')" :prefix-icon="Search"
                                class="search-input" />
                        </div>
                        <div class="tags">
                            <el-tag v-for="tag in tags2" :key="tag.name" :class="{ 'is-active': activeTag2 === tag.name }"
                                @click="handleTagClick2(tag.name)">
                                {{ tag.name }}
                            </el-tag>
                        </div>
                    </div>
                    <div class="card-grid">
                        <div class="card" v-for="(item, index) in filteredHvacList" :key="index"
                            @click="handleCardClick(item)">
                            <div class="fire-icon-container" :class="isDark ? 'dark-mode' : 'light-mode'">
                                <img v-if="item.value" :src="getIconUrl(item.value)" :alt="item.title"
                                    class="fire-icon" />
                            </div>
                            <div class="card-content">
                                <div class="card-title">{{ item.title }}</div>
                                <div class="card-desc">{{ item.extra?.englishName }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="left-title">
                    <div class="main-title">{{ t('message.smartDrawing') }}</div>
                    <div class="sub-title">{{ t('message.smartDrawingDesc') }}</div>
                </div>
                <div class="search-section">
                    <div class="search-input">
                        <el-input v-model="searchText" :placeholder="t('message.searchApps')" :prefix-icon="Search"
                            class="search-input" />
                    </div>
                    <div class="tags">
                        <el-tag v-for="tag in tags" :key="tag.name" :class="{ 'is-active': activeTag === tag.name }"
                            @click="handleTagClick(tag.name)">
                            {{ tag.name }}
                        </el-tag>
                    </div>
                </div>
                <div class="card-grid">
                    <div class="card" v-for="(item, index) in filteredSecondaryList" :key="index"
                        @click="handleCardClick(item)">
                        <div class="fire-icon-container" :class="isDark ? 'dark-mode' : 'light-mode'">
                            <img v-if="item.value" :src="getIconUrl(item.value)" :alt="item.name" class="fire-icon"
                                @error="console.log('Failed to load image:', item.value)" />
                        </div>
                        <div class="card-content">
                            <div class="card-title">{{ item.name }}</div>
                            <div class="card-desc">{{ item.extra?.englishName }}</div>
                        </div>
                        <div class="circle-icon">
                            <el-icon>
                                <Right />
                            </el-icon>
                        </div>
                    </div>
                </div>
                <div class="left-title" style="margin-top: 40px;margin-bottom: 0;">
                    <div class="main-title">{{ t('message.moreApps') }}</div>
                    <div class="sub-title">专注服务于建筑设计的云端应用</div>
                </div>
                <div class="card-grid">
                    <div class="card" v-for="(item, index) in hvacCardList" :key="index"
                        @click="handleMoreAppCardClick(item)">
                        <div class="fire-icon-container" :class="isDark ? 'dark-mode' : 'light-mode'">
                            <img v-if="item.icon" :src="getIconUrl(item.icon)" :alt="item.title" class="fire-icon" />
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
                    <div class="main-title">{{ t('message.supplyChain') }}</div>
                    <div class="sub-title">{{ t('message.platformSelected') }}</div>
                </div>
                <div class="equipment-list">
                    <div class="list-header">
                        <img :src="getIconUrl('Setting')" :alt="t('message.equipmentSelection')" class="header-icon"
                            :class="{ 'dark-icon': isDark, 'light-icon': !isDark }" />
                        <span>{{ t('message.equipmentSelection') }}</span>
                        <el-icon class="expand-icon" @click="handleEquipmentClick('more')">
                            <MoreFilled />
                        </el-icon>
                    </div>
                    <div class="list-items">
                        <div class="list-item" v-for="item in equipmentList" :key="item"
                            @click="handleEquipmentClick(item)">
                            <div class="dot"></div>{{ item }}
                        </div>
                        <div class="list-item more" @click="handleEquipmentClick('more')">{{ t('message.moreModels') }} <el-icon
                                class="double-arrow">
                                <DArrowRight />
                            </el-icon></div>
                    </div>
                </div>
                <div class="supplier-list">
                    <div class="list-header">
                        <img :src="getIconUrl('Shop')" :alt="t('message.certifiedSuppliers')" class="header-icon"
                            :class="{ 'dark-icon': isDark, 'light-icon': !isDark }" />
                        <span>{{ t('message.certifiedSuppliers') }}</span>
                        <el-icon class="expand-icon" @click="handleEquipmentClick('more')">
                            <MoreFilled />
                        </el-icon>
                    </div>
                    <div class="supplier-grid">
                        <div class="supplier-item" v-for="supplier in supplierList" :key="supplier.name"
                            @click="handleSupplierClick(supplier.url)">
                            <img :src="supplier.imageUrl" :alt="supplier.name">
                            <span>{{ supplier.name }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <!-- 标准说明弹框 -->
    <el-dialog v-model="dialogVisible" :title="t('message.standardExplanation')" width="800px" :close-on-click-modal="false"
        class="standard-dialog">
        <el-scrollbar height="calc(100vh - 200px)">
            <div class="operate-box">
                <div class="text-box">
                    <div class="standard-item">
                        <span>1. {{ t('message.ensureDrawing') }}</span>
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
        </el-scrollbar>
        <div class="dialog-footer">
        </div>
    </el-dialog>

    <!-- 添加卡片详情弹框 -->
    <el-dialog v-model="cardDialogVisible" width="700px" :close-on-click-modal="false"
        class="standard-dialog app-dialog" @closed="onAppDialogClosed">
        <el-scrollbar>
            <div class="app-dialog-content">
                <div class="app-header">
                    <div class="app-icon fire-icon-container" :class="isDark ? 'dark-mode' : 'light-mode'">
                        <img v-if="currentCard?.value" :src="getIconUrl(currentCard.value )" :alt="currentCard.name"
                            class="fire-icon" @error="console.log('Failed to load image:', currentCard.value)" />
                    </div>
                    <div class="app-title">
                        <div class="name">{{ currentCard?.name }}</div>
                        <div class="desc">{{ currentCard?.extra?.englishName }}</div>
                    </div>
                    <el-button type="primary" class="launch-btn" @click="handleLaunchClick">{{ t('message.launchApp') }}</el-button>
                </div>
                <div class="app-desc">
                    {{ currentCard?.description || (currentCard?.name + t('message.noLocalDeployment')) }}
                </div>
                <div class="app-preview">
                    <div class="app-preview-header">
                        <span class="app-preview-title">{{ t('message.appIntroduction') }}</span>
                        <span class="app-preview-standard" @click="handleStandardClick">
                            <el-icon>
                                <QuestionFilled />
                            </el-icon>
                            {{ t('message.standardExplanation') }}
                        </span>
                    </div>
                    <div class="preview-container">
                        <video v-if="hasPreviewVideo && playPreview" ref="previewVideoRef" controls autoplay
                            class="preview-video" preload="metadata" @error="onPreviewVideoError">
                            <source v-if="isHevcSupportedPreview" :src="previewHevcUrl" type="video/mp4; codecs=hevc" />
                            <source :src="previewH264Url" type="video/mp4; codecs=avc1.42E01E" />
                            您的浏览器不支持视频播放。
                        </video>
                        <img v-else src="@/assets/operate/one.png" alt="应用截图" class="preview-image" />
                    </div>
                </div>
            </div>
        </el-scrollbar>
        <div class="version-info">
            版本：{{ currentCard?.extra?.version }}
        </div>
    </el-dialog>

    <!-- 权限弹框 -->
    <el-dialog v-model="permissionDialogVisible" title="暂无权限" width="400px" :close-on-click-modal="false">
        <p style="text-align: left;">此版块功能仅限于企业版，您暂未获得使用资格</p>
        <template #footer>
            <span class="dialog-footer">
                <!-- <div class="dialog-button cancel" @click="permissionDialogVisible = false">取消</div> -->
                <div class="dialog-button confirm" @click="handlePermissionClick">我已知晓</div>
            </span>
        </template>
    </el-dialog>
    <el-dialog v-model="permissionDialogVisibless" title="内测中" width="400px" :close-on-click-modal="false">
        <p style="text-align: left;">此版块功能内测中，即将开放</p>
        <template #footer>
            <span class="dialog-footer">
                <!-- <div class="dialog-button cancel" @click="permissionDialogVisible = false">取消</div> -->
                <div class="dialog-button confirm" @click="handlePermissionClickss">我已知晓</div>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { Search, Monitor, MoreFilled, Timer, Warning, Notification, Operation, ScaleToOriginal, Switch, Aim, Cpu, Smoking, Connection, Link, Right, DArrowRight, QuestionFilled } from '@element-plus/icons-vue'
import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { isDark } from '../../utils/theme'
import { getAigcPrimaryList, getAigcChildrenList } from '@/api/aigc'
import type { ProjectItem } from '@/api/model/detailModel'
import { ElMessage } from 'element-plus'
import { stashToken } from '@/api/userCenter'
import { useUserStore } from '@/stores/user'
import { RC4Encrypt } from '../../utils/crypto'
import { logPost } from '../../utils/log'

// 初始化 router
const router = useRouter()
const { t } = useI18n()

// 获取所有svg图标
const getIconUrl = (name: string) => {
    if (!name) return '';
    // 别名映射：新键暂时统一使用老图标
    const aliasMap: Record<string, string> = {
        'fire_water_drainage': 'sprinkler',
        'fire_wsd_suite_v2': 'fire_water_v2'
    };
    const normalizedName = aliasMap[name] || name;
    try {
        // 使用动态导入
        return new URL(`../../assets/tb/${normalizedName}.svg`, import.meta.url).href;
    } catch (error) {
        console.error('Error loading icon:', normalizedName, error);
        return '';
    }
}

// 获取视频链接
const getVideoUrl = (value: string) => {
    if (!value) return '';
    const availableVideos = ['extinguishing', 'firehose_extinguisher', 'rain_water_curtain', 'sprinkler', 'firealarm', 'firedoor_monitoring', 'lighting_evacuation', 'watermist','fire_water_v2','fire_electrical_v2','fire_hvac_v2','fire_decoration_v2'];
    if (availableVideos.includes(value)) {
        return `https://work.beesfpd.com/tutorials/${value}_h265.mp4`;
    }
    return '';
}

// 兼容播放（优先 HEVC，回退 H264）
const previewVideoRef = ref<HTMLVideoElement | null>(null)
const isHevcSupportedPreview = ref(true)
const hasPreviewVideo = computed(() => !!(currentCard.value && getVideoUrl((currentCard.value as any).value)))
const playPreview = ref(false)
const previewHevcUrl = computed(() => currentCard.value ? `https://work.beesfpd.com/tutorials/${(currentCard.value as any).value}_h265.mp4` : '')
const previewH264Url = computed(() => currentCard.value ? `https://work.beesfpd.com/tutorials/${(currentCard.value as any).value}_h264.mp4` : '')

const checkHevcSupportPreview = async () => {
    try {
        if ((navigator as any).mediaCapabilities?.decodingInfo) {
            const result = await (navigator as any).mediaCapabilities.decodingInfo({
                type: 'file',
                video: {
                    contentType: 'video/mp4; codecs=hevc',
                    width: 1920,
                    height: 1080,
                    bitrate: 3000000,
                    framerate: 30
                }
            })
            isHevcSupportedPreview.value = !!result?.supported
            return
        }
        const testVideo = document.createElement('video')
        const canPlay = testVideo.canPlayType('video/mp4; codecs=hevc')
        isHevcSupportedPreview.value = canPlay === 'probably' || canPlay === 'maybe'
    } catch {
        isHevcSupportedPreview.value = false
    }
}

const onPreviewVideoError = () => {
    if (isHevcSupportedPreview.value) {
        isHevcSupportedPreview.value = false
        nextTick(() => previewVideoRef.value?.load())
    }
}

// 关闭弹框时停止并重置预览视频
const stopPreviewVideo = () => {
    const el = previewVideoRef.value
    if (!el) return
    try {
        el.pause()
        el.currentTime = 0
        el.removeAttribute('src')
        el.load()
    } catch { }
}

const onAppDialogClosed = () => {
    playPreview.value = false
    stopPreviewVideo()
}

// 初始化 userStore
const userStore = useUserStore()

// 类型定义
interface ProjectItemExtended extends ProjectItem {
    contentShow?: boolean;
    extra?: {
        version?: string;
        url?: string;
        tip?: string;
        englishName?: string;
        group?: string;
        icon?: any;  // 添加 icon 属性
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
const activeTag = ref('')
const searchText2 = ref('')
const activeTag2 = ref('')
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
        const primaryRes = await getAigcPrimaryList();

        if (primaryRes?.code !== 200 || !Array.isArray(primaryRes?.data)) {
            // 401错误由拦截器处理，其他错误可选择显示
            // const { t } = useI18n()
            // ElMessage.error(t('message.getPrimaryCategoryFailed'))
            return;
        }

        const list = primaryRes.data;

        const componentsList = [
            ...aigcModuleSkuList[2].components,
            ...aigcModuleSkuList[3].components,
            ...aigcModuleSkuList[4].components
        ];

        if (Array.isArray(aigcList.value)) {
            handleAigcListData(list, componentsList);
        }

        allList.value = list;

        await handleFireApplication(list);

    } catch (error) {
        ElMessage.error(error instanceof Error ? error.message : '获取数据失败');
    }
};

// 处理 AIGC 列表数据
const handleAigcListData = (list: ProjectItem[], componentsList: AigcModuleComponent[]) => {
    for (const element of aigcList.value) {
        for (const key of list) {
            if (element.name !== key.name) continue;

            key.content = element.content;
            updateFireList(key.name);

            if (fireList.value.length === componentsList.length && key.name === AIGC_MODULES.FIRE) {
                key.content = 'AigcCmpPkgFirefighting';
            }
        }
    }
};

// 更新消防列表
const updateFireList = (moduleName: string) => {
    switch (moduleName) {
        case AIGC_MODULES.WATER:
            fireList.value = [...aigcModuleSkuList[2].components, ...fireList.value];
            break;
        case AIGC_MODULES.HVAC:
            fireList.value = [...aigcModuleSkuList[3].components, ...fireList.value];
            break;
        case AIGC_MODULES.ELECTRIC:
            fireList.value = [...aigcModuleSkuList[4].components, ...fireList.value];
            break;
    }
};

// 处理智能消防应用
const handleFireApplication = async (list: ProjectItem[]) => {
    const fireApps = list.filter((item: ProjectItem) => item.name === '智能消防');
    applicationList.value = fireApps;

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

// 移除页面加载时自动打开弹框的逻辑
onMounted(async () => {
    await fetchData()
    await fetchHvacCards()
    
    // 初始化活跃标签
    nextTick(() => {
        if (tags.value.length > 0) {
            activeTag.value = tags.value[0].name
        }
        if (tags2.value.length > 0) {
            activeTag2.value = tags2.value[0].name
        }
    })
})

const tags = computed(() => [
    { name: t('message.tagAll') },
    { name: t('message.tagWaterSupply') },
    { name: t('message.tagElectrical') },
    { name: t('message.tagHvac') }
])

const tags2 = computed(() => [
    { name: t('message.tagAll') },
    { name: t('message.tagWaterSupply') },
    { name: t('message.tagElectrical') },
    { name: t('message.tagHvac') }
])

// 计算样式
const searchInputBorderColor = computed(() => isDark.value ? 'rgba(255, 255, 255, .3)' : '#dcdfe6');
const menuTextColor = computed(() => isDark.value ? '#EDEDED' : '#13343C')
const subTextColor = computed(() => isDark.value ? '#A1A1A1' : '#A1A1A1')
const vTextColor = computed(() => isDark.value ? '#EDEDED' : '#13343C')
const borderColor = computed(() => isDark.value ? 'transparent' : 'transparent')
const menuBgColor = computed(() => isDark.value ? '#000' : '#fff')
const listheader = computed(() => isDark.value ? 'rgba(255, 255, 255, 0.3)' : '#D7D7D7')
const menuHoverBgColor = computed(() => isDark.value ? '#2b2b2b' : '#f5f7fa')
const dialogBgColor = computed(() => isDark.value ? '#141414' : '#faf9f5')
const dialogHeaderBgColor = computed(() => isDark.value ? '#1d1e1f' : '#f5f7fa')
// const tagsBorderColor = computed(() => isDark.value ? '#222222' : '#D7D7D7')
const tagsBgColor = computed(() => isDark.value ? '#0A0A0A' : '#faf9f5')
const tagTextColor = computed(() => isDark.value ? '#C4C4D3' : '#000000')
const tagHoverBgColor = computed(() => isDark.value ? '#1B2126' : '#F9F9F9')
const tagActiveBgColor = computed(() => isDark.value ? '#191919' : '#F2F2F2')
const cardBgColor = computed(() => isDark.value ? 'rgb(10,10,10)' : 'rgba(255, 255, 255, 1)')
const cardHoverBgColor = computed(() => isDark.value ? '#1B2126' : '#FFF8CC')
const plusIconBgColor = computed(() => isDark.value ? '#C5C3D2' : '#c9c9c9')
// const plusIconBorderColor = computed(() => isDark.value ? '#C5C3D2' : '#000000')
const plusIconColor = computed(() => isDark.value ? '#000' : '#ffff')
const dashboardBgColor = computed(() => isDark.value ? '#000' : '#faf9f5')
const appHeaderBgColor = computed(() => isDark.value ? 'rgba(231, 231, 224, 0.3)' : '#D7D7D7')
const appPreviewTitleColor = computed(() => isDark.value ? '#fff' : '#222');
const appPreviewStandardColor = computed(() => isDark.value ? '#a3a6ad' : '#606266');

const hvacCardList = [
    {
        title: 'BeesCAD',
        description: '基于云架构，完全自主产权',
        icon: 'cloud_cad',
        action: 'open_app'
    },
    {
        title: 'CAD转化',
        description: 'CAD / PDF / 图片转换工具',
        icon: 'cad_converter',
        action: 'cad'
    },
    {
        title: '智能预算',
        description: '智能算量，预算精准无忧',
        icon: 'smart_budget',
        action: 'show_permission_denied'
    },
    {
        title: '智慧管理',
        description: '消防管理，智能一键掌控',
        icon: 'smart_management',
        action: 'show_permission_denied'
    },

]
const hvacCardListss = ref<Array<any>>([])

// 加载顶部「智能绘制2.0」卡片列表（与 fetchData 一致的展示效果）
const fetchHvacCards = async () => {
    try {
        const res = await getAigcChildrenList(current.value, 2)
        if (res?.code !== 200 || !Array.isArray(res?.data)) {
            // 401错误由拦截器处理，其他错误可选择显示
            // const { t } = useI18n()
            // ElMessage.error(t('message.getSmartDrawing2DataFailed'))
            return;
        }
        // 复用本页前置处理逻辑
        const childrenData = Array.isArray(res.data) ? res.data : []
        const processed = getAigcCadStatus(childrenData)
        hvacCardListss.value = processed.map((it: any) => ({
            title: it.name ?? '',
            description: it.description ?? '',
            icon: it.value ?? '',
            action: 'open_app',
            ...it
        }))
    } catch (error) {
        ElMessage.error(error instanceof Error ? error.message : '获取数据失败')
    }
}

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
        url: 'https://www.beesioe.com',
    },
    {
        name: '鼎信通讯消防',
        imageUrl: '/aigcIcon/2.png',
        url: 'https://www.beesioe.com',
    },
    {
        name: '青鸟消防',
        imageUrl: '/aigcIcon/3.png',
        url: 'https://www.beesioe.com',
    },
    {
        name: '台谊消防',
        imageUrl: '/aigcIcon/4.png',
        url: 'https://www.beesioe.com',
    },
    {
        name: '深圳嘉泰',
        imageUrl: '/aigcIcon/5.png',
        url: 'https://www.beesioe.com',
    },
    {
        name: '赛特威尔',
        imageUrl: '/aigcIcon/6.png',
        url: 'https://www.beesioe.com',
    },
    {
        name: '左向科技',
        imageUrl: '/aigcIcon/7.png',
        url: 'https://www.beesioe.com',
    },
    {
        name: '海湾公司',
        imageUrl: '/aigcIcon/8.png',
        url: 'https://www.beesioe.com',
    },
]);

// 处理供应商链接点击
const handleSupplierClick = (url: string) => {
    window.open(url, 'noopener,noreferrer');
};
const handleEquipmentClick = (item: string) => {
    console.log(item);
    window.open('https://www.beesioe.com', 'noopener,noreferrer');
}
const handlegoClick = (item: string) => {
    console.log(item);
    window.open('https://www.beesfpd.com/', 'noopener,noreferrer');
}

// 添加新的响应式变量
const cardDialogVisible = ref(false)
const permissionDialogVisible = ref(false)
const permissionDialogVisibless = ref(false)
const currentCard = ref<any>(null)

// 添加卡片点击事件处理函数
const handleCardClick = (item: ProjectItemExtended) => {
    currentCard.value = item;
    cardDialogVisible.value = true;
    playPreview.value = true
};

// 添加计算属性
const closeHoverColor = computed(() => isDark.value ? '#f3cc2e' : '#409eff')

// 处理 CAD 状态
const getAigcCadStatus = (data: ProjectItem[]) => {
    const val = allList.value.filter((key: any) => key.value === current.value)[0];
    if (!val) {
        return data;
    }
    const filteredData = data.filter(item => item.extra && item.extra.version);
    const iconMap: { [key: string]: any } = {
        'sprinkler': Timer,
        'firehose_extinguisher': Warning,
        'extinguishing': Cpu,
        'watermist': Operation,
        'rain_water_curtain': ScaleToOriginal,
        'foam': Switch,
        'deluge': Aim,
        'firemonitor': Monitor,
        'firealarm': Notification,
        'lighting_evacuation': Operation,
        'firedoor_monitoring': Switch,
        'firepump_monitoring': Connection,
        'pressurization': Smoking,
        'ventilation_pressurization': Link,
        'smoke_control': Smoking,
        'fire_water_v2': Timer,
        'fire_wsd_suite_v2': Timer,
    };
    const groupMap: { [key: string]: string } = {
        'sprinkler': '智能给排水',
        'firehose_extinguisher': '智能给排水',
        'extinguishing': '智能给排水',
        'watermist': '智能给排水',
        'rain_water_curtain': '智能给排水',
        'foam': '智能给排水',
        'deluge': '智能给排水',
        'firemonitor': '智能给排水',
        'fire_water_v2': '智能给排水',
        'fire_wsd_suite_v2': '智能给排水',
        'fire_electrical_v2': '智能电气',
        'fire_hvac_v2': '智能暖通',
        'fire_decoration_v2': '智能给排水',
        'firealarm': '智能电气',
        'lighting_evacuation': '智能电气',
        'firedoor_monitoring': '智能电气',
        'firepump_monitoring': '智能电气',
        'pressurization': '智能暖通',
        'ventilation_pressurization': '智能暖通',
        'smoke_control': '智能暖通'
    };

    const result = filteredData.map((item: any) => {
        const newItem = { ...item };

        if (val.name === '智能消防' || val.name === '装饰消防') {
            newItem.contentShow = fireList.value.some(fireItem => fireItem.title === item.name);
        } else {
            newItem.contentShow = !!val.content;
        }
        if (newItem.extra) {
            newItem.extra.icon = iconMap[item.value] || Monitor;
            newItem.extra.group = groupMap[item.value] || '';
        }
        return newItem;
    });

    console.log('最终处理后的数据:', result);
    return result;
};

// 添加计算属性来过滤secondaryList
// type TagGroupKey = '智能给排水' | '智能电气' | '智能暖通';

// function unique(arr: any) {
//   return Array.from(new Set(arr));
// }

// 添加启动应用点击处理函数
const handleLaunchClick = async () => {
    const card = currentCard.value;
    if (!card?.extra?.url) {
        ElMessage.info('未配置跳转链接');
        cardDialogVisible.value = false;
        return;
    }

    try {
        const { data, code } = await stashToken({
            accessToken: userStore.accessToken,
            refreshToken: userStore.refreshToken,
        });

        if (code === 200) {
            const path = `${card.extra.group || ''}/${card.extra.englishName || ''}`;
            const extraQuery = card.extra.url.split('?')[1];
            const query = `id=${data}&path=${path}${extraQuery ? `&${extraQuery}` : ''}`;
            const encodedQuery = `sign=${encodeURIComponent(RC4Encrypt(query))}`;
            // const baseUrl = import.meta.env.PROD ?'http://cloud.dev.ifeng.com':'https://cloud-uat.gatherbee.cn';
            // const baseUrl = 'https://cloud.gatherbee.cn';
            const baseUrl = 'https://aigc.beesfpd.com';
            const basePath = card.extra.url.split('?')[0] || card.extra.url;
            const fullUrl = `${baseUrl}${basePath}#/UploadFiles?${encodedQuery}`;

            logPost({ event: 'APP_LAUNCH_CLICK', category: path });

            window.open(fullUrl, '_blank', 'noopener,noreferrer');
        } else {
            ElMessage.error('获取身份凭证失败');
        }
    } catch (error) {
        ElMessage.error('跳转失败');
        console.error(error);
    }

    cardDialogVisible.value = false;
};

// 添加点击标准说明的处理函数
const handleStandardClick = () => {
    dialogVisible.value = true;
};

const toggleIconMode = () => {
    const containers = document.querySelectorAll('.fire-icon-container');
    containers.forEach(container => {
        if (isDark.value) {
            container.classList.remove('light-mode');
            container.classList.add('dark-mode');
        } else {
            container.classList.remove('dark-mode');
            container.classList.add('light-mode');
        }
    });
}

// 监听主题变化
watch(isDark, () => {
    toggleIconMode();
});

onMounted(() => {
    toggleIconMode();
    checkHevcSupportPreview()
});

// 关闭弹框或离开页面时，确保视频停止
watch(cardDialogVisible, (visible) => {
    if (!visible) {
        onAppDialogClosed()
    }
    if (visible) {
        playPreview.value = true
    }
})
onUnmounted(() => {
    onAppDialogClosed()
})

// 添加计算属性来过滤secondaryList
// type TagGroupKey = '智能给排水' | '智能电气' | '智能暖通';

const filteredSecondaryList = computed(() => {
    let filtered = secondaryList.value;

    // 标签筛选
    if (activeTag.value !== '所有') {
        filtered = filtered.filter(item => {
            return item.extra?.group === activeTag.value;
        });
    }

    // 搜索文本筛选
    if (searchText.value) {
        const searchLower = searchText.value.toLowerCase();
        filtered = filtered.filter(item => {
            return item.name.toLowerCase().includes(searchLower) || 
                (item.description && item.description.toLowerCase().includes(searchLower)) ||
                (item.value && item.value.toLowerCase().includes(searchLower));
        });
    }
    return filtered;
});

const filteredHvacList = computed(() => {
    let filtered = hvacCardListss.value;

    // 标签筛选
    if (activeTag2.value !== '所有') {
        filtered = filtered.filter(item => {
            return item.extra?.group === activeTag2.value;
        });
    }

    // 搜索文本筛选
    if (searchText2.value) {
        const searchLower = searchText2.value.toLowerCase();
        filtered = filtered.filter(item => {
            return item.title.toLowerCase().includes(searchLower) || 
                (item.extra?.englishName && item.extra.englishName.toLowerCase().includes(searchLower)) ||
                (item.value && item.value.toLowerCase().includes(searchLower));
        });
    }
    return filtered;
});

const handleTagClick = (tagName: string) => {
    activeTag.value = tagName;
};

const handleTagClick2 = (tagName: string) => {
    activeTag2.value = tagName;
};

// 处理更多应用卡片点击
const handleMoreAppCardClick = (item: any) => {
    if (item.action === 'open_app') {
        permissionDialogVisibless.value = true;
    } else if (item.action === 'cad') {
        const resolvedRoute = router.resolve('/converter/pdf-to-cad');
        const targetUrl = window.location.origin + resolvedRoute.href;
        window.open(targetUrl, '_blank');
    } else {
        permissionDialogVisible.value = true;
    }
    // if (item.action === 'open_app') {
    //     const mockItem = {
    //         name: item.title,
    //         value: item.icon,
    //         description: item.description,
    //         extra: {
    //             englishName: 'Next Generation CAD based on Cloud',
    //             version: '1.0.0',
    //             url: null,
    //             group: 'CloudBeeCAD'
    //         }
    //     };
    //     handleCardClick(mockItem as any);
    // } else if (item.action === 'show_permission_denied') {
    //     permissionDialogVisible.value = true;
    // }
};

// 处理权限点击
const handlePermissionClick = () => {
    permissionDialogVisible.value = false;
};
const handlePermissionClickss = () => {
    permissionDialogVisibless.value = false;
};
</script>

<style lang="less" scoped>
.dashboard-container {
    /* padding: 20px; */
    width: 1200px;
    margin: 0 auto;
    border: 1px solid v-bind(borderColor);
    box-sizing: border-box;
    background-color: v-bind(dashboardBgColor);
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
.left-title{
    margin-top: 40px;
}
.right-title {
    margin: 0 16px;
}

.container-left {
    width: 900px;
    min-width: 900px;
    border: 1px solid v-bind(borderColor);
    padding: 10px;
    box-sizing: border-box;
}

.container-right {
    width: 260px;
    min-width: 260px;
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
        margin: 0 auto;
    }
}

@media screen and (max-width: 1135px) {
    .dashboard-container {
        margin: 0 auto;
    }
}

.search-section {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    width: 100%;
    margin-top: 20px;
}

.search-input {
    flex: 1;
    min-width: 0;

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

    :deep(.el-input__prefix) {
        color: v-bind(subTextColor);
    }
}

.tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    width: 400px;
    flex-shrink: 0;
    border: 1px solid v-bind(searchInputBorderColor) !important;
    border-radius: 5px;
    padding: 0 8px;
    height: 40px;
    background-color: v-bind(tagsBgColor);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    align-items: center;
    overflow: hidden;
}

.tags :deep(.el-tag) {
    background-color: transparent;
    border: none;
    color: v-bind(tagTextColor);
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    padding: 0 20px;
    height: 28px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    margin: 0;
    font-size: 12px;
    line-height: 1;

    &:hover {
        background-color: v-bind(tagHoverBgColor);
    }

    &.is-active {
        background-color: v-bind(tagActiveBgColor);
        color: v-bind(tagTextColor);
    }
}

.card-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 20px;
    width: 100%;
}

@media screen and (max-width: 1439px) {
    .card-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

.card {
    background-color: v-bind(cardBgColor);
    border-radius: 8px;
    padding: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    height: 66px;
    box-sizing: border-box;
    position: relative;
    width: 100%;
    overflow: hidden;
}

.card:hover {
    background-color: v-bind(cardHoverBgColor);
    transform: translateY(-2px);
    box-shadow: 5px 5px 5px rgba(255, 255, 255, 0.3);
}

.card-content {
    flex: 1;
    overflow: hidden;
    padding-right: 32px;
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

.equipment-list,
.supplier-list {
    background-color: v-bind(menuBgColor);
    border-radius: 8px;
    margin-bottom: 20px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-header {
    padding: 16px 16px 16px 0;
    margin: 0 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: v-bind(menuTextColor);
    font-size: 14px;
    font-weight: 500;
    border-bottom: 1px solid v-bind(listheader);
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
    padding-right: 0;
    display: flex;
    align-items: center;
}

.list-item.more:hover {
    color: rgb(249, 211, 74);
}

.list-item.more .double-arrow {
    font-size: 12px;
    margin-left: 8px;
    transform: rotate(90deg);
    margin-right: 130px;
    display: flex;
    align-items: center;
    height: 12px;
    line-height: 1;
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
    width: 101px;
    height: 83px;
    box-sizing: border-box;
}

.supplier-item:hover {
    background-color: v-bind(menuHoverBgColor);
    transform: translateY(-2px);
}

.supplier-item img {
    width: 96px;
    height: 36px;
    object-fit: cover;
    border-radius: 5px;
}

.supplier-item span {
    font-size: 12px;
    color: v-bind(subTextColor);
}

.standard-dialog :deep(.el-dialog) {
    margin: 50px auto !important;
    max-height: calc(100vh - 100px) !important;
    background-color: v-bind(dialogBgColor);
    border: 1px solid v-bind(borderColor);
    overflow: hidden !important;
    display: flex !important;
    flex-direction: column !important;
}

.standard-dialog :deep(.el-dialog__header) {
    margin: 0 !important;
    padding: 20px !important;
    border-bottom: 1px solid v-bind(borderColor);
    background-color: v-bind(dialogHeaderBgColor);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0 !important;
    position: relative !important;
    z-index: 1;
}

.standard-dialog :deep(.el-dialog__title) {
    color: v-bind(menuTextColor);
    font-weight: 600;
}

.standard-dialog :deep(.el-dialog__headerbtn:hover .el-dialog__close) {
    color: #409EFF;
}

.standard-dialog :deep(.el-dialog__body) {
    flex: 1 !important;
    overflow: hidden !important;
    padding: 0 !important;
    margin: 0 !important;
    background-color: v-bind(dialogBgColor);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    min-height: 0 !important;
    position: relative !important;
    height: auto !important;
    max-height: none !important;
    display: flex !important;
    flex-direction: column !important;
}

/* 滚动条样式 */
.standard-dialog :deep(.el-scrollbar__thumb) {
    background-color: v-bind(subTextColor) !important;
    opacity: 0.3 !important;
}

.standard-dialog :deep(.el-scrollbar__thumb:hover) {
    opacity: 0.5 !important;
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

/* 修改卡片弹框样式 */
.app-dialog {
    :deep(.el-dialog__header) {
        display: none !important;
    }

    :deep(.el-dialog__body) {
        padding: 0 !important;
        margin: 0 !important;
        background-color: v-bind(dialogBgColor);
        display: flex !important;
        flex-direction: column !important;
        height: 100% !important;
        overflow: hidden !important;
        position: relative !important;
        flex: 1 !important;
        min-height: 0 !important;
    }

    :deep(.el-dialog) {
        margin: 50px auto !important;
        max-height: calc(100vh - 100px) !important;
        background-color: v-bind(dialogBgColor);
        border: 1px solid v-bind(borderColor);
        overflow: hidden !important;
        display: flex !important;
        flex-direction: column !important;
    }
}

.app-dialog-content {
    position: relative;
    padding: 24px;
    color: v-bind(menuTextColor);
    flex: 1 !important;
    overflow: visible !important;
    min-height: 0 !important;
    height: auto !important;
    max-height: none !important;
}

.app-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid v-bind(appHeaderBgColor);
    // border-bottom: 1px solid v-bind(appHeaderBgColor);
}

.app-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.app-icon.fire-icon-container {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    transition: background-color 0.3s ease;
}

.app-icon.fire-icon-container.light-mode {
    background-color: #E8E9E4;
}

.app-icon.fire-icon-container.dark-mode {
    background-color: #191919;
}

.app-icon .fire-icon {
    width: 60px;
    height: 60px;
    display: block;
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
    background-color: #FABD33 !important;
    box-sizing: border-box;
    border: none;
    border-radius: 5px;
    filter: drop-shadow(none);
    transition: all 0.3s ease;
    font-family: "PingFangHK-Semibold", "PingFang HK Semibold", "PingFang HK", sans-serif;
    font-weight: 650;
    font-style: normal;
    color: #000 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    cursor: pointer;
}

.launch-btn:hover {
    background-color: rgba(249, 222, 74, 0.8);
    color: #000;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(249, 222, 74, 0.3);
}

.launch-btn:active {
    transform: translateY(0);
    box-shadow: none;
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

.preview-video {
    width: 100%;
    display: block;
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid v-bind(borderColor);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.version-info {
    position: relative;
    left: 0;
    // width: 100%;
    margin: 0 24px;
    font-size: 14px;
    font-weight: 400;
    color: v-bind(vTextColor);
    border-top: 1px solid v-bind(appHeaderBgColor);
    display: flex;
    align-items: center;
    padding: 20px 0;
    flex-shrink: 0;
    /* 防止收缩 */
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

.card:hover .card-icon {
    background-color: #409EFF;
    color: #FFFFFF;
}

.circle-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: v-bind(plusIconBgColor);
    /* border: 1px solid v-bind(plusIconBorderColor); */
    display: none;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
}

.circle-icon :deep(.el-icon) {
    font-size: 14px;
    color: v-bind(plusIconColor);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.card:hover .circle-icon {
    display: flex;
    opacity: 1;
}

/* 基础图标容器样式 */
.fire-icon-container {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;
}

/* Light模式背景 */
.fire-icon-container.light-mode {
    background-color: #E8E9E4;
}

/* Dark模式背景 */
.fire-icon-container.dark-mode {
    background-color: #191919;
}

/* 图标本身的样式 */
.fire-icon {
    width: 42px;
    height: 42px;
    display: block;
    flex-shrink: 0;
}

.header-icon {
    width: 20px;
    height: 20px;
    transition: filter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dark-icon {
    filter: brightness(0) invert(1);
    /* 将图标变为白色 #FFFFFF */
}

.light-icon {
    filter: invert(15%) sepia(19%) saturate(934%) hue-rotate(155deg) brightness(94%) contrast(95%);
    /* 将图标变为 #13343C */
}

.search-icon {
    width: 16px;
    height: 16px;
    opacity: 0.6;
}

.dot {
    width: 4px;
    height: 4px;
    background-color: v-bind(subTextColor);
    border-radius: 50%;
    margin-right: 10px;
    display: inline-block;
}

.login-footer {
    text-align: center;
    margin-top: 20px;

    :deep(.el-link) {
        color: #A1A1A1 !important;
        text-decoration: none !important;
        border-bottom: 1px solid #FFEA65 !important;
        font-size: 12px !important;

        &:hover {
            color: #FFEA65 !important;
            border-bottom: 1px solid #FFEA65 !important;
        }

        span {
            color: #A1A1A1 !important;
            text-decoration: none !important;
            border-bottom: 1px solid #FFEA65 !important;

            &:hover {
                color: #FFEA65 !important;
                border-bottom: 1px solid #FFEA65 !important;
            }
        }
    }

    :deep(.el-link--primary) {
        color: #A1A1A1 !important;
        text-decoration: none !important;
        border-bottom: 1px solid #FFEA65 !important;

        &:hover {
            color: #FFEA65 !important;
            border-bottom: 1px solid #FFEA65 !important;
        }
    }
}

// 错误提示框样式
:deep(.el-popper.error-tooltip) {
    background-color: #303133 !important;
    border: 1px solid #797979 !important;
    color: #FFFFFF !important;
    font-size: 12px !important;
    padding: 6px 12px !important;

    .el-popper__arrow {
        &::before {
            background-color: #303133 !important;
            border: 1px solid #797979 !important;
        }
    }

    &[data-popper-placement^='bottom'] {
        .el-popper__arrow {
            &::before {
                border-bottom: none !important;
                border-right: none !important;
            }
        }
    }

    &[data-popper-placement^='top'] {
        .el-popper__arrow {
            &::before {
                border-top: none !important;
                border-left: none !important;
            }
        }
    }
}

// 右上角提示框样式
:deep(.el-popper.custom-tooltip) {
    background-color: #FFBD33 !important;
    font-size: 12px !important;
    color: #FFFFFF !important;
    border: none !important;
    padding: 0 !important;
    width: 68px !important;
    height: 35px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;

    .el-tooltip__content {
        color: #FFFFFF !important;
        line-height: 35px !important;
    }

    .el-popper__arrow {
        &::before {
            background-color: #FFBD33 !important;
            border-right-color: #FFBD33 !important;
        }
    }
}

// 用户协议和隐私设置样式
:deep(.el-link.yellow-link) {
    color: #FFEA65 !important;
    font-size: 12px !important;
    text-decoration: none !important;

    &:hover {
        color: #FFEA65 !important;
        text-decoration: underline !important;
    }
}

// 登录和注册按钮样式
:deep(.el-button.login-button) {
    color: #000 !important;
    font-size: 16px !important;
    font-weight: 500 !important;
    width: 100% !important;
    height: 40px !important;
    background-color: rgba(249, 222, 74, 1) !important;
    border: none !important;

    &:hover {
        background-color: rgba(255, 234, 101, 1) !important;
    }

    &:disabled {
        background-color: #CCCCCC !important;
        color: #FFFFFF !important;
    }
}

// 复选框文字样式
:deep(.dark-checkbox) {
    .el-checkbox__label {
        display: inline-flex !important;
        align-items: center !important;
        line-height: 1 !important;
    }
}

// 链接样式
:deep(.yellow-link) {
    display: inline-flex !important;
    align-items: center !important;
}

// // 覆盖全局样式
// :deep(.el-button--primary) {
//   background-color: #FFBD33 !important;
//   border-color: #FFBD33 !important;
//   color: #FFFFFF !important;
// }

:deep(.el-link--primary) {
    color: #FFEA65 !important;
}

.app-preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.app-preview-title {
    font-weight: bold;
    font-size: 16px;
    color: v-bind(appPreviewTitleColor);
}

.app-preview-standard {
    display: flex;
    align-items: center;
    color: v-bind(appPreviewStandardColor);
    font-size: 14px;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
        color: #F9DE4A;
    }
}

.app-preview-standard .el-icon {
    margin-right: 4px;
    font-size: 16px;
}

.dialog-scroll-container {
    flex: 1 !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    padding: 20px !important;
    margin: 0 !important;
    min-height: 0 !important;
    background-color: v-bind(dialogBgColor);
    position: relative !important;
}

/* 应用弹框的滚动容器特殊样式 */
.app-dialog .dialog-scroll-container {
    padding: 24px !important;
}

.dialog-scroll-container::-webkit-scrollbar {
    width: 6px;
}

.dialog-scroll-container::-webkit-scrollbar-track {
    background: transparent;
}

.dialog-scroll-container::-webkit-scrollbar-thumb {
    background-color: v-bind(subTextColor);
    opacity: 0.3;
    border-radius: 3px;
}

.dialog-scroll-container::-webkit-scrollbar-thumb:hover {
    opacity: 0.5;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;

    .dialog-button {
        padding: 8px 20px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;

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
                background-color: rgba(249, 222, 74, 0.8);
            }
        }
    }
}

html.dark {
    .dialog-footer {
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
                background-color: #FABD33;
                color: #1B2126;

                &:hover {
                    background-color: rgba(249, 222, 74, 0.8);
                }
            }
        }
    }
}

.welcome-card {
    background-color: v-bind(cardBgColor);
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    color: v-bind(vTextColor);
}

.welcome-card h2 {
    margin: 0 0 10px;
}

.welcome-card p {
    margin: 0;
}

.welcome-card .highlight {
    color: #ff9900;
    font-weight: bold;
}

.stat-cards {
    display: grid;
    // ... existing code ...
}
</style>