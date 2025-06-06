<template>
  <div class="theme-container">
    <div ref="maskRef" class="theme-mask"></div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { isDark } from '../utils/theme'

const maskRef = ref<HTMLElement | null>(null)

// 开始主题切换
const startTransition = async (event: MouseEvent) => {
  const { clientX, clientY } = event
  
  if (!maskRef.value) return

  // 设置遮罩层的位置和初始状态
  maskRef.value.style.top = clientY + 'px'
  maskRef.value.style.left = clientX + 'px'
  maskRef.value.style.display = 'block'
  
  // 计算最大扩散半径（取视口宽高的较大值）
  const radius = Math.max(
    Math.max(clientX, window.innerWidth - clientX),
    Math.max(clientY, window.innerHeight - clientY)
  )

  // 设置遮罩层颜色（与目标主题相反）
  maskRef.value.style.background = isDark.value ? '#ffffff' : '#141414'

  try {
    // 扩散动画
    await maskRef.value.animate(
      [
        {
          transform: 'translate(-50%, -50%) scale(0)',
          opacity: 0.8
        },
        {
          transform: `translate(-50%, -50%) scale(${radius * 2})`,
          opacity: 0.8
        }
      ],
      {
        duration: 400,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
      }
    ).finished

    // 等待一小段时间确保主题已切换
    await new Promise(resolve => setTimeout(resolve, 50))

    // 收缩动画
    await maskRef.value.animate(
      [
        {
          transform: `translate(-50%, -50%) scale(${radius * 2})`,
          opacity: 0.8
        },
        {
          transform: 'translate(-50%, -50%) scale(0)',
          opacity: 0
        }
      ],
      {
        duration: 400,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
      }
    ).finished
  } finally {
    // 重置遮罩层状态
    if (maskRef.value) {
      maskRef.value.style.display = 'none'
      maskRef.value.style.transform = 'translate(-50%, -50%) scale(0)'
      maskRef.value.style.opacity = '0'
    }
  }
}

// 暴露方法给父组件
defineExpose({
  startTransition
})
</script>

<style>
.theme-container {
  height: 100%;
  position: relative;
}

.theme-mask {
  position: fixed;
  display: none;
  width: 1px;
  height: 1px;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  pointer-events: none;
  z-index: 9999;
  opacity: 0;
  will-change: transform, opacity;
}

/* 移除根元素的过渡效果，避免与动画冲突 */
:root {
  transition: none !important;
}

/* 保留其他元素的过渡效果 */
:root * {
  transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              color 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}
</style> 