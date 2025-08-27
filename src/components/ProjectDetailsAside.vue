<template>
  <div class="project-aside">
    <div class="panel-title">项目详情</div>
    <div class="desc-row">
      <span class="label">项目名称：</span>
      <span class="value">{{ project?.name || '—' }}</span>
    </div>
    <div class="desc-row" v-if="project?.client !== undefined">
      <span class="label">建设方/委托方：</span>
      <span class="value">{{ project?.client || '—' }}</span>
    </div>
    <div class="desc-row">
      <span class="label">创建时间：</span>
      <span class="value">{{ project?.createdAt || '—' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

interface ProjectInfo {
  name?: string
  client?: string
  createdAt?: string
}

defineProps<{ project: ProjectInfo | null }>()
</script>

<style scoped>
.project-aside { padding: 0; }
.panel-title { font-size: 14px; margin-bottom: 12px; }
.desc-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 12px; }
.label { color: #A1A1A1; }
.value { text-align: right; max-width: 70%; word-break: break-all; }
</style>


