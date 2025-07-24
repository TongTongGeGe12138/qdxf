<template>
  <div class="dwg-to-pdf-bg">
    <div class="dwg-to-pdf-top">
      <h1 class="main-title">CAD转PDF在线转换</h1>
      <p class="main-desc">支持DWG/DXF转PDF，100%本地在线操作，文件自动加密保护，无需安装客户端，一键上传，极速转换，保障您的文件与隐私</p>
      <el-upload
        class="upload-area"
        drag
        action="#"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="handleFileChange"
        accept=".dwg,.dxf"
        style="width: 859px; height: 363px;"
      >
        <div class="upload-icon">
          <img src="../../assets/upload-cloud-2-line.svg" alt="上传" style="width:48px;height:48px;" />
        </div>
        <div class="upload-text">将CAD图纸拖拽或点击上传文件</div>
        <div class="upload-tip">支持DWG/DXF文件，单文件最大不超过20MB</div>
      </el-upload>
      <div class="steps-title">如何免费将AutoCAD 转换为PDF</div>
      <div class="steps">
        <div class="step">
          <div class="step-num">1</div>
          <div class="step-text">上传文件<br /><span>支持DWG/DXF格式</span></div>
        </div>
        <div class="step">
          <div class="step-num">2</div>
          <div class="step-text">选择输出格式<br /><span>点击开始转换，支持PDF格式</span></div>
        </div>
        <div class="step">
          <div class="step-num">3</div>
          <div class="step-text">下载PDF<br /><span>转换完成后即可下载PDF文件</span></div>
        </div>
      </div>
    </div>
    <div class="dwg-to-pdf-page">
      <div class="section free-tool">
        <div class="section-title">免安装在线CAD转PDF工具：极速转换，无需安装</div>
        <div class="section-desc">支持AutoCAD的DWG与DXF格式文件，安全加密处理，支持批量转换，无需注册登录，转换后自动删除文件，保障您的隐私安全。</div>
        <ul class="feature-list">
          <li>✔ 支持DWG/DXF格式</li>
          <li>✔ 极速转换，支持批量</li>
          <li>✔ 文件自动加密保护</li>
          <li>✔ 转换后自动删除文件</li>
          <li>✔ 100%本地在线操作，保障隐私</li>
        </ul>
      </div>
      <div class="section tech-secure">
        <div class="section-title">技术保障</div>
        <div class="section-desc">数据传输全程加密，内核高效稳定，转换过程不存储文件</div>
      </div>
      <div class="section faq">
        <div class="section-title">常见问题</div>
        <ul class="faq-list">
          <li>支持哪些CAD格式？目前支持DWG、DXF格式。</li>
          <li>转换后的PDF会有水印吗？不会，输出PDF无水印。</li>
          <li>转换后文件会保存多久？转换完成后会自动删除，保障隐私。</li>
          <li>是否支持批量转换？支持，可一次上传多个文件。</li>
        </ul>
      </div>
      <div class="footer">© 2024 BeesFPD | 智能消防建筑设计平台 | Copyright 蜂鸟智造(苏州)科技有限公司苏ICP备2023015474号</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'
const handleFileChange = (file: UploadFile) => {
  if (!file.size) return;
  if (file.size > 20 * 1024 * 1024) {
    ElMessage.error('单文件最大不超过20MB')
  }
}
</script>

<style scoped>
.dwg-to-pdf-bg {
  width: 100%;
  min-height: 100vh;
  background-color: rgba(245, 246, 250, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.dwg-to-pdf-top {
  width: 100%;
  background: rgba(245, 246, 250, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 0;
}
.dwg-to-pdf-page {
  min-height: 60vh;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  padding: 40px 32px 24px 32px;
  margin: 0 auto 40px auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.main-title {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 12px;
  color: #222;
}
.main-desc {
  text-align: center;
  color: #666;
  font-size: 18px;
  margin-bottom: 32px;
}
/* 移除 .upload-area 样式，只保留 el-upload 默认样式 */
.upload-icon {
  margin-bottom: 12px;
}
.upload-text {
  font-size: 17px;
  color: #333;
  margin-bottom: 6px;
}
.upload-tip {
  color: #aaa;
  font-size: 13px;
}
.steps-title {
  font-size: 18px;
  font-weight: 600;
  margin: 32px 0 16px 0;
  color: #222;
  text-align: center;
}
.steps {
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-bottom: 32px;
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
}
.step-num {
  width: 32px;
  height: 32px;
  background: #ffe7b2;
  color: #ffb300;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}
.step-text {
  text-align: center;
  color: #333;
  font-size: 15px;
}
.step-text span {
  color: #888;
  font-size: 13px;
}
.section {
  margin-bottom: 32px;
}
.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #222;
  margin-bottom: 8px;
}
.section-desc {
  color: #666;
  font-size: 15px;
  margin-bottom: 8px;
}
.feature-list {
  list-style: none;
  padding: 0;
  margin: 0 0 0 8px;
  color: #2e7d32;
  font-size: 15px;
}
.feature-list li {
  margin-bottom: 4px;
}
.tech-secure .section-desc {
  color: #2d8cf0;
}
.faq-list {
  list-style: disc inside;
  color: #444;
  font-size: 15px;
  margin-left: 16px;
}
.footer {
  text-align: center;
  color: #bbb;
  font-size: 13px;
  margin-top: 32px;
}
.upload-area:deep(.el-upload-dragger) {
  height: 363px;
  width: 100%;
  min-height: unset;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
@media (max-width: 900px) {
  .dwg-to-pdf-top {
    padding-top: 20px;
  }
  .main-title {
    font-size: 22px;
  }
  .main-desc {
    font-size: 15px;
    margin-bottom: 18px;
  }
  .upload-area {
    width: 98vw !important;
    min-width: 0 !important;
    max-width: 100vw !important;
    height: 220px !important;
    border-radius: 10px;
  }
  .upload-area:deep(.el-upload-dragger) {
    height: 220px !important;
    min-height: unset;
    padding: 0 10px;
  }
  .steps {
    flex-direction: column;
    gap: 18px;
    align-items: center;
  }
  .step {
    width: 100%;
    max-width: 320px;
  }
  .dwg-to-pdf-page {
    padding: 18px 6px 12px 6px;
    margin: 0 auto 18px auto;
    border-radius: 8px;
  }
}
@media (max-width: 600px) {
  .main-title {
    font-size: 16px;
  }
  .main-desc {
    font-size: 13px;
  }
  .upload-area {
    height: 140px !important;
    border-radius: 6px;
  }
  .upload-area:deep(.el-upload-dragger) {
    height: 140px !important;
    border-radius: 6px;
    padding: 0 2px;
  }
  .dwg-to-pdf-page {
    padding: 8px 2px 6px 2px;
    border-radius: 4px;
  }
  .section-title {
    font-size: 15px;
  }
  .section-desc, .feature-list, .faq-list {
    font-size: 12px;
  }
}
</style> 