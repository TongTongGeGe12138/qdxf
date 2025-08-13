<template>
  <div class="dwg-to-pdf-bg">
    <div class="dwg-to-pdf-top">
      <h1 class="main-title">{{ title }}</h1>
      <p class="main-desc">{{ desc }}</p>
      <el-upload
        class="upload-area"
        drag
        :action="uploadAction"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="handleFileChange"
        :before-upload="beforeUpload"
        :accept="uploadAccept"
        :style="{ width: '859px', height: '363px' }"
      >
        <div class="upload-icon">
            <img src="/assets/upload-cloud-2-line.svg" alt="上传" style="width:48px;height:48px;" />
        </div>
        <div class="upload-text">{{ uploadText }}</div>
        <div class="upload-tip">{{ uploadTip }}</div>
      </el-upload>
      <div class="steps-title">{{ stepsTitle }}</div>
      <div class="steps">
        <div class="step" v-for="(step, idx) in steps" :key="idx">
          <div class="step-num">{{ idx + 1 }}</div>
          <div class="step-text" v-html="step"></div>
        </div>
      </div>
    </div>
    <div class="dwg-to-pdf-page">
      <div class="section-title main-title">{{ introTitle }}</div>
      <div class="desc-center">{{ introDesc }}</div>
      <div class="section">
        <div class="section-title section-title-core">核心优势</div>
        <ul class="feature-list">
          <li v-for="(item, idx) in features" :key="idx" v-html="item"></li>
        </ul>
      </div>
      <div class="section">
        <div class="section-title section-title-tech">技术保障</div>
        <ul class="feature-list">
          <li v-for="(item, idx) in techs" :key="idx" v-html="item"></li>
        </ul>
      </div>
      <div class="section">
        <div class="section-title section-title-faq">常见问题</div>
        <ul class="faq-list">
          <li v-for="(item, idx) in faqs" :key="idx" v-html="item"></li>
        </ul>
      </div>
    </div>
    <div class="footer">
      {{ footerText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { useUserStore } from '../stores/user'

const props = defineProps({
  title: String,
  desc: String,
  uploadAccept: String,
  uploadAction: String,
  maxSize: Number,
  uploadText: String,
  uploadTip: String,
  uploadIcon: { type: String, default: '' },
  stepsTitle: String,
  steps: Array,
  introTitle: String,
  introDesc: String,
  features: Array,
  techs: Array,
  faqs: Array,
  footerText: { type: String, default: '沪公网安备 31010702009578号 | 沪ICP备2021527689-3号 | Copyright © 上海蜂智擎人工智能技术有限公司版权所有' }
})
const userStore = useUserStore()
const beforeUpload = () => {
  if (!userStore.isLoggedIn) {
    window.location.href = '/login'
    return false
  }
  return true
}
const handleFileChange = (file: UploadFile) => {
  if (!file.size) return;
  if (props.maxSize && file.size > props.maxSize) {
    ElMessage.error(`单文件最大不超过${props.maxSize / 1024 / 1024}MB`)
  }
}
</script>

<style scoped>
/* 样式同 dwg-to-pdf.vue，保持一致 */
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
  padding: 40px 32px 24px 32px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.main-title {
  font-family: 'Source Sans Pro', 'sans-serif';
  font-weight: 700;
  font-size: 24px;
  color: #000000;
  text-align: center;
  margin-top: 80px;
  margin-bottom: 24px;
}
.main-desc {
  max-width: 780px;
  margin: 0 auto 24px auto;
  text-align: left;
  font-family: 'Source Sans Pro', 'sans-serif';
  font-weight: 400;
  font-size: 16px;
  color: #333333;
}
.desc-center {
  width: 100%;
  max-width: 780px;
  margin: 0 auto 24px auto;
  text-align: left;
  font-family: 'Source Sans Pro', 'sans-serif';
  font-weight: 400;
  font-size: 16px;
  color: #333333;
}
.section-title {
  text-align: center;
  font-family: 'Source Sans Pro', 'sans-serif';
  font-weight: 700;
  font-size: 24px;
  color: #000000;
}
.section-title.section-title-core {
  font-family: 'Source Sans Pro', 'sans-serif';
  font-weight: 700;
  font-size: 16px;
  color: #333333;
  text-align: left;
  margin-bottom: 8px;
  max-width:780px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 0;
}
.section-title.section-title-tech,
.section-title.section-title-faq {
  margin-top: 111px;
  margin-bottom: 24px;
}
.feature-list,
.faq-list {
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
  padding: 0;
  list-style: none;
  text-align: left;
}
.feature-list li,
.faq-list li {
  padding-left: 0;
  text-indent: 0;
  margin-bottom: 8px;
  text-align: left;
  box-sizing: border-box;
  font-size: 16px;
  color: #333333;
  font-family: 'Source Sans Pro', 'sans-serif';
}
.feature-list li {
  margin-bottom: 4px;
}
.faq-list {
  list-style: none;
  color: #444;
  font-size: 15px;
}
.faq-list li {
  margin-bottom: 4px;
}
.footer {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: #bbb;
  font-size: 13px;
  border-top: 1px solid #e5e6eb;
  margin-top: 0;
  word-break: break-all;
  background: #fff;
  position: relative;
  box-sizing: border-box;
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
.steps-title {
  font-family: 'Source Sans Pro', 'sans-serif';
  font-weight: 700;
  font-size: 24px;
  color: #000000;
  margin: 27px 0;
}
.steps {
  display: flex;
  justify-content: center;
  gap: 267px;
  margin-bottom: 88px;
  margin-top: 27px;
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
}
.step-num {
  width: 50px;
  height: 50px;
  background: #FABD33;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-family: 'Source Sans Pro', 'sans-serif';
  font-weight: 400;
  margin-bottom: 8px;
}
.step-text {
  text-align: center;
  color: #000000;
  font-size: 16px;
  font-family: 'Source Sans Pro', 'sans-serif';
  font-weight: 700;
  margin-top: 15px;
}
.step-text span {
  display: block;
  color: #888;
  font-size: 13px;
  margin-top: 22px;
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