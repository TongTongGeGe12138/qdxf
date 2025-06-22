<template>
  <div v-if="visible" class="cad-viewer-overlay" @click="handleOverlayClick">
    <div class="cad-viewer" @click.stop>
      <div class="cad-header">
        <span class="title">CAD查看器 - {{ fileName }}</span>
        <el-icon class="close-btn" @click="closeViewer"><Close /></el-icon>
      </div>
      <div id="ibp-2d-container" v-loading="loading" element-loading-text="CAD文件加载中..."></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Close } from '@element-plus/icons-vue';
import { getP2d } from '@/api/cad';
import { getMyResourcesInfo } from '@/api/resource';
import { EngineContext } from '@/vendor/CadEngine/EngineContext.js';

interface P2dResponse {
  Code: number;
  Msg: string;
  Data: string;
}

interface Props {
  visible: boolean;
  fileId: string;
  fileName: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:visible']);

const loading = ref(false);

// 监听visible变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    openCadViewer();
  } else {
    closeViewer();
  }
});

// 打开CAD查看器
const openCadViewer = async () => {
  if (!props.fileId) {
    ElMessage.error('文件ID不存在');
    return;
  }

  loading.value = true;
  
  try {
    // 获取文件信息
    const res = await getMyResourcesInfo(props.fileId);
    if (res.code !== 200 || !res.data.url) {
      ElMessage.error('获取文件信息失败');
      return;
    }

    await nextTick();
    const container = document.getElementById('ibp-2d-container');
    if (!container) {
      ElMessage.error('CAD容器不存在');
      return;
    }

    // 初始化CAD引擎
    EngineContext.AttachContainer(container);

    // 获取P2D文件
    try {
      // 添加超时处理
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('请求超时')), 30000); // 30秒超时
      });
      
      const p2dPromise = getP2d({ DwgUrl: res.data.url });
      const p2dRes = await Promise.race([p2dPromise, timeoutPromise]) as P2dResponse;
      
      if (p2dRes.Code === 0) {
        const finish = (e: any) => {
          if (e.isComplete === false) {
            ElMessage.error('该路径无法打开');
            loading.value = false;
            return;
          }
          if (e.isComplete === true) {
            EngineContext.ViewManager.ZoomToFit();
            EngineContext.LoadManager.removeEventListener('finish', finish);
            loading.value = false;
            EngineContext.init();
          }
        };
        
        EngineContext.LoadManager.addEventListener('finish', finish);
        EngineContext.LoadManager.LoadModel({
          url: p2dRes.Data,
          type: 'p2d',
        });
      } else {
        console.error('P2D接口返回错误:', p2dRes);
        ElMessage.error(p2dRes.Msg || '获取P2D文件失败');
        
        // 如果是dwg地址错误，尝试直接加载dwg文件
        if (p2dRes.Msg === 'dwg地址错误' && res.data.url) {
          ElMessage.info('尝试直接加载DWG文件...');
          EngineContext.LoadManager.LoadModel({
            url: res.data.url,
            type: 'dwg',
          });
        }
      }
    } catch (error) {
      console.error('P2D文件加载失败:', error);
      if (error instanceof Error && error.message === '请求超时') {
        ElMessage.error('P2D文件加载超时，请稍后重试');
      } else {
        ElMessage.error('获取P2D文件失败，请稍后重试');
      }
      
      // 尝试直接加载DWG文件作为备用方案
      try {
        ElMessage.info('尝试直接加载DWG文件...');
        EngineContext.LoadManager.LoadModel({
          url: res.data.url,
          type: 'dwg',
        });
      } catch (dwgError) {
        console.error('DWG文件加载也失败:', dwgError);
        ElMessage.error('无法加载CAD文件，请检查文件是否有效');
        loading.value = false;
      }
    }
  } catch (error) {
    console.error('打开CAD查看器失败:', error);
    ElMessage.error('打开CAD查看器失败');
    loading.value = false;
  }
};

// 关闭查看器
const closeViewer = () => {
  loading.value = false;
  if (EngineContext.Container) {
    EngineContext.Container.style.display = 'none';
  }
  emit('update:visible', false);
};

// 处理遮罩层点击
const handleOverlayClick = () => {
  closeViewer();
};

// 组件挂载时初始化EngineContext
onMounted(() => {
  nextTick(() => {
    EngineContext.init();
  });
});

// 组件卸载时清理
onUnmounted(() => {
  if (EngineContext.Container) {
    EngineContext.Container.style.display = 'none';
  }
});
</script>

<style scoped lang="less">
.cad-viewer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cad-viewer {
  width: 90%;
  height: 90%;
  background: var(--el-bg-color);
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  border: 1px solid var(--el-border-color-light);

  .cad-header {
    height: 48px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--el-border-color-light);
    background-color: var(--el-bg-color-overlay);

    .title {
      font-size: 16px;
      font-weight: 500;
      color: var(--el-text-color-primary);
    }

    .close-btn {
      font-size: 20px;
      color: var(--el-text-color-secondary);
      cursor: pointer;
      transition: color 0.3s;
      padding: 4px;
      border-radius: 4px;

      &:hover {
        color: var(--el-color-primary);
        background-color: var(--el-fill-color-light);
      }
    }
  }

  #ibp-2d-container {
    flex: 1;
    overflow: hidden;
    background-color: var(--el-bg-color);
    border-radius: 0 0 12px 12px;
    
    // 自定义loading圈圈颜色
    :deep(.el-loading-spinner) {
      .circular {
        .path {
          stroke: #F9DE4A !important;
        }
      }
    }
    
    // 更强的优先级选择器
    :deep(.el-loading-spinner .circular .path) {
      stroke: #F9DE4A !important;
    }
  }
}
</style> 