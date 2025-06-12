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
          <div class="qrcode-switch" @click="loginType = loginType === 'account' ? 'qrcode' : 'account'">
            <img src="@/assets/qrcode-scan.svg" alt="" class="QRcode" v-if="loginType === 'account'" />
            <img src="@/assets/phone.svg" alt="" class="QRcode" v-else />
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
            <el-form-item prop="account">
              <el-input v-model="loginForm.account" placeholder="账户名/手机号"
                :class="{ 'error-input': errorMessages.account }" />
              <el-tooltip v-if="errorMessages.account" :content="errorMessages.account" placement="bottom" effect="dark"
                :show-after="0" :visible="true" :raw-content="false" :offset="8" :show-arrow="true"
                popper-class="error-tooltip">
                <div class="error-trigger"></div>
              </el-tooltip>
            </el-form-item>

            <el-form-item prop="password">
              <el-input v-model="loginForm.password" type="password" placeholder="请输入A-16位包含字母大小写及数字密码" show-password
                :class="{ 'error-input': errorMessages.password }" />
              <el-tooltip v-if="errorMessages.password" :content="errorMessages.password" placement="bottom"
                effect="dark" :show-after="0" :visible="true" :raw-content="false" :offset="8" :show-arrow="true"
                popper-class="error-tooltip">
                <div class="error-trigger"></div>
              </el-tooltip>
            </el-form-item>

            <el-form-item>
              <el-checkbox v-model="loginForm.agreement" class="dark-checkbox">
                我已阅读并同意 <el-link type="primary" class="yellow-link">用户协议</el-link> 和 <el-link type="primary"
                  class="yellow-link">隐私政策</el-link>
              </el-checkbox>
            </el-form-item>

            <el-button type="primary" class="login-button" :loading="loading" @click="handleLogin">
              登录
            </el-button>
          </el-form>
        </template>

        <!-- 二维码登录 -->
        <template v-else-if="loginType === 'qrcode'">
          <div class="qrcode-container">
            <div class="logo">
              <img src="@/assets/sssss.svg" alt="BeesFPD" />
            </div>
            <h2>请使用微信扫码登录</h2>
            <div class="qrcode-box">
              <div id="login_container"></div>
            </div>
            <el-checkbox v-model="loginForm.agreement" class="dark-checkbox" style="font-size: 10px;">
              我已阅读并同意 <el-link type="primary" class="yellow-link">用户协议</el-link> 和 <el-link type="primary"
                class="yellow-link">隐私政策</el-link>
            </el-checkbox>
          </div>
        </template>

        <!-- 注册表单 -->
        <template v-else-if="loginType === 'register'">
          <div class="logo">
            <img src="@/assets/sssss.svg" alt="BeesFPD" />
          </div>
          <h2 class="form-title">注册账号</h2>
          <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" class="login-form">
            <el-form-item prop="mobile">
              <el-input v-model="registerForm.mobile" placeholder="输入手机号" 
                :class="{ 'error-input': errorMessages.mobile }" />
              <el-tooltip v-if="errorMessages.mobile" :content="errorMessages.mobile" placement="bottom" effect="dark"
                :show-after="0" :visible="true" :raw-content="false" :offset="8" :show-arrow="true"
                popper-class="error-tooltip">
                <div class="error-trigger"></div>
              </el-tooltip>
            </el-form-item>

            <el-form-item prop="password">
              <el-input v-model="registerForm.password" type="password" placeholder="请输入6-16位包含字母大小写及数字密码"
                show-password :class="{ 'error-input': errorMessages.password }" />
              <el-tooltip v-if="errorMessages.password" :content="errorMessages.password" placement="bottom" effect="dark"
                :show-after="0" :visible="true" :raw-content="false" :offset="8" :show-arrow="true"
                popper-class="error-tooltip">
                <div class="error-trigger"></div>
              </el-tooltip>
            </el-form-item>

            <el-form-item prop="confirmPassword">
              <el-input v-model="registerForm.confirmPassword" type="password" placeholder="确认密码" show-password 
                :class="{ 'error-input': errorMessages.confirmPassword }" />
              <el-tooltip v-if="errorMessages.confirmPassword" :content="errorMessages.confirmPassword" placement="bottom" effect="dark"
                :show-after="0" :visible="true" :raw-content="false" :offset="8" :show-arrow="true"
                popper-class="error-tooltip">
                <div class="error-trigger"></div>
              </el-tooltip>
            </el-form-item>

            <el-form-item prop="verifyCode" class="verify-code-item">
              <el-input v-model="registerForm.verifyCode" placeholder="输入验证码" 
                :class="{ 'error-input': errorMessages.verifyCode }" />
              <el-button type="text" class="get-code-btn" :disabled="countdown > 0" @click="sendVerifyCode">
                {{ sendCodeText }}
              </el-button>
              <el-tooltip v-if="errorMessages.verifyCode" :content="errorMessages.verifyCode" placement="bottom" effect="dark"
                :show-after="0" :visible="true" :raw-content="false" :offset="8" :show-arrow="true"
                popper-class="error-tooltip">
                <div class="error-trigger"></div>
              </el-tooltip>
            </el-form-item>

            <el-form-item prop="identity" label="您是尊贵的">
              <el-select
                v-model="registerForm.identity"
                placeholder="请选择专业身份"
                class="identity-select"
                filterable
              >
                <el-option
                  v-for="item in professionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item prop="description">
              <el-input v-model="registerForm.description" placeholder="若有分享码，请填写" />
            </el-form-item>

            <el-form-item>
              <el-checkbox v-model="registerForm.agreement" class="dark-checkbox">
                我已阅读并同意BeesFPD的 <el-link type="primary" class="yellow-link">用户协议</el-link> 和 <el-link type="primary"
                  class="yellow-link">隐私政策</el-link>
              </el-checkbox>
            </el-form-item>

            <el-button type="primary" class="login-button" :disabled="!registerForm.agreement" @click="handleRegister(registerFormRef)">
              注册登录
            </el-button>
          </el-form>
        </template>

        <div class="login-footer">
          <el-link class="dark-link" @click="loginType = 'register'" v-if="loginType != 'register'">没有账户？注册账号</el-link>
          <el-link class="dark-link" @click="loginType = 'account'" v-else>已有账户？登录</el-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, nextTick, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormItemProp } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { UserCenterLogin, UserCenterPostSendCode, GetUserCenterRegister } from '@/api/userCenter'
import { getProfessionList } from '@/api/dict'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

declare const WxLogin: any;

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const loginType = ref<'account' | 'qrcode' | 'register'>('account')

const loginForm = reactive({
  account: '',
  password: '',
  agreement: false
})

const registerForm = reactive({
  mobile: '',
  password: '',
  confirmPassword: '',
  verifyCode: '',
  identity: '',
  description: '',
  agreement: true
})

const registerFormRef = ref<FormInstance>()
const countdown = ref(0)
const sendCodeText = ref('获取验证码')
let timer: NodeJS.Timeout | null = null

const errorMessages = reactive({
  account: '',
  password: '',
  username: '',
  confirmPassword: '',
  mobile: '',
  verifyCode: ''
})

// 专业身份选项
const professionOptions = ref([])

// 获取专业身份列表
const loadProfessionList = async () => {
  try {
    console.log('开始获取专业身份列表')
    const res = await getProfessionList()
    console.log('专业身份列表返回结果：', res)
    if (res.code === 200 && res.data) {
      professionOptions.value = res.data
    } else {
      ElMessage.error('获取专业身份列表失败')
    }
  } catch (error) {
    console.error('获取专业身份列表错误：', error)
    ElMessage.error('获取专业身份列表失败')
  }
}

// 组件挂载时获取专业身份列表
onMounted(() => {
  loadProfessionList()
})

const loginRules = {
  account: [{
    required: true,
    message: '请输入账户名',
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

const registerRules = reactive({
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '请输入6-16位包含字母大小写及数字密码', trigger: 'blur' },
    { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,16}$/, message: '密码必须包含大小写字母和数字', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        console.log('验证确认密码：', value, registerForm.password)
        if (value !== registerForm.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  verifyCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 4, message: '验证码长度应为4位', trigger: 'blur' }
  ],
  identity: [
    { required: true, message: '请选择专业身份', trigger: 'change' }
  ]
})

const handleLogin = async () => {
  console.log(99999999999);
  
  loading.value = true
  const isValid = await validateForm(loginFormRef.value)

  if (isValid) {
    try {
      const response = await UserCenterLogin({
        account: loginForm.account,
        password: loginForm.password
      })

      // 输出登录响应日志
      console.log('登录响应数据：', response)

      if (response.code === 200) {
        // 存储用户信息
        userStore.setUserInfo({
          sessionId: response.data.sessionId,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          extra: response.data.extra
        })

        ElMessage.success('登录成功')
        router.push('/dashboard')
      } else {
        ElMessage.error(response.data.message || '登录失败，请检查账户名和密码')
      }
    } catch (error) {
      console.error('登录错误：', error)
      ElMessage.error('登录失败，请稍后重试')
    } finally {
      loading.value = false
    }
  } else {
    loading.value = false
  }
}

// 监听输入，清除对应的错误信息
watch(() => loginForm.account, () => {
  errorMessages.account = ''
})

watch(() => loginForm.password, () => {
  errorMessages.password = ''
})

// 初始化微信登录二维码
onMounted(() => {
  if (loginType.value === 'qrcode') {
    initWxLogin()
  }
})

// 监听登录类型变化
watch(loginType, (newType) => {
  if (newType === 'qrcode') {
    // 在下一个 tick 初始化二维码，确保容器已经渲染
    nextTick(() => {
      initWxLogin()
    })
  }
})

// 初始化微信登录
const initWxLogin = () => {
  const { hostname } = window.location;
  let signinUrl = 'signin';
  if (hostname === 'work-uat.gatherbee.cn') {
    signinUrl += '-uat';
  } else if (hostname === 'work.dev.ifeng.com') {
    signinUrl += '-sit';
  }
  const redirectUri = `https://www.gatherbee.cn/${signinUrl}`;

  new WxLogin({
    self_redirect: false,
    id: 'login_container',
    appid: import.meta.env.VITE_BASE_APP_ID,
    scope: 'snsapi_login',
    redirect_uri: redirectUri,
    state: 'from_wxweb',
    style: 'black',
    stylelite: 1,
    href: 'data:text/css;base64,LmltcG93ZXJCb3ggLnRpdGxlIHtkaXNwbGF5OiBub25lO30uaW1wb3dlckJveCAucXJjb2RlIHtib3JkZXI6IG5vbmU7d2lkdGg6IDIwMHB4O2hlaWdodDogMjAwcHg7fS5pbXBvd2VyQm94IC5pbmZve3dpZHRoOiAyMDlweH0uaW1wb3dlckJveCAud3JwX2NvZGV7d2lkdGg6IDEwMCU7fS5pbXBvd2VyQm94IHt3aWR0aDogMjA5cHg7fS5pbXBvd2VyQm94IC5pY29uMzhfbXNnIHtkaXNwbGF5OiBub25lO3dpZHRoOiA0NHB4O2hlaWdodDogNDRweDtiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO30uaW1wb3dlckJveCAuc3RhdHVzX3R4dCB7dGV4dC1hbGlnbjogY2VudGVyO30='
  })

  // 监听微信登录消息
  window.addEventListener('message', handleWxLoginMessage, false)
}

// 处理微信登录消息
const handleWxLoginMessage = (event: MessageEvent) => {
  console.log('收到微信登录消息：', event)

  // 判断消息来源
  if (event.origin !== 'https://open.work.weixin.qq.com') return

  // 解析消息数据
  const loginData = event.data
  if (loginData.wx_code) {
    // TODO: 这里处理微信登录逻辑
    console.log('微信登录成功，code:', loginData.wx_code)
    // 可以调用您的登录接口
    // await login(loginData.wx_code)
  }
}

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('message', handleWxLoginMessage)
})

const validateForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return false

  try {
    let isValid = false
    await formEl.validate((valid, fields) => {
      if (!valid && fields) {
        // 清空之前的错误信息
        errorMessages.account = ''
        errorMessages.password = ''

        // 设置新的错误信息
        Object.keys(fields).forEach(key => {
          if (key === 'account' || key === 'password') {
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

// 发送验证码
const sendVerifyCode = async () => {
  console.log(99999999999999999999);
  
  if (countdown.value > 0) return
  
  // 验证手机号
  const mobileValid = await validateField(registerFormRef.value, 'mobile')
  if (!mobileValid) {
    ElMessage.warning('请输入手机号码')
    return
  }

  try {
    console.log('开始发送验证码，手机号：', registerForm.mobile)
    const res = await UserCenterPostSendCode(registerForm.mobile)
    console.log('验证码发送结果：', res)
    
    if (res.code === 200) {
      ElMessage.success('验证码发送成功')
      
      // 开始倒计时
      countdown.value = 120
      sendCodeText.value = `${countdown.value}s后重新获取`
      
      timer = setInterval(() => {
        countdown.value--
        sendCodeText.value = `${countdown.value}s后重新获取`
        if (countdown.value <= 0) {
          sendCodeText.value = '获取验证码'
          if (timer) {
            clearInterval(timer)
            timer = null
          }
        }
      }, 1000)
    } else {
      ElMessage.error(res.message || '验证码发送失败')
    }
  } catch (error) {
    console.error('验证码发送错误：', error)
    ElMessage.error('验证码发送失败，请稍后重试')
  }
}

// 清理定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})

// 验证单个字段
const validateField = async (formEl: FormInstance | undefined, field: string): Promise<boolean> => {
  if (!formEl) return false
  
  try {
    console.log(`开始验证字段 ${field}`)
    await formEl.validateField(field)
    console.log(`字段 ${field} 验证通过`)
    return true
  } catch (error) {
    console.log(`字段 ${field} 验证失败:`, error)
    return false
  }
}

// 注册提交
const handleRegister = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  
  console.log('开始验证注册表单数据：', registerForm)
  await formEl.validate(async (valid, fields) => {
    console.log('表单验证结果：', valid)
    if (fields) {
      console.log('验证失败的字段：', fields)
    }
    if (valid) {
      try {
        console.log('开始调用注册接口，参数：', {
          phone: registerForm.mobile,
          code: registerForm.verifyCode,
          password: registerForm.password,
          utm: {
            source: 'referral',
            medium: 'offline',
            campaign: '',
            content: registerForm.description || 'dev',
            term: registerForm.identity || ''
          },
          referrer: 'string',
          wxOpen: {
            code: 'string'
          }
        })

        const res = await GetUserCenterRegister({
          phone: registerForm.mobile,
          code: registerForm.verifyCode,
          password: registerForm.password,
          utm: {
            source: 'referral',
            medium: 'offline',
            campaign: '',
            content: registerForm.description || 'dev',
            term: registerForm.identity || ''
          },
          referrer: 'string',
          wxOpen: {
            code: 'string'
          }
        })

        console.log('注册接口返回结果：', res)

        if (res.code === 200) {
          ElMessage.success('注册成功')
          // 注册成功后切换到登录状态
          loginType.value = 'account'
          // 自动填充登录表单
          loginForm.account = registerForm.mobile
          loginForm.password = registerForm.password
        } else {
          ElMessage.error(res.message || '注册失败')
        }
      } catch (error) {
        console.error('注册失败：', error)
        ElMessage.error('注册失败，请稍后重试')
      }
    } else {
      // 显示具体的验证错误信息
      let errorMsg = '请检查以下字段：'
      if (fields) {
        Object.keys(fields).forEach(key => {
          const fieldErrors = fields[key]
          if (fieldErrors && fieldErrors.length > 0) {
            errorMsg += `\n${key}: ${fieldErrors[0].message}`
          }
        })
        console.log(errorMsg)
        ElMessage.error(errorMsg)
      }
    }
  })
}

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

  .el-form-item {
    margin-bottom: 10px;
    position: relative;
    height: 40px !important;

    :deep(.el-form-item__label) {
      color: #fff;
      font-size: 14px;
      line-height: 40px;
      margin-bottom: 4px;
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
      height: 40px !important;
      background-color: #2a2a2a !important;

      &:hover {
        box-shadow: none !important;
      }

      &.is-focus {
        box-shadow: none !important;
      }
    }

    .el-input__inner {
      height: 40px !important;
      line-height: 40px !important;
      color: #FFF !important;
    }
  }

  :deep(.dark-checkbox) {
    --el-checkbox-text-color: #999;
    --el-checkbox-input-border-color: #666;
    --el-checkbox-checked-bg-color: #ffd60a;
    --el-checkbox-checked-text-color: #999;
    --el-checkbox-checked-input-border-color: #ffd60a;

    .el-checkbox__label {
      color: #999;
      font-size: 10px !important;
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
    color: #000 !important;

    &:hover {
      background-color: #e6c009;
    }

    &:focus,
    &:active {
      background-color: #e6c009;
    }
  }

  .login-footer {
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
    vertical-align: baseline;
    line-height: 1;
    display: inline-flex;
    align-items: center;

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
    padding: 20px 0;

    h2 {
      margin: 25px 0;
      text-align: center;
    }

    .qrcode-box {
      width: 220px;
      height: 220px;
      margin: 20px auto 40px;
      padding: 0;
      background: #fff;
      border-radius: 8px;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;

      &::after {
        content: '';
        position: absolute;
        right: -10px;
        top: -10px;
        width: 20px;
        height: 20px;
        background: url('@/assets/images/qr-corner.png') no-repeat center/contain;
        z-index: 2;
      }

      #login_container {
        width: 100%;
        height: 100%;
        margin-right: 72px;
        padding-top: 30px;

        :deep(.wxqrcode) {
          width: 100% !important;
          height: 100% !important;
          box-sizing: border-box;
          background: transparent !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;

          .qrcode {
            width: 220px !important;
            height: 220px !important;
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
          }

          canvas {
            width: 220px !important;
            height: 220px !important;
            display: block !important;
          }

          .status {
            display: none !important;
          }

          .qrcode-area {
            margin: 0 !important;
            border: none !important;
            background: transparent !important;
          }
        }
      }
    }
  }

  .verify-code-item {
    position: relative;
    
    .get-code-btn {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: #ffd60a;
      font-size: 14px;
      z-index: 2;
      border: none !important;
      background: none !important;
      padding: 0;
      box-shadow: none !important;
      
      &:disabled {
        color: #666;
      }

      &:hover,
      &:focus {
        background: none !important;
        border: none !important;
        color: #e6c009;
      }
    }
  }

  .form-title {
    font-size: 24px;
    color: #fff;
    text-align: center;
    margin-bottom: 20px;
  }

  :deep(.el-select) {
    width: 100%;
    
    .el-input {
      width: 100%;
    }

    .el-input__wrapper {
      background-color: #2a2a2a !important;
    }
    
    .el-select__popper {
      background-color: #1a1a1a !important;
      border: 1px solid #333;
      
      .el-select-dropdown__item {
        color: #fff;
        height: 40px;
        line-height: 40px;
        
        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        &.selected {
          background-color: #ffd60a;
          color: #000;
        }
      }
    }
  }
}
</style>