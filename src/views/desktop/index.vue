<script setup lang="ts">
import { ref } from 'vue'
import { isDark } from '../../utils/theme'
import { computed } from 'vue'
import { Refresh, UploadFilled, FolderAdd, Search } from '@element-plus/icons-vue'

const title = ref('我的桌面')
const navtitle = ref(['我的项目', '我收藏的资源', '回收站'])
const activeIndex = ref(0)

const rightTabs = [
  { name: '刷新列表', icon: Refresh },
  { name: '上传文件', icon: UploadFilled },
  { name: '创建项目', icon: FolderAdd }
]
const rightActiveTab = ref(0)
const searchValue = ref('')

// 计算背景色
const cardBgColor = computed(() => isDark.value ? 'var(--el-bg-color-overlay)' : '#ffffff')
const menuTextColor = computed(() => isDark.value ? '#EDEDED' : '#13343C')
const navTextColor = computed(() => isDark.value ? '#EDEDED' : '#13343C')
const desktopBboder = computed(() => isDark.value ? 'rgba(231,231,224,.3)' : '#D7D7D7')
const subTextColor = computed(() => isDark.value ? '#A1A1A1' : '#A1A1A1')
const vTextColor = computed(() => isDark.value ? '#EDEDED' : '#13343C')
const borderColor = computed(() => isDark.value ? 'transparent' : 'rgba(228, 231, 237, 0.6)')
const menuBgColor = computed(() => isDark.value ? '#000' : '#ffffff')


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
        <!-- <el-empty description="暂无内容" /> -->
        <div class="dcontent-top">
          <div class="dcontent-top-left">
            <div class="dcontent-top-left-item" v-for="(item, index) in navtitle" :key="item"
              :class="{ active: activeIndex === index }" @click="activeIndex = index">
              <span>{{ item }}</span>
            </div>
          </div>
          <div class="dcontent-top-right">
            <el-input v-model="searchValue" placeholder="搜索" class="search-input" :prefix-icon="Search" clearable
              size="small" />
            <div class="right-tabs">
              <div v-for="(tab, idx) in rightTabs" :key="tab.name"
                :class="['right-tab', { active: rightActiveTab === idx }]" @click="rightActiveTab = idx">
                <el-icon :size="18" style="margin-right: 4px;">
                  <component :is="tab.icon" />
                </el-icon>
                <span>{{ tab.name }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="dcontent-cont">

        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="less">
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
  font-size: 24px;
  /* font-weight: bold; */
  margin-bottom: 20px;
  color: v-bind(menuTextColor);
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.desktop-content {
  min-height: 300px;
  color: var(--el-text-color-regular);
  border: 1px solid v-bind(desktopBboder);

  .dcontent-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 55px;
    padding: 20px 10px 20px 20px;
    border-bottom: 1px solid v-bind(desktopBboder);

    .dcontent-top-left {
      display: flex;
      align-items: center;

      .dcontent-top-left-item {
        font-size: 18px;
        color: v-bind(menuTextColor);
        cursor: pointer;
        margin-right: 30px;
        position: relative;
        padding: 0 2px;

        &:hover {
          opacity: 0.7;
        }

        &.active {
          font-weight: bold;

          &::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: -2px;
            right: -2px;
            height: 2px;
            background-color: #C4C4D3;
          }
        }

        span {
          color: #C4C4D3;
        }

        &:not(.active) span {
          color: #8E9094;
        }
      }
    }

    .dcontent-top-right {
      display: flex;
      align-items: center;
      gap: 16px;

      .search-input {
        width: 180px;
        margin-right: 16px;
        background: transparent;

        :deep(.el-input__wrapper) {
          // background-color: v-bind(menuBgColor);
          border: 1px solid v-bind(borderColor);
          border-radius: 5px;
          padding: 0 12px;
          height: 40px;
        }

        :deep(.el-input__inner) {
          color: v-bind(menuTextColor);
          height: 40px;
          font-size: 14px;
        }
      }

      :deep(.el-input__prefix) {
        color: v-bind(subTextColor);
      }

      .right-tabs {
        display: flex;
        align-items: center;
        gap: 8px;

        .right-tab {
          display: flex;
          align-items: center;
          font-size: 16px;
          color: #8E9094;
          cursor: pointer;
          padding: 0 10px;
          height: 32px;
          border-radius: 4px 4px 0 0;
          transition: color 0.2s, opacity 0.2s;
          opacity: 1;

          &:hover {
            opacity: 0.7;
          }

          &.active {
            color: #C4C4D3;
            font-weight: bold;
            position: relative;
            // &::after {
            //   content: '';
            //   position: absolute;
            //   left: 2px;
            //   right: 2px;
            //   bottom: -6px;
            //   height: 2px;
            //   background: #C4C4D3;
            //   border-radius: 1px;
            // }
          }
        }
      }
    }
  }
  .dcontent-cont{
    min-height: 540px;
  }
}
</style>