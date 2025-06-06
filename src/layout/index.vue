<template>
    <el-container class="layout-container">
        <ThemeTransition ref="themeTransitionRef" />
        <el-aside :width="isCollapse ? '64px' : '200px'">
            <div class="logo-container">
                <el-icon :size="32" :color="menuTextColor">
                    <Monitor />
                </el-icon>
                <span v-show="!isCollapse" class="logo-text">BeesFQD</span>
            </div>
            <el-menu :default-active="route.path" class="el-menu-vertical" :collapse="isCollapse" router
                :background-color="menuBgColor" :text-color="menuTextColor" :active-text-color="menuActiveTextColor">
                <el-menu-item index="/dashboard">
                    <el-icon>
                        <component :is="route.meta.icon" />
                    </el-icon>
                    <span>{{ route.meta.title }}</span>
                </el-menu-item>
            </el-menu>
        </el-aside>

        <el-container>
            <el-header height="60px">
                <div class="header-left">
                    <!-- <el-button type="text" @click="toggleCollapse">
                        <el-icon :size="20">
                            <Fold v-if="!isCollapse" />
                            <Expand v-else />
                        </el-icon>
                    </el-button> -->
                </div>
                <div class="header-right">
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            <el-avatar :icon="UserFilled" />
                            个人中心
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item>个人信息</el-dropdown-item>
                                <el-dropdown-item>退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <el-switch v-model="darkMode" class="theme-switch" inline-prompt :active-icon="Moon"
                        :inactive-icon="Sunny" @click="handleThemeSwitch" />
                </div>
            </el-header>

            <el-main>
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Fold, Expand, Moon, Sunny, UserFilled, Monitor } from '@element-plus/icons-vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { isDark, toggleDark, applyTheme } from '../utils/theme'
import ThemeTransition from '../components/ThemeTransition.vue'

const route = useRoute()
const isCollapse = ref(false)
const themeTransitionRef = ref()

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
const menuBgColor = computed(() => isDark.value ? '#1d1e1f' : 'rgba(231, 232, 235, 1)')
const menuTextColor = computed(() => isDark.value ? '#a3a6ad' : '#606266')
const menuActiveTextColor = computed(() => '#fff')
const menuHoverBgColor = computed(() => isDark.value ? '#2d2e2f' : '#f6f7f9')
const borderColor = computed(() => isDark.value ? '#414243' : '#e4e7ed')

const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value
}

const handleThemeSwitch = (event: MouseEvent) => {
    // 获取开关元素的位置
    const switchEl = event.target as HTMLElement
    const rect = switchEl.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    
    // 触发过渡动画
    if (themeTransitionRef.value) {
        themeTransitionRef.value.startTransition({ clientX: x, clientY: y })
    }
    
    toggleDark()
}

onMounted(() => {
    applyTheme()
})
</script>

<style scoped>
.layout-container {
    height: 100vh;
    width: 100%;
}

.el-aside {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    border-right: 1px solid v-bind(borderColor);
    background-color: v-bind(menuBgColor);
}

.logo-container {
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    overflow: hidden;
    background-color: v-bind(menuBgColor);
    border-bottom: 1px solid v-bind(borderColor);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    .logo-text {
        font-size: 20px;
        font-weight: bold;
        color: v-bind(menuTextColor);
        margin-left: 12px;
        white-space: nowrap;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
}

.el-menu {
    border-right: none !important;
    height: calc(100% - 60px);
    background-color: v-bind(menuBgColor) !important;
    transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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

.el-dropdown-link .el-icon {
    margin-left: 4px;
}

.theme-switch {
    margin-right: 8px;
}

.el-main {
    background-color: v-bind(menuBgColor);
    padding: 20px;
    height: calc(100vh - 60px);
    overflow-y: auto;
    transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.el-menu) {
    background-color: v-bind(menuBgColor) !important;
    border: none !important;
    transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.el-menu-item) {
    border-radius: 20px;
    height: 30px;
    margin-left: 20px;
    background-color: v-bind(menuBgColor) !important;
    color: v-bind(menuTextColor) !important;
    border-right: none !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;

    .el-icon {
        color: v-bind(menuTextColor) !important;
        transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &.is-active {
        background-color: rgba(255, 189, 51, 1) !important;
        color: v-bind(menuActiveTextColor) !important;
        border-right: none;

        .el-icon {
            color: v-bind(menuActiveTextColor) !important;
        }
    }

    &:hover {
        background-color: v-bind(menuHoverBgColor) !important;
    }
}

:deep(.el-dropdown-menu) {
    background-color: v-bind(menuBgColor) !important;
    border: 1px solid v-bind(borderColor) !important;
}

:deep(.el-dropdown-menu__item) {
    color: v-bind(menuTextColor) !important;
    background-color: v-bind(menuBgColor) !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;

    &:hover {
        background-color: v-bind(menuHoverBgColor) !important;
        color: v-bind(menuActiveTextColor) !important;
    }
}

:deep(.el-switch__core) {
    background-color: v-bind(menuBgColor) !important;
    border-color: v-bind(borderColor) !important;
}

:deep(.el-switch.is-checked .el-switch__core) {
    background-color: #141414 !important;
    border-color: #141414 !important;
}

:deep(.el-switch__core .el-switch__inner .is-icon) {
    color: v-bind(menuTextColor) !important;
}

:deep(.el-switch.is-checked .el-switch__core .el-switch__inner .is-icon) {
    color: #fff !important;
}
</style>