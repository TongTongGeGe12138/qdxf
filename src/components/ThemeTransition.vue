<template>
  <div class="theme-container">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// 开始主题切换
const startTransition = async (event: MouseEvent) => {
  const { clientX, clientY } = event
  
  // 计算最大扩散半径
  const radius = Math.hypot(
    Math.max(clientX, window.innerWidth - clientX),
    Math.max(clientY, window.innerHeight - clientY)
  )

  // 定义裁剪路径
  const clipPath = [
    `circle(0px at ${clientX}px ${clientY}px)`,
    `circle(${radius}px at ${clientX}px ${clientY}px)`
  ]

  // 应用动画
  document.documentElement.animate(
    {
      clipPath: clipPath
    },
    {
      duration: 450,
      easing: 'ease-in'
    }
  )
}

// 暴露方法给父组件
defineExpose({
  startTransition
})
</script>

<style>
.theme-container {
  height: 100%;
}
</style> 