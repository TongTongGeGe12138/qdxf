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
        <!-- 动画容器，绝对定位覆盖表单 -->
        <transition name="fade-out">
          <div
            v-show="!showLoginForm"
            ref="animationContainer"
            class="animation-overlay"
          ></div>
        </transition>
        <!-- 登录表单容器始终渲染 -->
        <div style="width: 280px;">
          <!-- <div class="login-type-switch">
            <el-tooltip :content="loginType === 'account' ? '扫码登录' : '手机登录'" placement="left" effect="dark" popper-class="custom-tooltip">
              <div class="qrcode-switch" @click="loginType = loginType === 'account' ? 'qrcode' : 'account'">
                <img :src="loginType === 'account' ? qrcodeIcon : phoneIcon" alt="" class="QRcode" />
              </div>
            </el-tooltip>
          </div> -->

          <!-- 账号密码登录 -->
          <template v-if="loginType === 'account'">
            <div class="logo">
              <img :src=ssss alt="BeesFPD" />
            </div>
            <h2>欢迎回来</h2>
            <p class="subtitle">即刻登录使用智能绘制</p>

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
                  <span style="font-size: 10px; color: #A1A1A1;">我已阅读并同意</span>
                  <el-link type="primary" class="yellow-link" style="color: #FFEA65 !important; font-size: 10px !important; margin: 0 2px;" @click="openAgreement('user')" @dblclick="openAgreement('user')" @contextmenu.prevent="openAgreement('user')">用户协议</el-link>
                  <span style="font-size: 10px; color: #A1A1A1;">和</span>
                  <el-link type="primary" class="yellow-link" style="color: #FFEA65 !important; font-size: 10px !important; margin: 0 2px;" @click="openAgreement('privacy')" @dblclick="openAgreement('privacy')" @contextmenu.prevent="openAgreement('privacy')">隐私政策</el-link>
                </el-checkbox>
              </el-form-item>

              <el-button type="primary" class="login-button" :loading="loading" :disabled="!loginForm.agreement" @click="handleLogin" style="background-color: #ff9900 !important; color: #000 !important; border: none !important; transition: background-color 0.3s;">
                登录
              </el-button>
            </el-form>
          </template>

          <!-- 二维码登录 -->
          <template v-else-if="loginType === 'qrcode'">
            <div class="qrcode-container">
              <div class="logo">
                <img :src=ssss alt="BeesFPD" />
              </div>
              <h2>请使用微信扫码登录</h2>
              <div class="qrcode-box">
                <div id="login_container"></div>
              </div>
              <el-checkbox v-model="loginForm.agreement" class="dark-checkbox">
                <span style="font-size: 10px; color: #A1A1A1;">我已阅读并同意</span>
                <el-link type="primary" class="yellow-link" style="color: #FFEA65 !important; font-size: 10px !important; margin: 0 2px;" @click="openAgreement('user')" @dblclick="openAgreement('user')" @contextmenu.prevent="openAgreement('user')">用户协议</el-link>
                <span style="font-size: 10px; color: #A1A1A1;">和</span>
                <el-link type="primary" class="yellow-link" style="color: #FFEA65 !important; font-size: 10px !important; margin: 0 2px;" @click="openAgreement('privacy')" @dblclick="openAgreement('privacy')" @contextmenu.prevent="openAgreement('privacy')">隐私政策</el-link>
              </el-checkbox>
            </div>
          </template>

          <!-- 注册表单 -->
          <template v-else-if="loginType === 'register'">
            <div class="logo" >
              <img :src="ssss" alt="BeesFPD" />
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

              <el-form-item prop="identity" >
                <el-select
                  v-model="registerForm.identity"
                  placeholder="您是尊贵的"
                  class="identity-select"
                  filterable
                  popper-class="dark-select-dropdown"
                  clearable
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

              <el-form-item >
                <el-checkbox v-model="registerForm.agreement" class="dark-checkbox">
                  <span style="font-size: 10px; color: #A1A1A1;">我已阅读并同意</span>
                  <el-link type="primary" class="yellow-link" style="color: #FFEA65 !important; font-size: 10px !important; margin: 0 2px;" @click="openAgreement('user')" @dblclick="openAgreement('user')" @contextmenu.prevent="openAgreement('user')">用户协议</el-link>
                  <span style="font-size: 10px; color: #A1A1A1;">和</span>
                  <el-link type="primary" class="yellow-link" style="color: #FFEA65 !important; font-size: 10px !important; margin: 0 2px;" @click="openAgreement('privacy')" @dblclick="openAgreement('privacy')" @contextmenu.prevent="openAgreement('privacy')">隐私政策</el-link>
                </el-checkbox>
              </el-form-item>

              <el-button type="primary" class="login-button" :disabled="!registerForm.agreement" @click="handleRegister(registerFormRef)" style="background-color: #ff9900 !important; color: #000 !important; border: none !important; transition: background-color 0.3s;">
                注册登录
              </el-button>
            </el-form>
          </template>

          <!-- 忘记密码表单 -->
          <template v-else-if="loginType === 'forgot'">
            <div class="logo">
              <img :src="ssss" alt="BeesFPD" />
            </div>
            <h2 class="form-title" style="margin-bottom: 20px;">找回密码</h2>
            <el-form ref="forgotFormRef" :model="forgotForm" :rules="forgotRules" class="login-form" >
              <el-form-item prop="mobile">
                <el-input v-model="forgotForm.mobile" placeholder="输入手机号" 
                  :class="{ 'error-input': errorMessages.mobile }" />
                <el-tooltip v-if="errorMessages.mobile" :content="errorMessages.mobile" placement="bottom" effect="dark"
                  :show-after="0" :visible="true" :raw-content="false" :offset="8" :show-arrow="true"
                  popper-class="error-tooltip">
                  <div class="error-trigger"></div>
                </el-tooltip>
              </el-form-item>

              <el-form-item prop="verifyCode" class="verify-code-item">
                <el-input v-model="forgotForm.verifyCode" placeholder="输入验证码" 
                  :class="{ 'error-input': errorMessages.verifyCode }" />
                <el-button type="text" class="get-code-btn" :disabled="countdown > 0" @click="sendForgotVerifyCode">
                  {{ sendCodeText }}
                </el-button>
                <el-tooltip v-if="errorMessages.verifyCode" :content="errorMessages.verifyCode" placement="bottom" effect="dark"
                  :show-after="0" :visible="true" :raw-content="false" :offset="8" :show-arrow="true"
                  popper-class="error-tooltip">
                  <div class="error-trigger"></div>
                </el-tooltip>
              </el-form-item>

              <el-form-item prop="newPassword">
                <el-input v-model="forgotForm.newPassword" type="password" placeholder="请输入新密码"
                  show-password :class="{ 'error-input': errorMessages.password }" />
                <el-tooltip v-if="errorMessages.password" :content="errorMessages.password" placement="bottom" effect="dark"
                  :show-after="0" :visible="true" :raw-content="false" :offset="8" :show-arrow="true"
                  popper-class="error-tooltip">
                  <div class="error-trigger"></div>
                </el-tooltip>
              </el-form-item>

              <el-form-item prop="confirmPassword">
                <el-input v-model="forgotForm.confirmPassword" type="password" placeholder="确认新密码" show-password 
                  :class="{ 'error-input': errorMessages.confirmPassword }" />
                <el-tooltip v-if="errorMessages.confirmPassword" :content="errorMessages.confirmPassword" placement="bottom" effect="dark"
                  :show-after="0" :visible="true" :raw-content="false" :offset="8" :show-arrow="true"
                  popper-class="error-tooltip">
                  <div class="error-trigger"></div>
                </el-tooltip>
              </el-form-item>

              <el-button type="primary" class="login-button" @click="handleResetPassword(forgotFormRef)" style="background-color:#ff9900 !important; color: #000 !important; border: none !important; transition: background-color 0.3s;">
                重置密码
              </el-button>
            </el-form>
          </template>

          <div class="login-footer" v-if="loginType !== 'forgot'" style="margin-top: 20px;">
            <el-link class="dark-link" @click="loginType = 'forgot'" v-if="loginType === 'account'" style="font-size: 12px; color: #A1A1A1;">忘记密码？</el-link>
            <br v-if="loginType === 'account'" />
            <el-link class="dark-link" @click="loginType = 'register'" v-if="loginType != 'register'" style="margin-top: 10px;font-size: 12px; color: #A1A1A1;">没有账户？<span style="text-decoration: underline;">注册账号</span></el-link>
            <el-link class="dark-link" @click="loginType = 'account'" v-else style="font-size: 12px; color: #A1A1A1;">已有账户？登录</el-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, nextTick, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import type { FormInstance } from 'element-plus'
import { UserCenterLogin, UserCenterPostSendCode, GetUserCenterRegister, passwordEditSandCode, passwordEdit } from '@/api/userCenter'
import { getProfessionList } from '@/api/dict'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useFileLibraryStore } from '@/store/modules/fileLibrary'
// import qrcodeIcon from '@/assets/qrcode-scan.svg?url';
// import phoneIcon from '@/assets/phone.svg?url';
import ssss from '@/assets/tb/dark.svg?url';
import SimpleLoginAnimation from '@/utils/SimpleLoginAnimation.js'

declare const WxLogin: any;

// 类型定义
interface LoginForm {
  account: string
  password: string
  agreement: boolean
}

interface RegisterForm {
  mobile: string
  password: string
  confirmPassword: string
  verifyCode: string
  identity: string
  description: string
  agreement: boolean
}

interface ProfessionOption {
  value: string
  label: string
}

interface ErrorMessages {
  account: string
  password: string
  username: string
  confirmPassword: string
  mobile: string
  verifyCode: string
}

interface ForgotForm {
  mobile: string
  verifyCode: string
  newPassword: string
  confirmPassword: string
}

// interface ApiResponse<T> {
//   code: number
//   data: T
//   msg: string
//   time: number
// }

interface LoginError {
  password?: string[]
}

// 常量定义
const COUNTDOWN_TIME = 120
const MOBILE_REGEX = /^1[3-9]\d{9}$/
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,16}$/

// 组件实例
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const loginFormRef = ref<FormInstance>()
const registerFormRef = ref<FormInstance>()
const forgotFormRef = ref<FormInstance>()

// 响应式状态
const loading = ref(false)
const loginType = ref<'account' | 'qrcode' | 'register' | 'forgot'>('account')
const countdown = ref(0)
const sendCodeText = ref('获取验证码')
const professionOptions = ref<ProfessionOption[]>([])
const showLoginForm = ref(false)
const animationContainer = ref<HTMLElement | null>(null)
let animationInstance: any = null

// 协议弹窗状态
// const agreementModalVisible = ref(false)

// 表单数据
const loginForm = reactive<LoginForm>({
  account: '',
  password: '',
  agreement: true
})

const registerForm = reactive<RegisterForm>({
  mobile: '',
  password: '',
  confirmPassword: '',
  verifyCode: '',
  identity: '',
  description: '',
  agreement: true
})

const forgotForm = reactive<ForgotForm>({
  mobile: '',
  verifyCode: '',
  newPassword: '',
  confirmPassword: ''
})

const errorMessages = reactive<ErrorMessages>({
  account: '',
  password: '',
  username: '',
  confirmPassword: '',
  mobile: '',
  verifyCode: ''
})

// 表单验证规则
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
    validator: (_: any, value: boolean, callback: any) => {
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
    { pattern: MOBILE_REGEX, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '请输入6-16位包含字母大小写及数字密码', trigger: 'blur' },
    { pattern: PASSWORD_REGEX, message: '密码必须包含大小写字母和数字', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_rule: any, value: string, callback: any) => {
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

const forgotRules = reactive({
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: MOBILE_REGEX, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  verifyCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 4, message: '验证码长度应为4位', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 16, message: '请输入6-16位包含字母大小写及数字密码', trigger: 'blur' },
    { pattern: PASSWORD_REGEX, message: '密码必须包含大小写字母和数字', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (_rule: any, value: string, callback: any) => {
        if (value !== forgotForm.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// 定时器
let timer: NodeJS.Timeout | null = null

// 方法定义
const loadProfessionList = async () => {
  try {
    const res = await getProfessionList()
    if (res.code === 200 && res.data) {
      professionOptions.value = res.data.map((item: any) => ({
        value: item.value,
        label: item.name
      }))
    } else {
      // ElMessage.error('获取专业身份列表失败')
    }
  } catch (error) {
    console.error('获取专业身份列表错误：', error)
    // ElMessage.error('获取专业身份列表失败')
  }
}

const handleLogin = async () => {
  loading.value = true
  const isValid = await validateForm(loginFormRef.value)

  if (isValid) {
    try {
      const response = await UserCenterLogin({
        account: loginForm.account,
        password: loginForm.password
      })

      if (response.code === 200) {
        // 登录成功前，先清空所有旧数据
        const fileLibraryStore = useFileLibraryStore()
        userStore.clearUserInfo()
        fileLibraryStore.clearStore()
        
        userStore.setUserInfo({
          sessionId: response.data.sessionId,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          extra: response.data.extra
        })

        ElMessage.success('登录成功')
        const redirect = route.query.redirect as string
        console.log('登录后 redirect 参数：', redirect)
        if (redirect && typeof redirect === 'string' && redirect.startsWith('/')) {
          router.replace(redirect)
        } else {
          router.replace('/dashboard')
        }
      } else {
        if (response.data && (response.data as LoginError).password) {
          errorMessages.password = (response.data as LoginError).password![0]
        } else {
          ElMessage.error((response as any).msg || '登录失败，请稍后重试')
        }
      }
    } catch (error: any) {
      console.error('登录错误：', error)
      if (error.response && error.response.data) {
        const { data } = error.response
        if ((data as LoginError).password) {
          errorMessages.password = (data as LoginError).password![0]
        } else {
          ElMessage.error((data as any).msg || '登录失败，请稍后重试')
        }
      } else {
        // ElMessage.error('登录失败，请稍后重试')
      }
    } finally {
      loading.value = false
    }
  } else {
    loading.value = false
  }
}

const validateForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return false

  try {
    let isValid = false
    await formEl.validate((valid) => {
      isValid = valid
    })
    return isValid
  } catch (error) {
    return false
  }
}

const sendVerifyCode = async () => {
  if (countdown.value > 0) return
  
  const mobileValid = await validateField(registerFormRef.value, 'mobile')
  if (!mobileValid) {
    ElMessage.warning('请输入手机号码')
    return
  }

  try {
    const res = await UserCenterPostSendCode(registerForm.mobile)
    
    if (res.code === 200) {
      ElMessage.success('验证码发送成功')
      startCountdown()
    } else {
      ElMessage.error((res as any).msg || '验证码发送失败')
    }
  } catch (error) {
    console.error('验证码发送错误：', error)
    ElMessage.error('验证码发送失败，请稍后重试')
  }
}

const startCountdown = () => {
  countdown.value = COUNTDOWN_TIME
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
}

const validateField = async (formEl: FormInstance | undefined, field: string): Promise<boolean> => {
  if (!formEl) return false
  
  try {
    await formEl.validateField(field)
    return true
  } catch (error) {
    return false
  }
}

const handleRegister = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        const res = await GetUserCenterRegister({
          phone: registerForm.mobile,
          code: registerForm.verifyCode,
          password: registerForm.password,
          PwdTwo: registerForm.confirmPassword,
          profession:registerForm.identity || '',
          utm: {
            source: 'referral',
            // medium: 'offline',
            // campaign: '',
            // content: registerForm.description || 'dev',
            // term: registerForm.identity || ''
          },
        })

        if (res.code === 200) {
          ElMessage.success('注册成功')
          loginType.value = 'account'
          loginForm.account = registerForm.mobile
          loginForm.password = registerForm.password
        } else {
          ElMessage.error((res as any).msg || '注册失败')
        }
      } catch (error) {
        console.error('注册失败：', error)
        // ElMessage.error('注册失败，请稍后重试')
      }
    } else if (fields) {
      let errorMsg = '请检查以下字段：'
      Object.keys(fields).forEach(key => {
        const fieldErrors = fields[key]
        if (fieldErrors && fieldErrors.length > 0) {
          errorMsg += `\n${key}: ${fieldErrors[0].message}`
        }
      })
      ElMessage.error(errorMsg)
    }
  })
}

// 微信登录相关
const initWxLogin = () => {
  const { hostname } = window.location
  let signinUrl = 'signin'
  if (hostname === 'work-uat.gatherbee.cn') {
    signinUrl += '-uat'
  } else if (hostname === 'work.dev.ifeng.com') {
    signinUrl += '-sit'
  }
  const redirectUri = `https://www.gatherbee.cn/${signinUrl}`

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

  window.addEventListener('message', handleWxLoginMessage, false)
}

const handleWxLoginMessage = (event: MessageEvent) => {
  if (event.origin !== 'https://open.work.weixin.qq.com') return

  const loginData = event.data
  if (loginData.wx_code) {
    console.log('微信登录成功，code:', loginData.wx_code)
  }
}

// 监听器
watch(() => loginForm.account, () => {
  errorMessages.account = ''
})

watch(() => loginForm.password, () => {
  errorMessages.password = ''
})

watch(loginType, (newType) => {
  if (newType === 'qrcode') {
    nextTick(() => {
      initWxLogin()
    })
  }
})

// 生命周期钩子
onMounted(() => {
  animationInstance = new SimpleLoginAnimation({
    container: animationContainer.value,
    logo: {
      type: 'image',
      content: ssss,
      text: 'BeesFPD',
      highlight: 'FPD'
    },
    onComplete: () => {
      showLoginForm.value = true
    }
  })
  if (animationInstance.init()) {
    setTimeout(() => {
      animationInstance.start()
    }, 500)
  } else {
    showLoginForm.value = true
  }
  loadProfessionList()
  if (loginType.value === 'qrcode') {
    initWxLogin()
  }
})

onUnmounted(() => {
  window.removeEventListener('message', handleWxLoginMessage)
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  if (animationInstance) animationInstance.destroy()
})

const sendForgotVerifyCode = async () => {
  if (countdown.value > 0) return
  
  const mobileValid = await validateField(forgotFormRef.value, 'mobile')
  if (!mobileValid) {
    ElMessage.warning('请输入手机号码')
    return
  }

  try {
    const res = await passwordEditSandCode(forgotForm.mobile)
    
    if (res.code === 200) {
      ElMessage.success('验证码发送成功')
      startCountdown()
    } else {
      ElMessage.error((res as any).msg || '验证码发送失败')
    }
  } catch (error) {
    ElMessage.error('验证码发送失败，请稍后重试')
  }
}

const handleResetPassword = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        const res = await passwordEdit({
          phone: forgotForm.mobile,
          code: forgotForm.verifyCode,
          password: forgotForm.newPassword
        })

        if (res.code === 200) {
          ElMessage.success('密码重置成功')
          loginType.value = 'account'
          loginForm.account = forgotForm.mobile
        } else {
          ElMessage.error((res as any).msg || '密码重置失败')
        }
      } catch (error) {
        ElMessage.error('密码重置失败，请稍后重试')
      }
    } else if (fields) {  
      let errorMsg = '请检查以下字段：'
      Object.keys(fields).forEach(key => {
        const fieldErrors = fields[key]
        if (fieldErrors && fieldErrors.length > 0) {
          errorMsg += `\n${key}: ${fieldErrors[0].message}`
        }
      })
      ElMessage.error(errorMsg)
    }
  })
}

// 打开协议弹窗
const openAgreement = (type: 'user' | 'privacy') => {
  // 只在新窗口打开对应的协议页面
  const url = type === 'user' ? '/userAgreement.html' : '/privacyPolicy.html';
  window.open(url, '_blank');
}
</script>

<style lang="less" scoped>
// 变量定义
@primary-color: #FFBD33;
@text-color: #FFFFFF;
@bg-dark: #1a1a1a;
@bg-darker: #2a2a2a;
@text-gray: #999;
@border-color: #333;
@error-bg: #303133;
@error-border: #797979;

// 混入
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
  position: relative;

  .login-card {
    width: 900px;
    height: 600px;
    display: flex;
    border-radius: 10px;
    overflow: hidden;
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .left {
      width: 380px;
      min-width: 380px;
      height: 100%;
      .flex-center();
      background: url('@/assets/banner.jpg') no-repeat center center;
      background-size: 100% 100%;
      box-sizing: border-box;

      .logo {
        text-align: center;
        margin-top: 15px;

        img {
          width: 120px;
          height: 120px;
        }

        h1 {
          color: @text-color;
          font-size: 32px;
          margin-top: 20px;
        }
      }
    }

    .right {
      width: 520px;
      height: 100%;
      background-color: @bg-dark;
      padding: 20px 40px;
      box-sizing: border-box;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .logo {
        text-align: center;
        width: 263px;
        height: 64px;
        margin: 0 auto;
        
        img {
          width: 263px;
          height: 64px;
          object-fit: contain;
        }
      }

      .QRcode {
        z-index: 0;
        width: 54px;
        height: 54px;
        cursor: pointer;
      }

      h2 {
        margin-top: 25px;
        color: @text-color;
        font-size: 24px;
        margin: 0;
        text-align: center;
        margin-bottom: 10px;
      }

      .subtitle {
        color: @text-gray;
        font-size: 14px;
        margin: 10px 0 40px;
        text-align: center;
      }
    }
  }

  // 表单样式
  .el-form-item {
    margin-bottom: 10px;
    position: relative;
    height: 40px !important;

    :deep(.el-form-item__label) {
      color: @text-color;
      font-size: 14px;
      line-height: 40px;
      margin-bottom: 4px;
    }

    :deep(.el-form-item__error) {
      display: none;
    }
  }

  // 输入框样式
  :deep(.el-input) {
    --el-input-bg-color: @bg-darker;
    --el-input-border-color: transparent;
    --el-input-hover-border-color: transparent;
    --el-input-focus-border-color: transparent;
    --el-input-text-color: @text-color;
    --el-input-placeholder-color: #666;

    .el-input__wrapper {
      box-shadow: none !important;
      height: 40px !important;
      background-color: @bg-darker !important;

      &:hover, &.is-focus {
        box-shadow: none !important;
      }

      &.is-error {
        box-shadow: none !important;
      }
    }

    .el-input__inner {
      height: 40px !important;
      line-height: 40px !important;
      color: @text-color !important;
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

  // 复选框样式
  :deep(.dark-checkbox) {
    .el-checkbox__input {
      .el-checkbox__inner {
        border-radius: 50%;
        background-color: transparent;
        border-color: rgb(249, 222, 74);
      }
    }
  }

  // 协议链接样式
  :deep(.yellow-link) {
    position: relative;
    cursor: pointer;
  }

  // 按钮样式
  .login-button {
    width: 100%;
    height: 45px;
    background-color: #ff9900 !important;
    border: none;
    font-size: 16px;
    color: #000 !important;

    &:hover, &:focus, &:active {
      background-color: #ff9900 !important;
    }
  }

  // 登录页脚
  .login-footer {
    text-align: center;
    margin-top: 20px;
  }

  // 错误提示样式
  .error-trigger {
    position: absolute;
    left: 0;
    right: 0;
    height: 4px;
    bottom: -4px;
  }

  :deep(.error-tooltip) {
    --el-bg-color: @error-bg;
    --el-border-color: @error-border;
    --el-text-color-regular: @text-color;
    --el-box-shadow: none;

    background: var(--el-bg-color) !important;
    border-color: var(--el-border-color) !important;
    padding: 6px 12px;
    font-size: 12px;

    .el-popper__arrow {
      &::before {
        background: @error-bg !important;
        border-color: @error-border !important;
      }
    }
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
        background: @error-bg !important;
        border: 1px solid @error-border !important;
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

  // 登录类型切换
  // .login-type-switch {
  //   position: absolute;
  //   top: 20px;
  //   right: 20px;
  //   z-index: 1;

  //   .qrcode-switch {
  //     position: absolute;
  //     top: -20px;
  //     right: -20px;
  //     width: 54px;
  //     height: 54px;
  //     cursor: pointer;
  //     clip-path: polygon(100% 0, 100% 100%, 0 0);

  //     &::before {
  //       content: '';
  //       position: absolute;
  //       top: 0;
  //       right: 0;
  //       width: 100%;
  //       height: 100%;
  //       background: linear-gradient(225deg, @primary-color 50%, @bg-darker 50%);
  //       z-index: 0;
  //     }

  //     .QRcode {
  //       position: relative;
  //       z-index: 1;
  //       width: 100%;
  //       height: 100%;
  //       padding: 12px;
  //       filter: brightness(0) invert(1);
  //       transition: all 0.3s;
  //       transform: translate(2px, -2px);
  //     }

  //     &:hover {
  //       .QRcode {
  //         transform: scale(1.1);
  //       }
  //     }
  //   }
  // }

  // 二维码容器
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
      background: @text-color;
      border-radius: 8px;
      position: relative;
      overflow: hidden;
      .flex-center();

      &::after {
        content: '';
        position: absolute;
        right: -10px;
        top: -10px;
        width: 20px;
        height: 20px;
        // background: url('@/assets/images/qr-corner.png') no-repeat center/contain;
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
          .flex-center();

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

  // 验证码输入框
  .verify-code-item {
    position: relative;
    
    .get-code-btn {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: @primary-color;
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
        color: darken(@primary-color, 5%);
      }
    }
  }

  // 表单标题
  .form-title {
    font-size: 24px;
    color: @text-color;
    text-align: center;
    margin-bottom: 20px;
  }

  // 下拉选择框
  :deep(.el-select) {
    width: 100%;
    
    .el-input {
      width: 100%;
    }

    .el-select__wrapper {
      background-color: @bg-darker !important;
      box-shadow: none !important;
      height: 40px !important;

      &:hover, &.is-focus {
        box-shadow: none !important;
      }
    }

    .el-input__inner {
      height: 40px !important;
      line-height: 40px !important;
      color: @text-color !important;
    }
  }

  :deep(.dark-select-dropdown) {
    background-color: @bg-dark !important;
    border: 1px solid @border-color !important;
    
    .el-select-dropdown__item {
      color: @text-color!important;
      height: 40px!important;
      line-height: 40px!important;
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.1)!important;
      }
      
      &.selected {
        background-color: @primary-color !important;
        color: #000 !important;
      }
    }
  }

  // 添加选择框占位符样式
  :deep(.el-select .el-input__inner::placeholder) {
    color: #666;
  }

  // 动画渐隐过渡
  .fade-out-leave-active {
    transition: opacity 0.6s cubic-bezier(0.4,0,0.2,1);
  }
  .fade-out-leave-to {
    opacity: 0;
  }

  .animation-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    background: transparent;
    pointer-events: auto;
    border-radius: 10px;
    overflow: hidden;
    // transform: scale(1.05);

  }
}
</style>

<style lang="less">
// 错误提示框样式
.el-popper.error-tooltip {
  background-color: #303133 !important;
  border: 1px solid #797979 !important;
  color: #FFFFFF !important;
  font-size: 12px !important;
  padding: 6px 12px !important;

  .el-popper__arrow {
    &::before {
      background-color: #303133 !important;
      border: 1px solid #797979 !important;
    }
  }

  &[data-popper-placement^='bottom'] {
    .el-popper__arrow {
      &::before {
        border-bottom: none !important;
        border-right: none !important;
      }
    }
  }

  &[data-popper-placement^='top'] {
    .el-popper__arrow {
      &::before {
        border-top: none !important;
        border-left: none !important;
      }
    }
  }
}

// 右上角提示框样式
.el-popper.custom-tooltip {
  background-color: #FFBD33 !important;
  font-size: 12px !important;
  color: #FFFFFF !important;
  border: none !important;
  padding: 0 !important;
  width: 68px !important;
  height: 35px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;

  .el-tooltip__content {
    color: #FFFFFF !important;
    line-height: 35px !important;
  }

  .el-popper__arrow {
    &::before {
      background-color: #FFBD33 !important;
      border-right-color: #FFBD33 !important;
    }
  }
}

// 用户协议和隐私设置样式
.el-link.yellow-link {
  color: #FFEA65 !important;
  font-size: 12px !important;
  text-decoration: none !important;
  
  &:hover {
    color: #FFEA65 !important;
    text-decoration: underline !important;
  }
}
.el-link:hover:after{
  border-color :#FFEA65 !important;
}

// 登录和注册按钮样式
:deep(.el-button.login-button) {
  color: #000 !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  width: 100% !important;
  height: 40px !important;
  background-color: rgba(249, 222, 74, 1) !important;
  border: none !important;
  
  &:hover {
    background-color: rgba(255, 234, 101, 1) !important;
  }
  
  &:disabled {
    background-color: #CCCCCC !important;
    color: #FFFFFF !important;
  }
}

// 复选框文字样式
:deep(.dark-checkbox) {
  .el-checkbox__label {
    display: inline-flex !important;
    align-items: center !important;
    line-height: 1 !important;
  }
}

// 链接样式
:deep(.yellow-link) {
  display: inline-flex !important;
  align-items: center !important;
}

// 覆盖全局样式
:deep(.el-button--primary) {
  background-color: #FFBD33 !important;
  border-color: #FFBD33 !important;
  color: #FFFFFF !important;
}

:deep(.el-link--primary) {
  color: #FFEA65 !important;
}
</style>