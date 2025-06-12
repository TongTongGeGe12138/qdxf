<template>
  <div class="login-container dark">
    <div class="login-card">
      <div class="left">
        <!-- <div class="logo">
          <img src="@/assets/tb/beesfqd_ai_logo.svg" alt="BeesFPD" />
          <h1>BeesFPD</h1>
        </div> -->
      </div>
      <div class="right">
        <div class="login-type-switch">
          <div 
            class="qrcode-switch"
            @click="loginType = loginType === 'account' ? 'qrcode' : 'account'"
          >
          <img src="@/assets/qrcode-scan.svg" alt="" class="QRcode"  v-if="loginType === 'account'" />
          <img src="@/assets/phone.svg" alt="" class="QRcode"  v-else />
          </div>
        </div>

        <!-- 账号密码登录 -->
        <template v-if="loginType === 'account'">
          <div class="logo">
            <img src="@/assets/sssss.svg" alt="BeesFPD" />
          </div>
          <h2>欢迎回来</h2>
          <p class="subtitle">即刻登录使用智能测绘</p>
          
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
            <el-form-item prop="username">
              <el-input 
                v-model="loginForm.username"
                placeholder="账户名/手机号"
                :class="{ 'error-input': errorMessages.username }"
              />
              <el-tooltip
                v-if="errorMessages.username"
                :content="errorMessages.username"
                placement="bottom"
                effect="dark"
                :show-after="0"
                :visible="true"
                :raw-content="false"
                :offset="8"
                :show-arrow="true"
                popper-class="error-tooltip"
              >
                <div class="error-trigger"></div>
              </el-tooltip>
            </el-form-item>
            
            <el-form-item prop="password">
              <el-input 
                v-model="loginForm.password"
                type="password"
                placeholder="请输入A-16位包含字母大小写及数字密码"
                show-password
                :class="{ 'error-input': errorMessages.password }"
              />
              <el-tooltip
                v-if="errorMessages.password"
                :content="errorMessages.password"
                placement="bottom"
                effect="dark"
                :show-after="0"
                :visible="true"
                :raw-content="false"
                :offset="8"
                :show-arrow="true"
                popper-class="error-tooltip"
              >
                <div class="error-trigger"></div>
              </el-tooltip>
            </el-form-item>

            <el-form-item>
              <el-checkbox v-model="loginForm.agreement" class="dark-checkbox">
                我已阅读并同意 <el-link type="primary" class="yellow-link">用户协议</el-link> 和 <el-link type="primary" class="yellow-link">隐私政策</el-link>
              </el-checkbox>
            </el-form-item>

            <el-button 
              type="primary" 
              class="login-button" 
              :loading="loading"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form>
        </template>

        <!-- 二维码登录 -->
        <template v-else>
          <div class="qrcode-container">
            <div class="logo">
            <img src="@/assets/sssss.svg" alt="BeesFPD" />
          </div>
            <h2>请使用微信扫码登录</h2>
            <div class="qrcode-box">
              <!-- <img src="@/assets/images/qr-code.png" alt="登录二维码" /> -->
            </div>
            <el-checkbox v-model="loginForm.agreement" class="dark-checkbox" style="font-size: 10px;">
                我已阅读并同意 <el-link type="primary" class="yellow-link">用户协议</el-link> 和 <el-link type="primary" class="yellow-link">隐私政策</el-link>
              </el-checkbox>
          </div>
        </template>

        <div class="login-footer">
          <el-link class="dark-link">没有账户？注册账号</el-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormItemProp } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const loginType = ref('account')

const loginForm = reactive({
  username: '',
  password: '',
  agreement: false
})

const errorMessages = reactive({
  username: '',
  password: ''
})

const loginRules = {
  username: [{ 
    required: true, 
    message: '请输入用户名', 
    trigger: 'blur',
    validateStatus: 'success'
  }],
  password: [{ 
    required: true, 
    message: '请输入密码', 
    trigger: 'blur',
    validateStatus: 'success'
  }],
  agreement: [{ 
    validator: (rule: any, value: boolean, callback: any) => {
      if (!value) {
        callback(new Error('请阅读并同意用户协议和隐私政策'))
      } else {
        callback()
      }
    },
    trigger: 'change',
    validateStatus: 'success'
  }]
}

const validateForm = async () => {
  if (!loginFormRef.value) return false
  
  try {
    let isValid = false
    await loginFormRef.value.validate((valid, fields) => {
      if (!valid && fields) {
        // 清空之前的错误信息
        errorMessages.username = ''
        errorMessages.password = ''
        
        // 设置新的错误信息
        Object.keys(fields).forEach(key => {
          if (key === 'username' || key === 'password') {
            const fieldErrors = fields[key]
            if (fieldErrors && fieldErrors.length > 0) {
              errorMessages[key as keyof typeof errorMessages] = fieldErrors[0].message || ''
            }
          }
        })
      }
      isValid = valid
    })
    return isValid
  } catch (error) {
    return false
  }
}

const handleLogin = async () => {
  loading.value = true
  const isValid = await validateForm()
  
  if (isValid) {
    // 模拟登录，只做路由跳转
    setTimeout(() => {
      loading.value = false
      router.push('/dashboard')
    }, 1000)
  } else {
    loading.value = false
  }
}

// 监听输入，清除对应的错误信息
watch(() => loginForm.username, () => {
  errorMessages.username = ''
})

watch(() => loginForm.password, () => {
  errorMessages.password = ''
})
</script>

<style scoped lang="less">
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;

  .login-card {
    width: 765px;
    height: 600px;
    display: flex;
    border-radius: 10px;
    overflow: hidden;
    
    .left {
      width: 380px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: url('@/assets/banner.jpg') no-repeat center center; 
      background-size: 100% 100%;
      
      .logo {
        text-align: center;
        img {
          width: 120px;
          height: 120px;
        }
        h1 {
          color: #fff;
          font-size: 32px;
          margin-top: 20px;
        }
      }
    }
    
    .right {
      width: 385px;
      height: 100%;
      background-color: #1a1a1a;
      padding: 50px 40px;
      box-sizing: border-box;
      position: relative;
      
    .QRcode {

      z-index: 0;
      width: 54px;
      height: 54px;
      cursor: pointer;
    }
    h2 {
      color: #fff;
      font-size: 24px;
      margin: 0;
      text-align: center;
    }
    p {
      text-align: center;
    }
      
      .subtitle {
        color: #999;
        font-size: 14px;
        margin: 10px 0 40px;
      }
    }
  }

  :deep(.el-input) {
    --el-input-bg-color: #2a2a2a;
    --el-input-border-color: transparent;
    --el-input-hover-border-color: transparent;
    --el-input-focus-border-color: transparent;
    --el-input-text-color: #fff;
    --el-input-placeholder-color: #666;
    
    .el-input__wrapper {
      box-shadow: none !important;
      
      &:hover {
        box-shadow: none !important;
      }
      
      &.is-focus {
        box-shadow: none !important;
      }
    }
    
    .el-input__inner {
      height: 45px;
      color: #FFF !important;
    }
  }

  :deep(.dark-checkbox) {
    --el-checkbox-text-color: #999;
    --el-checkbox-input-border-color: #666;
    --el-checkbox-checked-bg-color: #ffd60a;
    --el-checkbox-checked-text-color: #999;
    --el-checkbox-checked-input-border-color: #ffd60a;
    
    margin-bottom: 20px;

    .el-checkbox__label {
      color: #999;
    }
  }

  :deep(.dark-link) {
    --el-link-text-color: #999;
    --el-link-hover-text-color: #ffd60a;
    font-size: 14px;
  }

  .login-button {
    width: 100%;
    height: 45px;
    background-color: #ffd60a !important;
    border: none;
    font-size: 16px;
    color: #fff !important;
    
    &:hover {
      background-color: #e6c009;
    }

    &:focus, &:active {
      background-color: #e6c009;
    }
  }

  .login-footer {
    // margin-top: 20px;
    text-align: center;
    
    .el-divider {
      background-color: #333;
      margin: 0 10px;
    }
  }

  .error-trigger {
    position: absolute;
    left: 0;
    right: 0;
    height: 4px;
    bottom: -4px;
  }

  :deep(.error-tooltip) {
    --el-bg-color: #2a2a2a;
    --el-border-color: #333;
    --el-text-color-regular: #fff;
    --el-box-shadow: none;
    
    background: var(--el-bg-color) !important;
    border-color: var(--el-border-color) !important;
    padding: 6px 12px;
    font-size: 12px;
  }

  :deep(.el-popper.error-tooltip) {
    .el-popper__arrow {
      width: 10px;
      height: 10px;
      z-index: 1;
      
      &::before {
        position: absolute;
        width: 10px;
        height: 10px;
        background: var(--el-bg-color) !important;
        border: 1px solid var(--el-border-color) !important;
        transform: rotate(45deg);
        z-index: -1;
      }
    }
  }

  :deep(.el-popper.error-tooltip[data-popper-placement^='bottom']) {
    .el-popper__arrow {
      top: -5px;
      
      &::before {
        border-bottom: none !important;
        border-right: none !important;
      }
    }
  }

  :deep(.yellow-link) {
    --el-link-text-color: #ffd60a !important;
    --el-link-hover-text-color: #e6c009 !important;
    font-size: 10px !important;
    vertical-align: text-bottom !important;
    .el-checkbox__label {
      line-height: normal !important;
    }
    &:hover {
      color: #e6c009 !important;
    }
  }

  :deep(.el-popper.is-dark) {
    background: var(--el-popup-menu-background-color) !important;
    border-color: #333 !important;
    color: #fff;
  }

  :deep(.el-popper__arrow) {
    background: var(--el-popup-menu-background-color) !important;
    &::before {
      background: var(--el-popup-menu-background-color) !important;
      border-color: #333 !important;
    }
  }

  :deep(.el-form-item.is-error) {
    .el-input__wrapper {
      box-shadow: none !important;
    }
    
    .el-form-item__error {
      display: none;
    }
  }

  :deep(.el-input__wrapper) {
    box-shadow: none !important;
    
    &.is-focus {
      box-shadow: none !important;
    }
  }

  :deep(.error-input .el-input__wrapper) {
    box-shadow: none !important;
  }

  .el-form-item {
    margin-bottom: 30px;
    position: relative;
  }

  .login-type-switch {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 1;

    .qrcode-switch {
      position: absolute;
      top: -20px;
      right: -20px;
      width: 54px;
      height: 54px;
      cursor: pointer;
      clip-path: polygon(100% 0, 100% 100%, 0 0);

      &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(225deg, #ffd60a 50%, #2a2a2a 50%);
        z-index: 0;
      }

      .QRcode {
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
        padding: 16px;
        filter: brightness(0) invert(1);
        transition: all 0.3s;
      }

      &:hover {
        .QRcode {
          transform: scale(1.1);
        }
      }
    }
  }

  .qrcode-container {
    text-align: center;
    // padding-top: 40px;
    h2 {
        margin-top: 25px !important;
        text-align: center;
      }
    .qrcode-box {
      width: 180px;
      height: 180px;
      margin: 20px auto;
      padding: 10px;
      background: #2a2a2a;
      border-radius: 8px;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        right: -10px;
        top: -10px;
        width: 20px;
        height: 20px;
        background: url('@/assets/images/qr-corner.png') no-repeat center/contain;
      }


      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
}
</style> 