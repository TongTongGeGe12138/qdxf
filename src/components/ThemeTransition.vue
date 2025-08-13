<template>
  <div class="theme-container">
    <slot></slot>
  </div>
 </template>

<script setup lang="ts">
// 保留为空：Element Plus 官网风格采用全局颜色变量过渡，无需局部遮罩动画
</script>

<style>
.theme-container {
  height: 100%;
  position: relative;
}
</style>