<template>
  <el-config-provider :locale="currentLocale">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import { onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useI18n } from 'vue-i18n'
// @ts-ignore
import zhCN from 'element-plus/dist/locale/zh-cn.mjs'
// @ts-ignore
import en from 'element-plus/dist/locale/en.mjs'

const userStore = useUserStore()
const { locale } = useI18n()

const currentLocale = computed(() => {
  return locale.value === 'zh' ? zhCN : en
})

onMounted(() => {
  // 加载存储的用户信息
  userStore.loadUserInfo()
})
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

#app {
  height: 100%;
  width: 100%;
}
</style>
