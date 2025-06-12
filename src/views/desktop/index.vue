<script setup lang="ts">
import { ref } from 'vue'
import { isDark } from '../../utils/theme'
import { computed } from 'vue'

const title = ref('我的桌面')

// 计算背景色
const cardBgColor = computed(() => isDark.value ? 'var(--el-bg-color-overlay)' : '#ffffff')
</script>

<template>
  <div class="desktop-container">
    <el-card class="box-card" :style="{ backgroundColor: cardBgColor }">
      <template #header>
        <div class="card-header">
          <span>{{ title }}</span>
        </div>
      </template>
      <div class="desktop-content">
        <!-- 这里可以添加桌面内容 -->
        <el-empty description="暂无内容" />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
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
}

.desktop-content {
  min-height: 300px;
  color: var(--el-text-color-regular);
}
</style> 