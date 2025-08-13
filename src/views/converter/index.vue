<template>
    <div class="special-page">
        <div class="top">
            <el-aside :width="isCollapse ? '64px' : '200px'" style="width: 100%; padding: 0; border: none; background: none;">
                <div class="top-flex-row">
                    <div class="logo-container">
                        <img :src="getIconUrl('beesfqd_ai_logo')" alt="BeesFQD Logo" class="logo-icon" @click="toGang" style="cursor: pointer;" />
                        <!-- 横向菜单（大屏） -->
                        <div class="menu-bar" v-show="!isMobile">
                            <span class="menu-item" :class="{ active: route.path === '/converter/intro' }" @click="goMenu('/dashboard')">智能消防建筑设计</span>
                            <span class="menu-item" :class="{ active: route.path === '/converter/pdf-to-cad' }" @click="goMenu('/converter/pdf-to-cad')">PDF 转 CAD</span>
                        </div>
                        <!-- 移动端下拉菜单 -->
                        <el-dropdown v-if="isMobile" trigger="click" v-model:visible="showMobileMenu">
                            <div class="mobile-menu-btn">
                                <img src="/assets/menu-line.svg" alt="菜单" style="width: 24px; height: 24px;" />
                            </div>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="handleMenuSelect('/converter/pdf-to-cad')">PDF 转 CAD</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                    <div class="header-right">
                        <template v-if="userStore.isLoggedIn">
                            <el-dropdown>
                                <span class="el-dropdown-link">
                                    <el-avatar :icon="UserFilled" size="small" style="margin-right: 10px;" />
                                    个人中心
                                </span>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="goToAccount">
                                            <div class="icon-container">
                                                <img :src="getIconUrl('zhgl')" alt="账户管理" class="dropdown-icon" />
                                            </div>
                                            账户管理
                                        </el-dropdown-item>
                                        <el-dropdown-item @click="toGang">
                                            <div class="icon-container">
                                                <img :src="getIconUrl('grzx')" alt="返回官网" class="dropdown-icon" />
                                            </div>
                                            返回官网
                                        </el-dropdown-item>
                                        <el-dropdown-item divided @click="handleLogout">
                                            <div class="icon-container">
                                                <img :src="getIconUrl('tcdl')" alt="退出登录" class="dropdown-icon" />
                                            </div>
                                            退出登录
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </template>
                        <template v-else>
                            <span class="login-btn" @click="goToLogin">登录/注册</span>
                        </template>
                        <!-- 临时测试按钮 -->
                        <!-- <el-button @click="testLoading" style="margin-right: 10px;">测试Loading</el-button> -->
                    </div>
                </div>
            </el-aside>
        </div>
        <router-view />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { UserFilled } from '@element-plus/icons-vue'
import { useUserStore } from '../../stores/user'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const goMenu = (path: string) => {
  if (route.path !== path) router.push(path)
}

const userStore = useUserStore()
const isCollapse = ref(false)

const goToAccount = () => {
    router.push('/account')
}
const toGang = () => {
    window.open('https://www.beesfpd.com/', '_blank');
}
const getIconUrl = (name: string) => {
    if (!name) return '';
    if (name === 'beesfqd_ai_logo') {
        try {
            return new URL(`../../assets/tb/beesfqd_ai_logo.svg`, import.meta.url).href;
        } catch (error) {
            return '';
        }
    }
    if (name.endsWith('.png')) {
        try {
            return new URL(`../../assets/tb/${name}`, import.meta.url).href;
        } catch (error) {
            return '';
        }
    }
    try {
        return new URL(`../../assets/tb/${name}.svg`, import.meta.url).href;
    } catch (error) {
        return '';
    }
}
const handleLogout = async () => {
    try {
        await userStore.logout()
    } catch (error) {
        console.error('退出登录失败:', error)
    }
}
const goToLogin = () => {
  const currentPath = router.currentRoute.value.fullPath
  router.push({ path: '/login', query: { redirect: currentPath } })
}

// 响应式判断是否为移动端
const isMobile = ref(false)

const handleResize = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth <= 600
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth <= 600
    window.addEventListener('resize', handleResize)
  }
})
onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize)
  }
})

const showMobileMenu = ref(false)
function handleMenuSelect(path: string) {
  showMobileMenu.value = false
  goMenu(path)
}
</script>

<style scoped>
.el-dropdown-link {
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: var(--el-text-color-primary);
    transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.special-page {
    min-height: 100vh;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    font-size: 22px;
    color: #333;
}

router-view,
.main-content {
  width: 100%;
  box-sizing: border-box;
}

.top {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    height: 68px;
    background: inherit;
    background-color: rgba(255, 255, 255, 1);
    box-sizing: border-box;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(215, 215, 215, 1);
    border-radius: 0px;
    filter: drop-shadow(none);
    transition: none;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 12px;
    color: #FAFAFA;
    display: flex;
    align-items: center;
}

.top-flex-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 68px;
}
.logo-container {
    flex: 1;
    display: flex;
    align-items: center;
    height: 100%;
}
.header-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
    height: 100%;
    gap: 20px;
    font-size: 14px;
    padding-right: 50px;
}

.logo-container {
    height: 60px;
    display: flex;
    padding: 0 20px;
    overflow: hidden;
    background-color: #fff;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    justify-content: flex-start;
}

.menu-icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    pointer-events: none;
}

.logo-icon {
    width: 120px;
    height: 30px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    margin: 0;
}
.login-btn {
  color: #4b5359;
  font-size: 14px;
  cursor: pointer;
  margin-right: 20px;
  transition: color 0.2s;
  font-family: inherit;
  padding-right: 30px;
}
.login-btn:hover {
  color: #0078d9;
  text-decoration: underline;
}
.menu-bar {
  display: flex;
  align-items: center;
  margin-left: 32px;
  gap: 24px;
  height: 100%;
}
.menu-item {
  color: #4b5359;
  font-size: 15px;
  cursor: pointer;
  font-family: inherit;
  font-weight: 400;
  padding: 0 2px;
  transition: color 0.2s, font-weight 0.2s;
}
.menu-item.active {
  color: #222;
  font-weight: 700;
  border-bottom: 2px solid #222;
  background: none;
}
.menu-item:hover {
  color: #0078d9;
}
.mobile-menu-btn {
  display: none;
  font-size: 15px;
  color: #0078d9;
  cursor: pointer;
  padding: 0 10px;
  align-items: center;
  height: 40px;
}

@media (max-width: 900px) {
  .top {
    height: 88px;
  }
  .top-flex-row {
    flex-direction: column;
    height: 88px;
    align-items: flex-start;
    padding: 0 4px;
  }
  .logo-container {
    padding: 0 6px;
    height: 48px;
  }
  .logo-icon {
    width: 90px;
    height: 24px;
  }
  .menu-bar {
    margin-left: 0;
    gap: 14px;
    height: 40px;
    overflow-x: auto;
    white-space: nowrap;
    font-size: 13px;
    padding-bottom: 2px;
  }
  .menu-item {
    font-size: 13px;
    padding: 0 1px;
  }
  .header-right {
    gap: 10px;
    font-size: 12px;
    height: 40px;
    margin-left: auto;
    margin-right: 8px;
  }
  .login-btn {
    font-size: 12px;
    margin-right: 8px;
    padding-right: 10px;
  }
}
@media (max-width: 600px) {
  .top {
    height: 48px;
  }
  .top-flex-row {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    padding: 0 4px;
    gap: 0;
  }
  .logo-container {
    flex: 1;
    display: flex;
    align-items: center;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 10px;
    height: 48px;
    padding: 0 6px 0 0;
    min-width: 0;
  }
  .header-right {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 11px;
    height: 32px;
    margin-left: 0;
    margin-right: 0;
    gap: 10px;
    padding: 0 6px;
    white-space: nowrap;
  }
  .mobile-menu-btn {
    display: flex !important;
    align-items: center;
    margin-left: 10px;
    height: 32px;
  }
  .logo-icon {
    width: 70px;
    height: 18px;
  }
  .menu-bar {
    display: none !important;
  }
  .mobile-menu-btn {
    display: flex !important;
  }
  .menu-item {
    font-size: 11px;
  }
  .header-right {
    font-size: 11px;
    height: 32px;
  }
  .login-btn {
    font-size: 11px;
    margin-right: 2px;
    padding-right: 4px;
  }
}
</style>