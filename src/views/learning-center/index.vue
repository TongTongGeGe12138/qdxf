<template>
  <div class="learning-center-container">
    <div class="page-title">学习中心</div>
    <div class="content">
      <!-- <el-empty description="内容建设中..." /> -->
      <div>
        <img src="@/assets/xxzx.png" alt="">
      </div>
      <!-- <div class="tabtitle">
        <div class="tabs">
          <div v-for="(tab, idx) in tabs" :key="tab" class="tab" :class="{ active: activeTab === idx }" @click="onTabClick(idx)">{{ tab }}</div>
        </div>
      </div> -->
      <div class="video-section">
        <div class="video-grid">
          <div class="video-card" v-for="item in videos" :key="item.id" @click="playVideo(item)">
            <div class="video-thumb">
              <img class="video-cover" :src="getPosterUrl(item.value)" alt="cover" @error="onPosterError" />
              <div class="play-icon"></div>
            </div>
            <!-- <div class="video-title">{{ item.title }}</div> -->
          </div>
        </div>
      </div>
      <el-dialog v-model="playerVisible" :title="'视频播放'" width="800px" :close-on-click-modal="false">
        <video
          v-if="currentVideo"
          ref="videoRef"
          controls
          autoplay
          preload="metadata"
          class="dialog-video"
          @error="onVideoError"
          :poster="currentVideo ? getPosterUrl(currentVideo.value) : ''"
        >
          <source v-if="isHevcSupported" :src="hevcUrl" type="video/mp4; codecs=hevc" />
          <source :src="h264Url" type="video/mp4; codecs=avc1.42E01E" />
          您的浏览器不支持HTML5视频播放。
        </video>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { isDark } from '@/utils/theme'

const titleColor = computed(() => isDark.value ? '#EDEDED' : '#13343C')
const borderColor = computed(() => isDark.value ? 'rgba(231, 231, 224, 0.2)' : 'rgba(0, 0, 0, 0.1)')
const tabTextColor = computed(() => isDark.value ? '#C4C4D3' : '#666666')
const tabActiveColor = computed(() => '#FFBD33')

interface VideoItem {
  id: number
  title: string
  value: string
}

// const tabs = ref<string[]>([
//   '通用',
//   '智能建筑',
//   '智能结构',
//   '智能给排水',
//   '智能暖通',
//   '智能电气',
//   '智能消防',
//   '智能停车',
//   '智能幕墙',
//   '景观园林',
//   '工程造价',
//   '智能建造',
//   '智能审查'
// ])
// const activeTab = ref<number>(0)
// const onTabClick = (idx: number) => {
//   activeTab.value = idx
// }

const videos = ref<VideoItem[]>([
  { id: 1, title: 'firealarm', value: 'firealarm' },
  { id: 2, title: 'firedoor_monitoring', value: 'firedoor_monitoring' },
  { id: 3, title: 'lighting_evacuation', value: 'lighting_evacuation' },
  { id: 4, title: 'lighting_evacuation', value: 'lighting_evacuation' },
  { id: 5, title: 'extinguishing', value: 'extinguishing' },
  { id: 6, title: 'firehose_extinguisher', value: 'firehose_extinguisher' },
  { id: 7, title: 'rain_water_curtain', value: 'rain_water_curtain' },
  { id: 8, title: 'sprinkler', value: 'sprinkler' },
])

const playerVisible = ref(false)
const currentVideo = ref<VideoItem | null>(null)

const playVideo = (item: VideoItem) => {
  currentVideo.value = item
  playerVisible.value = true
}

const videoRef = ref<HTMLVideoElement | null>(null)
const isHevcSupported = ref(true)
const hevcUrl = computed(() => currentVideo.value ? `https://work.beesfpd.com/tutorials/${currentVideo.value.value}_h265.mp4` : '')
const h264Url = computed(() => currentVideo.value ? `https://work.beesfpd.com/tutorials/${currentVideo.value.value}_h264.mp4` : '')

const checkHevcSupport = async () => {
  try {
    // 优先使用 MediaCapabilities API
    if ((navigator as any).mediaCapabilities?.decodingInfo) {
      const result = await (navigator as any).mediaCapabilities.decodingInfo({
        type: 'file',
        video: {
          contentType: 'video/mp4; codecs=hevc',
          width: 1920,
          height: 1080,
          bitrate: 3000000,
          framerate: 30
        }
      })
      isHevcSupported.value = !!result?.supported
      return
    }
    // 备用: canPlayType 检测
    const testVideo = document.createElement('video')
    const canPlay = testVideo.canPlayType('video/mp4; codecs=hevc')
    isHevcSupported.value = canPlay === 'probably' || canPlay === 'maybe'
  } catch {
    isHevcSupported.value = false
  }
}

const onVideoError = () => {
  // 如果 HEVC 播放失败，切换到 H.264
  if (isHevcSupported.value) {
    isHevcSupported.value = false
    nextTick(() => {
      videoRef.value?.load()
    })
  }
}

watch(playerVisible, async (visible) => {
  if (visible) {
    await nextTick()
    await checkHevcSupport()
    // 检测完成后刷新视频源
    nextTick(() => videoRef.value?.load())
  } else {
    // 关闭弹窗时重置
    isHevcSupported.value = true
    currentVideo.value = null
  }
})

// 预览图（Poster）使用本地 assets
const getPosterUrl = (value: string) => {
  try {
    return new URL(`../../assets/${value}.png`, import.meta.url).href
  } catch (e) {
    return ''
  }
}
const onPosterError = (e: Event) => {
  const img = e.target as HTMLImageElement
  if (img) img.style.display = 'none'
}
</script>

<style scoped lang="less">
.learning-center-container {
  padding: 20px;
  max-width: 1300px;
  margin: 0 auto;
  box-sizing: border-box;

  .page-title {
    font-size: 24px;
    color: v-bind(titleColor);
    // margin-bottom: 20px;
    margin-left: 20px;
  }
}

.content {
  border-radius: 8px;
  padding: 20px 20px;
  background: transparent;
}

.tabtitle {
//   padding: 10px 20px 0 20px;
padding-top: 20px;
}

.tabs {
  width: 1100px;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: center;
  height: 45px;
  border: 1px solid v-bind(borderColor);
  //   border-bottom: 1px solid v-bind(borderColor);
  //   padding-bottom: 10px;
}

.tab {
  font-size: 12px;
  color: v-bind(tabTextColor);
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  height: 45px;
  padding-left: 10px;
//   padding: 0 12px;


  &:hover {
    color: v-bind(tabActiveColor);
  }

  &.active {
    color: v-bind(tabActiveColor);
    font-weight: 500;
  }
}

.video-section {
  padding-top: 16px;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(4, 264px);
  gap: 16px;
}

.video-card {
  width: 264px;
  height: 134px;
  border: 1px solid v-bind(borderColor);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background: #00000010;
  cursor: pointer;
}

.video-thumb {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 100%);
}

.video-cover {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0,0,0,0.45);
  position: relative;
}

.play-icon::after {
  content: '';
  position: absolute;
  left: 15px;
  top: 10px;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 14px solid #fff;
}

.video-title {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 6px 8px;
  font-size: 12px;
  color: #fff;
  background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%);
}

.dialog-video {
  width: 100%;
  display: block;
  border-radius: 4px;
  border: 1px solid v-bind(borderColor);
}
</style>


