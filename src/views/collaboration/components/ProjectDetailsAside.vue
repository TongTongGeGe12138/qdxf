<template>
  <div class="project-aside">
    <h3 class="aside-title">项目详情</h3>
    <div class="aside-item">
      <span class="label">名称：</span>
      <span class="value">{{ project?.name || '-' }}</span>
    </div>
    <div class="aside-item">
      <span class="label">创建时间：</span>
      <span class="value">{{ project?.createdAt || '-' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

interface ProjectItem {
  id?: string | number
  name?: string
  createdAt?: string
}

defineProps<{
  project: ProjectItem | null
}>()
</script>

<style scoped>
.project-aside {
  padding: 16px;
}

.aside-title {
  margin: 0 0 12px;
  font-size: 16px;
}

.aside-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 12px;
  margin-bottom: 10px;
}

.label {
  color: #A1A1A1;
}

.value {
  color: inherit;
}
</style>


