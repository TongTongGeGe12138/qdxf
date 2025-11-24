<template>
    <el-container class="layout-container">
        <ThemeTransition />
        <el-aside :width="isCollapse ? '64px' : '200px'">
            <div class="logo-container">
                <img :src="getIconUrl('beesfqd_ai_logo')" alt="BeesFQD Logo" class="logo-icon" />
            </div>
            <el-menu :default-active="route.path" class="el-menu-vertical" :collapse="isCollapse" router
                :background-color="menuBgColor" :text-color="menuTextColor" :active-text-color="menuActiveTextColor"
                style="padding: 20px;">
                <el-menu-item v-for="route in visibleRoutes" :key="route.path" :index="route.path">
                    <img :src="getIconUrl(route.meta?.icon as string)" :alt="route.meta?.title as string"
                        class="menu-icon" @click.stop />
                    <span class="menu-title">{{ t((route.meta?.title as string) || 'message.smartApps') }}</span>
                </el-menu-item>
            </el-menu>
            <InviteModal v-model="showInviteModal" :url="inviteUrl" />
        </el-aside>

        <el-container>
            <el-header height="60px">
                <div class="header-left">
                </div>
                <div class="header-right">
                    <div class="invite-trigger" @click="showInviteModal = true">
                        <img :src="getIconUrl('invite_gift')" alt="邀请好友" class="invite-icon" />
                        <span>{{ t('message.inviteFriends') }}</span>
                    </div>
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            <el-avatar :icon="UserFilled" size="small" style="margin-right: 10px;" />
                            {{ t('message.personalCenter') }}
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="goToAccount">
                                    <div class="icon-container">
                                        <img :src="getIconUrl('zhgl')" :alt="t('message.accountManagement')"
                                            class="dropdown-icon" />
                                    </div>
                                    {{ t('message.accountManagement') }}
                                </el-dropdown-item>
                                <el-dropdown-item @click="toGang">
                                    <div class="icon-container">
                                        <img :src="getIconUrl('grzx')" :alt="t('message.backToWebsite')"
                                            class="dropdown-icon" />
                                    </div>
                                    {{ t('message.backToWebsite') }}
                                </el-dropdown-item>
                                <el-dropdown-item divided @click="handleLogout">
                                    <div class="icon-container">
                                        <img :src="getIconUrl('tcdl')" :alt="t('message.logout')"
                                            class="dropdown-icon" />
                                    </div>
                                    {{ t('message.logout') }}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <!-- 临时测试按钮 -->
                    <!-- <el-button @click="testLoading" style="margin-right: 10px;">测试Loading</el-button> -->
                    <el-button class="theme-button" @click="handleThemeSwitch">
                        <img :src="getIconUrl(darkMode ? 'Darkmode' : 'lightmode')" :alt="darkMode ? '暗色模式' : '亮色模式'"
                            class="theme-icon" />
                    </el-button>
                </div>
            </el-header>

            <el-main>
                <router-view />
                <LogoAnimation :visible="loading" />
            </el-main>
        </el-container>

        <!-- 客服图标 -->
        <div class="customer-service-icon" @mouseenter="showQR = true" @mouseleave="showQR = false">
            <img :src="getIconUrl('qr-icon.png')" alt="客服" class="cs-icon" />
            <!-- 二维码 -->
            <div class="qr-code" v-show="showQR">
                <img :src="getIconUrl(isDark ? 'qr-dark.png' : 'qr-light.png')" alt="二维码" class="qr-image" />
            </div>
        </div>
        <!-- 微信图标（仿照客服图标） -->
        <!-- <div class="customer-photo-icon" @mouseenter="showPhoto = true" @mouseleave="showPhoto = false">
            <img :src="xxxIconUrl" alt="微信" class="cs-icon" />
            <div class="qr-code" v-show="showPhoto">
                <img :src="ghImageUrl" alt="图片预览" class="qr-image" />
            </div>
        </div> -->
    </el-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { UserFilled } from '@element-plus/icons-vue'
import { isDark, toggleDark, applyTheme } from '../utils/theme'
import ThemeTransition from '../components/ThemeTransition.vue'
import LogoAnimation from '../components/LogoAnimation.vue'
import InviteModal from '../components/InviteModal.vue'
import { useUserStore } from '../stores/user'
import { getReferralUrl } from '@/api/userCenter'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()
const isCollapse = ref(false)
const loading = ref(false)
const showQR = ref(false)
const showInviteModal = ref(false)
const inviteUrl = ref('')
// const showPhoto = ref(false)
// const ghImageUrl = new URL('../assets/gh_b35daf1fe99b_258.jpg', import.meta.url).href
// const xxxIconUrl = new URL('../assets/xxx.svg', import.meta.url).href

const fetchInviteUrl = async () => {
    try {
        const res = await getReferralUrl()
        if (res.code === 200 && res.data) {
            inviteUrl.value = res.data
            console.log(res.data, 999);

        }
    } catch (error) {
        console.error('Failed to fetch referral url:', error)
    }
}

// 本地主题状态
const darkMode = ref(isDark.value)

// 监听本地主题状态变化
watch(darkMode, (newValue) => {
    if (newValue !== isDark.value) {
        toggleDark()
    }
})

// 监听全局主题状态变化
watch(isDark, (newValue) => {
    darkMode.value = newValue
})

// 计算菜单样式
const menuBgColor = computed(() => isDark.value ? '#000' : '#faf9f5')
const mainBgColor = computed(() => isDark.value ? '#000' : '#faf9f5')
const menuTextColor = computed(() => isDark.value ? '#EDEDED' : '#13343C')
const menuActiveTextColor = computed(() => '#fff')
const menuHoverBgColor = computed(() => isDark.value ? '#1B2126' : '#f6f7f9')
const borderColor = computed(() => isDark.value ? '#414243' : '#e4e7ed')
const dropdownTextColor = computed(() => isDark.value ? '#FFFFFF' : '#333333')

const themeButtonBgColor = computed(() => darkMode.value ? '#333333' : '#E8E9E4')
const themeButtonHoverBgColor = computed(() => darkMode.value ? '#1B2126' : '#FFF8CC')

const dropdownBgColor = computed(() => isDark.value ? 'var(--el-bg-color)' : '#faf9f5')

const menuIconFilter = computed(() => isDark.value ? 'brightness(0) invert(1)' : '#ffffff')



// 获取路由配置中的菜单项
const routes = computed(() => {
    const mainRoute = router.options.routes.find(route => route.path === '/')
    return mainRoute?.children || []
})

// 过滤出应该显示的菜单项
const visibleRoutes = computed(() => {
    return routes.value.filter(route => route.meta?.title && route.meta?.hidden !== true)
})

const handleThemeSwitch = () => {
    // Element Plus 官网式：依赖全局样式的颜色过渡，直接切换主题
    toggleDark()
}

const handleMenuClick = (path: string) => {
    router.push(path)
}

const openInviteModal = () => {
    showInviteModal.value = true
}

const toGang = () => {
    window.open('https://www.beesfpd.com/', '_blank');
}
const getIconUrl = (name: string) => {
    if (!name) return '';

    // 特殊处理logo图标，根据主题模式返回不同的图标
    if (name === 'beesfqd_ai_logo') {
        const logoName = isDark.value ? 'dark' : 'beesfqd_ai_logo';
        try {
            return new URL(`../assets/tb/${logoName}.svg`, import.meta.url).href;
        } catch (error) {
            console.error('Error loading logo:', logoName, error);
            return '';
        }
    }

    // 处理png文件
    if (name.endsWith('.png')) {
        try {
            return new URL(`../assets/tb/${name}`, import.meta.url).href;
        } catch (error) {
            console.error('Error loading png:', name, error);
            return '';
        }
    }

    // 处理svg文件
    try {
        return new URL(`../assets/tb/${name}.svg`, import.meta.url).href;
    } catch (error) {
        console.error('Error loading icon:', name, error);
        return '';
    }
}

const toggleIconMode = () => {
    const containers = document.querySelectorAll('.icon-container');
    const isDarkMode = document.body.classList.contains('dark-mode');

    containers.forEach(container => {
        if (isDarkMode) {
            container.classList.remove('light-mode');
            container.classList.add('dark-mode');
        } else {
            container.classList.remove('dark-mode');
            container.classList.add('light-mode');
        }
    });
}

onMounted(() => {
    applyTheme()
    document.body.classList.toggle('dark-mode', isDark.value);
    toggleIconMode();
    fetchInviteUrl();

    // 监听测试事件
    window.addEventListener('test-logo-animation', () => {
        testLoading()
    })
})

// 监听主题变化，更新图标模式
watch(isDark, (newValue) => {
    document.body.classList.toggle('dark-mode', newValue);
    toggleIconMode();
})

const handleLogout = async () => {
    try {
        await userStore.logout()
    } catch (error) {
        console.error('退出登录失败:', error)
    }
}

const goToAccount = () => {
    router.push('/account')
}

// 监听路由变化，显示loading
watch(() => route.path, () => {
    loading.value = true
    // 延迟关闭loading，确保页面内容加载完成
    setTimeout(() => {
        loading.value = false
    }, 1200)
}, { immediate: true })

const testLoading = () => {
    loading.value = true
    // 2秒后关闭loading
    setTimeout(() => {
        loading.value = false
    }, 1200)
}
</script>

<style scoped>
.layout-container {
    height: 100vh;
    width: 100%;
    --dropdown-bg-color: v-bind(isDark.value ? 'var(--el-bg-color)' : '#E8E9E4');
    position: relative;
}

.el-aside {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-right: 1px solid v-bind(borderColor);
    background-color: v-bind(menuBgColor);
}

.logo-container {
    height: 60px;
    display: flex;
    padding: 0 20px;
    overflow: hidden;
    background-color: v-bind(menuBgColor);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    justify-content: center;
}

.el-menu {
    padding-top: 17.5px !important;
    padding-left: 20px !important;
    border-right: none !important;
    height: calc(100% - 60px);
    background-color: v-bind(menuBgColor) !important;
    transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-y: auto;
    overflow-x: hidden;
}

.menu-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    max-width: 150px;
}

.el-header {
    background-color: v-bind(menuBgColor);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom: 1px solid v-bind(borderColor);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-left {
    display: flex;
    align-items: center;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 20px;
}

.el-dropdown-link {
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: var(--el-text-color-primary);
    transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.invite-trigger {
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: var(--el-text-color-primary);
    transition: opacity 0.3s;
}

.invite-trigger:hover {
    opacity: 0.8;
}

.invite-icon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    /* 适配暗黑模式图标颜色，与 menu-icon 保持一致 logic */
    filter: v-bind(menuIconFilter);
}

.theme-button {
    background-color: v-bind(themeButtonBgColor);
    border: none;
    padding: 8px;
    height: 30px;
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px !important;
    transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-button:hover {
    background-color: v-bind(themeButtonHoverBgColor);
}

.theme-icon {
    width: 14px;
    height: 14px;
}

.el-main {
    background-color: v-bind(mainBgColor);
    padding: 20px;
    height: calc(100vh - 60px);
    overflow-y: auto;
    transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
}

:deep(.el-menu) {
    background-color: v-bind(menuBgColor) !important;
    border: none !important;
    transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.el-menu) {
    background-color: v-bind(menuBgColor) !important;
    border: none !important;
    transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.el-menu-item) {
    border-radius: 10px;
    height: 30px;
    width: 150px;
    margin: 0 auto;
    background-color: v-bind(menuBgColor) !important;
    color: v-bind(menuTextColor) !important;
    border-right: none !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 10px !important;

    &.is-active {
        background-color: rgba(255, 189, 51, 1) !important;
        color: v-bind(menuActiveTextColor) !important;
        border-right: none;

        .menu-icon {
            filter: brightness(0) invert(1);
        }

        &:hover {
            background-color: rgba(255, 189, 51, 1) !important;
            color: v-bind(menuActiveTextColor) !important;
        }
    }

    &:not(.is-active):hover {
        background-color: v-bind(menuHoverBgColor) !important;
    }
}

/* 彻底关闭菜单内文字与图标的过渡，避免闪烁 */
:deep(.el-menu),
:deep(.el-menu *),
:deep(.el-sub-menu__title),
:deep(.el-menu-item span),
:deep(.el-menu-item .el-icon) {
    transition: none !important;
}

:deep(.el-dropdown-menu),
:deep(.el-popper.is-pure.is-light) {
    background-color: var(--dropdown-bg-color) !important;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
}

:deep(.el-dropdown-menu__item) {
    background-color: var(--dropdown-bg-color) !important;
    color: v-bind(dropdownTextColor) !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    display: flex;
    align-items: center;
    padding: 8px 16px;
    font-size: 13px;
}

:deep(.el-dropdown-menu__item:hover) {
    background-color: v-bind(menuHoverBgColor) !important;
    color: #0078D9 !important;

    .icon-container .dropdown-icon {
        filter: invert(31%) sepia(100%) saturate(1954%) hue-rotate(197deg) brightness(96%) contrast(107%);
    }
}

.menu-icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    pointer-events: none;
    filter: v-bind(menuIconFilter);
}

.dropdown-icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    vertical-align: middle;
}

.icon-container {
    display: flex;
    align-items: center;
}

.icon-container:hover {
    color: #F9DE4A !important;
}

.icon-container:hover .dropdown-icon {
    filter: brightness(0) saturate(100%) invert(84%) sepia(31%) saturate(638%) hue-rotate(359deg) brightness(103%) contrast(107%) !important;
}

.icon-container.dark-mode .dropdown-icon {
    filter: brightness(0) invert(1);
}

.icon-container.light-mode .dropdown-icon {
    filter: invert(20%) sepia(0%) saturate(0%) hue-rotate(241deg) brightness(98%) contrast(94%);
}

.logo-icon {
    width: 120px;
    height: 30px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    margin: 17.5px 0 0 0;
}

:deep(.el-popper__arrow) {
    display: none !important;
}

:root {
    --el-dropdown-menu-bg-color: v-bind(dropdownBgColor);
}

/* 客服图标样式 */
.customer-service-icon {
    position: fixed;
    right: 20px;
    bottom: 30px;
    z-index: 1000;
    cursor: pointer;
    transition: all 0.3s ease;
}

.customer-service-icon {
    position: fixed;
    right: 20px;
    bottom: 30px;
    z-index: 1000;
    cursor: pointer;
    transition: all 0.3s ease;
}

.cs-icon {
    width: 48px;
    height: 48px;
    transition: all 0.3s ease;
}

.customer-service-icon:hover .cs-icon {
    transform: scale(1.1);
}

/* 第二个悬浮图标：显示 gh_b35daf1fe99b_258.jpg */
.customer-photo-icon {
    position: fixed;
    right: 20px;
    bottom: 100px;
    z-index: 1000;
    cursor: pointer;
    transition: all 0.3s ease;
}

.customer-photo-icon:hover .cs-icon {
    transform: scale(1.1);
}

/* 二维码样式 */
.qr-code {
    position: absolute;
    bottom: 0;
    right: 60px;
    animation: fadeIn 0.3s ease;
}

.qr-image {
    width: 232px;
    height: 263px;
    display: block;
    border-radius: 12px;
}

/* 仅为微信悬浮预览图添加圆角 */
.customer-photo-icon .qr-image {
    border-radius: 12px;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>