<template>
    <div class="smart-computing-container" :style="{ background: bannerBgColor }">
      <h2 class="title" :style="{ color: menuTextColor }">团队协同</h2>
      <div class="banner-box" :style="{ background: cardBgColor, borderColor: borderColor }">
        <img class="banner-img" :src="bannerImg" alt="智能运算banner" />
        <div class="banner-content">
          <div :style="{ color: menuTextColor, }" class="name">项目协作智慧中枢，消防设计效能引擎</div>
          <p class="ties" :style="{ color: menuTextColor,marginTop:'10px', }">聚焦消防建筑设计，精准锚定项目目标、拆解任务分工，多端协同处理图纸</p>
          <el-button type="warning" @click="handleApply" class="launch-btn">申请内测</el-button>
        </div>
      </div>
    </div>

    <!-- 申请内测弹框 -->
    <el-dialog
        v-model="applyDialogVisible"
        title="申请内测"
        width="400px"
        :close-on-click-modal="false"
    >
        <p style="text-align: left;">申请成功，若功能开放，将通过短信提醒您。</p>
        <template #footer>
          <span class="dialog-footer">
            <div class="dialog-button confirm" @click="handleApplyConfirm">我已知晓</div>
          </span>
        </template>
    </el-dialog>
  </template>
  
  <script setup lang="ts">
//   import { ElMessage } from 'element-plus'
  import { isDark } from '../../utils/theme'
  import { computed, ref } from 'vue'
  // 这里替换为智能运算的图片路径
  import bannerImg from '@/assets/tb/团队协同.png'
  
  const menuTextColor = computed(() => isDark.value ? '#EDEDED' : '#13343C')
  const cardBgColor = computed(() => isDark.value ? '#191919' : 'transparent')
  const bannerBgColor = computed(() => isDark.value ? '#000' : 'transparent')
  const borderColor = computed(() => isDark.value ? '#444' : '#D7D7D7')
  
  // 添加弹框显示状态
  const applyDialogVisible = ref(false)
  
  const handleApply = () => {
    applyDialogVisible.value = true
  }
  
  const handleApplyConfirm = () => {
    applyDialogVisible.value = false
    // ElMessage.success('申请成功，若功能开放，将通过短信提醒您。')
  }
  </script>
  
  <style scoped lang="less">
  .smart-computing-container {
    color: v-bind(menuTextColor);
    padding: 40px;
    min-height: 100vh;
    transition: background 0.3s;
    max-width: 900px;
    margin: 0 auto;
  }
  .title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 24px;
    transition: color 0.3s;
  }
  .banner-box {
    display: flex;
    align-items: center;
    border: 1px solid v-bind(borderColor);
    border-radius: 8px;
    padding: 32px;
    margin-bottom: 32px;
    transition: background 0.3s, border-color 0.3s;
  }
  .banner-img {
    width: 320px;
    margin-right: 30px;
  }
  .banner-content {
    flex: 1;

    .name {
      font-family: "PingFangSC-Semibold", "PingFang SC Semibold", "PingFang SC", sans-serif;
      font-weight: 650;
      font-style: normal;
      font-size: 20px;
      padding-left: 40px;
    }

    .ties {
      font-family: "PingFangSC-Regular", "PingFang SC", sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 12px;
    }
  }
  .banner-content h3 {
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 12px;
    transition: color 0.3s;
  }
  .banner-content p {
    margin-bottom: 24px;
    color: #ccc;
  }
  .desc {
    color: #ff0;
    font-size: 14px;
  }
  
.launch-btn {
    width: 150px;
    height: 40px;
    background: inherit;
    background-color: rgba(249, 222, 74, 1) !important;
    box-sizing: border-box;
    border: none;
    border-radius: 5px;
    filter: drop-shadow(none);
    transition: all 0.3s ease;
    font-family: "PingFangHK-Semibold", "PingFang HK Semibold", "PingFang HK", sans-serif;
    font-weight: 650;
    font-style: normal;
    color: #000 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    cursor: pointer;
    margin-left: 90px;
    margin-top: 50px;
}

.launch-btn:hover {
    background-color: rgba(249, 222, 74, 0.8);
    color: #000;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(249, 222, 74, 0.3);
}

.launch-btn:active {
    transform: translateY(0);
    box-shadow: none;
}

// 弹框样式
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  .dialog-button {
    padding: 8px 20px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;

    &.cancel {
      background-color: #F5F5F5;
      color: #666666;
      border: 1px solid #E4E4E4;

      &:hover {
        background-color: #E8E8E8;
        border-color: #D4D4D4;
      }
    }

    &.confirm {
      background-color: rgba(249, 222, 74, 1);
      color: #1B2126;

      &:hover {
        background-color: rgba(249, 222, 74, 0.8);
      }
    }
  }
}

// 深色主题弹框样式
html.dark {
  .dialog-footer {
    .dialog-button {
      &.cancel {
        background-color: #2B2B2B;
        color: #C4C4D3;
        border: 1px solid #3B3B3B;

        &:hover {
          background-color: #3B3B3B;
          border-color: #4B4B4B;
        }
      }

      &.confirm {
        background-color: rgba(249, 222, 74, 1);
        color: #1B2126;

        &:hover {
          background-color: rgba(249, 222, 74, 0.8);
        }
      }
    }
  }
}
  </style> 