<template>
    <div class="logo-loading-overlay" v-if="visible">
        <div class="logo-loading">
            <svg class="animated-logo" xmlns="http://www.w3.org/2000/svg" 
                 xmlns:xlink="http://www.w3.org/1999/xlink" 
                 viewBox="380 338 420 85" 
                 width="420" 
                 height="85">
              <g id="logo-group">
                <g id="logo-center" transform="translate(268.45547704999996 0)">
                  <g id="title" style="font-style:normal;font-weight:normal;font-size:72px;line-height:1;font-family:'Brandmark Sans 10';font-variant-ligatures:normal;text-align:center;text-anchor:middle" transform="translate(0 0)">
                    
                    <!-- B字母 -->
                    <path id="path200238" class="logo-path bees-letter" data-letter="B"
                          style="font-style:normal;font-weight:normal;font-size:72px;line-height:1;font-family:'Brandmark Sans 10';font-variant-ligatures:normal;text-align:center;text-anchor:middle" 
                          d="m 395.76725,-27.936 c 2.304,-2.376 3.816,-5.616 3.816,-9.216 0,-7.344 -5.976,-13.248 -13.248,-13.248 h -13.896 c -1.584,0 -2.952,1.368 -2.952,2.952 0,1.656 1.368,3.024 2.952,3.024 h 13.896 c 3.96,0 7.272,3.24 7.272,7.272 0,4.032 -3.312,7.272 -7.272,7.272 h -13.896 c -1.584,0 -2.952,1.296 -2.952,2.952 0,1.656 1.368,3.024 2.952,3.024 h 15.912 c 4.968,0 9,4.032 9,8.928 0,4.968 -4.032,9 -9,9 h -15.912 c -1.584,0 -2.952,1.368 -2.952,3.024 0,1.584 1.368,2.952 2.952,2.952 h 15.912 c 8.208,0 14.976,-6.696 14.976,-14.976 0,-5.544 -3.096,-10.368 -7.56,-12.96 z" 
                          stroke-linejoin="miter" stroke-miterlimit="2" 
                          :fill="beesColor" :stroke="beesColor" 
                          transform="translate(0 319.1212) translate(120.5 28.32800000000001) scale(1.43) translate(-369.48725 50.4)"/>
                    
                    <!-- 第一个e -->
                    <path id="path200240" class="logo-path bees-letter" data-letter="e"
                          style="font-style:normal;font-weight:normal;font-size:72px;line-height:1;font-family:'Brandmark Sans 10';font-variant-ligatures:normal;text-align:center;text-anchor:middle" 
                          d="m 448.28787,-21.672 c -1.224,-9.648 -9.288,-17.136 -19.08,-17.136 -10.584,0 -19.224,8.856 -19.224,19.8 0,10.872 8.64,19.728 19.224,19.728 5.976,0 11.30401,-2.736 14.76,-7.128 1.584,-1.944 0.144,-4.824 -2.30399,-4.824 -0.93601,0 -1.80001,0.432 -2.37601,1.152 -2.376,2.952 -6.048,4.824 -10.08,4.824 -4.536,0 -8.49599,-2.304 -10.944,-5.976 -1.008,-1.512 -1.728,-3.312 -2.08799,-5.184 h 29.66399 c 1.44,0 2.592,-1.152 2.592,-2.592 0,-0.936 -0.072,-1.8 -0.144,-2.664 z m -32.11199,0 c 1.22399,-6.336 6.55199,-11.16 13.03199,-11.16 6.48001,0 11.88,4.824 13.032,11.16 z" 
                          stroke-linejoin="miter" stroke-miterlimit="2" 
                          :fill="beesColor" :stroke="beesColor" 
                          transform="translate(0 319.1212) translate(178.41016659999997 44.904560000000004) scale(1.43) translate(-409.98387 38.808)"/>
                    
                    <!-- 第二个e -->
                    <path id="path200242" class="logo-path bees-letter" data-letter="e"
                          style="font-style:normal;font-weight:normal;font-size:72px;line-height:1;font-family:'Brandmark Sans 10';font-variant-ligatures:normal;text-align:center;text-anchor:middle" 
                          d="m 493.00662,-21.672 c -1.224,-9.648 -9.288,-17.136 -19.08,-17.136 -10.584,0 -19.224,8.856 -19.224,19.8 0,10.872 8.64,19.728 19.224,19.728 5.976,0 11.30401,-2.736 14.76,-7.128 1.584,-1.944 0.144,-4.824 -2.30399,-4.824 -0.93601,0 -1.80001,0.432 -2.37601,1.152 -2.376,2.952 -6.048,4.824 -10.08,4.824 -4.536,0 -8.49599,-2.304 -10.944,-5.976 -1.008,-1.512 -1.728,-3.312 -2.08799,-5.184 h 29.66399 c 1.44,0 2.592,-1.152 2.592,-2.592 0,-0.936 -0.072,-1.8 -0.144,-2.664 z m -32.11199,0 c 1.22399,-6.336 6.55199,-11.16 13.03199,-11.16 6.48001,0 11.88,4.824 13.032,11.16 z" 
                          stroke-linejoin="miter" stroke-miterlimit="2" 
                          :fill="beesColor" :stroke="beesColor" 
                          transform="translate(0 319.1212) translate(242.3579791 44.904560000000004) scale(1.43) translate(-454.70262 38.808)"/>
                    
                    <!-- s字母 -->
                    <path id="path200244" class="logo-path bees-letter" data-letter="s"
                          style="font-style:normal;font-weight:normal;font-size:72px;line-height:1;font-family:'Brandmark Sans 10';font-variant-ligatures:normal;text-align:center;text-anchor:middle" 
                          d="m 513.89337,-23.112 c -4.752,-1.728 -7.632,-3.024 -7.632,-5.4 0,-2.88 3.81601,-4.32 5.90401,-4.32 2.592,0 4.82399,1.224 5.616,3.096 0.648,1.512 2.44799,2.232 3.95999,1.584 1.512,-0.648 2.23201,-2.448 1.512,-3.96 -1.728,-4.104 -6.12,-6.696 -11.08799,-6.696 -4.968,0 -11.88001,3.6 -11.88001,10.296 0,6.696 6.408,9.072 11.52001,11.016 5.54399,2.088 8.13599,3.312 8.13599,6.12 0,2.304 -1.58399,6.12 -7.55999,6.12 -4.10401,0 -6.04801,-2.664 -6.98401,-4.896 -0.648,-1.512 -2.376,-2.232 -3.888,-1.584 -1.512,0.576 -2.304,2.376 -1.65599,3.888 2.23199,5.472 6.83999,8.568 12.528,8.568 8.928,0 13.53599,-6.048 13.53599,-12.096 0,-7.2 -6.624,-9.72 -12.024,-11.736 z" 
                          stroke-linejoin="miter" stroke-miterlimit="2" 
                          :fill="beesColor" :stroke="beesColor" 
                          transform="translate(0 319.1212) translate(306.5979692 44.904560000000004) scale(1.43) translate(-499.62569 38.808)"/>
                    
                    <!-- E字母 -->
                    <path id="path200246" class="logo-path etpid-letter" data-letter="E"
                          style="font-style:normal;font-weight:normal;font-size:72px;line-height:1;font-family:'Brandmark Sans 10';font-variant-ligatures:normal;text-align:center;text-anchor:middle" 
                          d="m 561.76887,-50.4 h -25.63199 c -1.58401,0 -2.952,1.368 -2.952,2.952 0,1.656 1.36799,3.024 2.952,3.024 h 25.63199 c 1.65601,0 3.024,-1.368 3.024,-3.024 0,-1.584 -1.36799,-2.952 -3.024,-2.952 z m -28.58399,47.448 c 0,1.584 1.36799,2.952 2.952,2.952 1.65599,0 3.024,-1.368 3.024,-2.952 v -20.232 h 18.72 c 1.65599,0 3.02399,-1.368 3.02399,-2.952 0,-1.656 -1.368,-3.024 -3.02399,-3.024 h -21.744 c -1.58401,0 -2.952,1.368 -2.952,3.024 z" 
                          stroke-linejoin="miter" stroke-miterlimit="2" 
                          :fill="etpidColor" :stroke="etpidColor" 
                          transform="translate(0 319.1212) translate(354.5876109 28.32800000000001) scale(1.43) translate(-533.18488 50.4)"/>
                    
                    <!-- T字母 -->
                    <path id="path200248" class="logo-path etpid-letter" data-letter="T"
                          style="font-style:normal;font-weight:normal;font-size:72px;line-height:1;font-family:'Brandmark Sans 10';font-variant-ligatures:normal;text-align:center;text-anchor:middle" 
                          d="m 591.27537,-50.4 h -17.99999 c -1.58401,0 -2.952,1.368 -2.952,2.952 0,1.656 1.36799,3.024 2.952,3.024 h 17.99999 c 4.896,0 8.92801,3.96 8.92801,8.856 0,4.896 -4.03201,8.928 -8.92801,8.928 h -17.99999 c -1.58401,0 -2.952,1.296 -2.952,2.952 v 20.736 c 0,1.584 1.36799,2.952 2.952,2.952 1.65599,0 3.024,-1.368 3.024,-2.952 v -17.712 h 14.97599 c 8.20801,0 14.90401,-6.696 14.90401,-14.904 0,-8.136 -6.696,-14.832 -14.90401,-14.832 z" 
                          stroke-linejoin="miter" stroke-miterlimit="2" 
                          :fill="etpidColor" :stroke="etpidColor" 
                          transform="translate(0 319.1212) translate(407.6956659000001 28.32800000000001) scale(1.43) translate(-570.32338 50.4)"/>
                    
                    <!-- PID字母 -->
                    <path id="path200250" class="logo-path etpid-letter" data-letter="PID"
                          style="font-style:normal;font-weight:normal;font-size:72px;line-height:1;font-family:'Brandmark Sans 10';font-variant-ligatures:normal;text-align:center;text-anchor:middle" 
                          d="m 617.24937,-50.4 c -1.58399,0 -2.952,1.368 -2.952,2.952 v 44.496 c 0,1.584 1.36801,2.952 2.952,2.952 1.65601,0 3.024,-1.368 3.024,-2.952 v -44.496 c 0,-1.584 -1.36799,-2.952 -3.024,-2.952 z m 8.208,47.448 c 0,1.584 1.368,2.952 3.024,2.952 h 1.80001 c 13.46399,0 24.408,-11.304 24.408,-25.2 0,-13.896 -10.94401,-25.2 -24.408,-25.2 h -1.80001 c -1.656,0 -3.024,1.368 -3.024,2.952 0,1.656 1.368,3.024 3.024,3.024 h 1.80001 c 10.15199,0 18.432,8.64 18.432,19.224 0,10.584 -8.28001,19.224 -18.432,19.224 h -1.80001 c -1.656,0 -3.024,1.368 -3.024,3.024 z" 
                          stroke-linejoin="miter" stroke-miterlimit="2" 
                          :fill="etpidColor" :stroke="etpidColor" 
                          transform="translate(0 319.1212) translate(470.57847160000006 28.32800000000001) scale(1.43) translate(-614.29737 50.4)"/>
                  </g>
                </g>
              </g>
            </svg>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { isDark } from '../utils/theme'

interface Props {
    visible: boolean
}

const props = defineProps<Props>()

// 计算颜色
const beesColor = computed(() => isDark.value ? '#f6f6f6' : '#333333')
const etpidColor = computed(() => '#c5ba1a')

// Logo动画相关函数
const animatePath = (path: SVGPathElement, delay: number = 0): Promise<void> => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            const pathLength = path.getTotalLength()
            
            // 设置初始状态
            path.style.setProperty('stroke-dasharray', pathLength.toString(), 'important')
            path.style.setProperty('stroke-dashoffset', pathLength.toString(), 'important')
            path.style.setProperty('fill-opacity', '0', 'important')
            path.style.setProperty('stroke-opacity', '0.7', 'important')
            path.style.setProperty('stroke-width', '1.5', 'important')
            
            // 强制重排
            path.getBoundingClientRect()
            
            // 描边动画 - 350ms
            path.style.setProperty('transition', 'stroke-dashoffset 350ms ease-out', 'important')
            path.style.setProperty('stroke-dashoffset', '0', 'important')
            
            // 描边完成后填充动画 - 200ms
            setTimeout(() => {
                path.style.setProperty('transition', 'fill-opacity 200ms ease-in-out, stroke-opacity 200ms ease-in-out', 'important')
                path.style.setProperty('fill-opacity', '1', 'important')
                path.style.setProperty('stroke-opacity', '0', 'important')
                
                setTimeout(() => {
                    resolve()
                }, 200)
            }, 350)
        }, delay)
    })
}

const startLogoAnimation = () => {
    const paths = document.querySelectorAll('.logo-path') as NodeListOf<SVGPathElement>
    
    // 重置所有路径
    paths.forEach((path, index) => {
        path.style.setProperty('transition', 'none', 'important')
        path.style.setProperty('stroke-dasharray', 'none', 'important')
        path.style.setProperty('stroke-dashoffset', '0', 'important')
        path.style.setProperty('fill-opacity', '0', 'important')
        path.style.setProperty('stroke-opacity', '0', 'important')
        path.style.setProperty('stroke-width', '0', 'important')
    })

    // 强制重排
    const logo = document.querySelector('.animated-logo') as HTMLElement
    if (logo) logo.offsetHeight
    
    // 字母间隔60ms
    const letterDelay = 60
    const animationPromises: Promise<void>[] = []
    paths.forEach((path, i) => {
        const delay = i * letterDelay
        animationPromises.push(animatePath(path, delay))
    })
    
    Promise.all(animationPromises).then(() => {
        // 动画完成后循环播放
        if (props.visible) {
            setTimeout(() => {
                if (props.visible) {
                    startLogoAnimation()
                }
            }, 1200)
        }
    })
}

// 监听visible变化
watch(() => props.visible, (newValue) => {
    if (newValue) {
        // 延迟启动动画，确保DOM已完全渲染
        nextTick(() => {
            setTimeout(() => {
                startLogoAnimation()
            }, 200)
        })
    }
}, { immediate: true })

// 监听主题变化，重新启动动画
watch(isDark, () => {
    if (props.visible) {
        // 短暂延迟后重新启动动画以应用新颜色
        setTimeout(() => {
            if (props.visible) {
                startLogoAnimation()
            }
        }, 100)
    }
})
</script>

<style scoped lang="less">
.logo-loading-overlay {
    position: fixed;
    top: 60px;
    left: 200px;
    right: 0;
    bottom: 0;
    width: calc(100vw - 200px);
    height: calc(100vh - 60px);
    background-color: v-bind('isDark ? "#000000" : "rgba(231, 232, 235, 1)"');
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-loading {
    text-align: center;
    padding: 2rem;
}

.animated-logo {
    width: 120px;
    height: auto;
    margin: 0 auto;
    display: block;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-path {
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill-opacity: 0;
    stroke-opacity: 0;
    transition: fill 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                stroke 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                fill-opacity 0.2s ease-in-out,
                stroke-opacity 0.2s ease-in-out,
                stroke-dashoffset 0.35s ease-out !important;
}
</style> 