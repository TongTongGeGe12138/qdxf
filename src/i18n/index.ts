import { createI18n } from 'vue-i18n'

// Element Plus 的语言包
const zhCN = {
  el: {
    colorpicker: {
      confirm: '确认',
      clear: '清空'
    }
  }
}

const en = {
  el: {
    colorpicker: {
      confirm: 'Confirm',
      clear: 'Clear'
    }
  }
}

const messages = {
  en: {
    ...en,
    message: {
      // 错误提示
      loginExpired: 'Login session expired, please login again',
      reLogin: 'Please re-login',
      permissionDenied: 'No permission to access',
      resourceNotFound: 'Requested resource not found',
      serverError: 'Server error, please try again later',
      networkError: 'Network error, please check your connection',
      requestConfigError: 'Request configuration error',
      
      // 登录相关
      loginSuccess: 'Login successful',
      loginFailed: 'Login failed, please try again later',
      logoutSuccess: 'Logout successful',
      logoutFailed: 'Logout failed, please try again',
      passwordResetSuccess: 'Password reset successful',
      passwordResetFailed: 'Password reset failed',
      registerSuccess: 'Registration successful',
      registerFailed: 'Registration failed',
      
      // 通用
      success: 'Success',
      failed: 'Failed',
      error: 'Error',
      warning: 'Warning',
      info: 'Info',
      confirm: 'Confirm',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      save: 'Save',
      loading: 'Loading...',
      
      // 表单验证
      required: 'This field is required',
      invalidEmail: 'Invalid email format',
      invalidPhone: 'Invalid phone number',
      passwordMismatch: 'Passwords do not match',
      
               // 获取数据相关
               fetchDataFailed: 'Failed to fetch data',
               getPrimaryCategoryFailed: 'Failed to get primary category data',
               getSmartDrawing2DataFailed: 'Failed to get Smart Drawing 2.0 data',
               noData: 'No data available',
               
               // 导航栏
               personalCenter: 'Personal Center',
               accountManagement: 'Account Management',
               backToWebsite: 'Back to Website',
               logout: 'Logout',
               
               // Dashboard
               welcome: 'Welcome to use BeesFPD',
               smartDrawing2: 'Smart Drawing 2.0',
               newAlgorithm: 'New algorithm engine restructures underlying architecture, V2 algorithm boosts more scenarios',
               releaseNotes: 'Release Plan Notes',
               smartDrawing: 'Smart Drawing',
               smartDrawingDesc: 'Redefine fire protection engineering with intelligent design, solve fire point and line layout in five minutes',
               searchApps: 'Search for apps...',
               beesCAD: 'BeesCAD',
               beesCADDesc: 'Based on cloud architecture, completely independent intellectual property',
               cadConverter: 'CAD Converter',
               cadConverterDesc: 'CAD / PDF / Image conversion tool',
               smartBudget: 'Smart Budget',
               smartBudgetDesc: 'Smart measurement, accurate budget without worry',
               smartManagement: 'Smart Management',
               smartManagementDesc: 'Fire protection management, intelligent one-click control',
               equipment: 'Equipment',
               systemIntegration: 'System Integration',
               searchPlaceholder: 'Search applications...',
               refreshList: 'Refresh List',
               create: 'Create',
               permissionDenied2: 'Permission Denied',
               youDontHavePermission: 'You don\'t have permission to access this feature',
               moreApps: 'More Applications',
               cloudApps: 'Cloud applications focused on serving architectural design',
               
               // 菜单项
               smartApps: 'Smart Applications',
               myDesktop: 'My Desktop',
               teamCollaboration: 'Team Collaboration',
               industryResources: 'Industry Resources',
               learningCenter: 'Learning Center',
               designSquare: 'Design Square',
               
               // Dashboard - 其他文本
               equipmentSelection: 'Equipment Selection',
               moreModels: 'More Models',
               certifiedSuppliers: 'Certified Suppliers',
               standardExplanation: 'Smart Drawing Platform Upload Standard',
               ensureDrawing: 'Please ensure that the drawing file can be normally opened using AutoCAD locally.',
               fileFormat: 'File Format',
               fileSizeLimit: 'File Size Limit',
               drawingStandard: 'Drawing Standard',
               launchApp: 'Launch Application',
               appIntroduction: 'Application Introduction',
               noLocalDeployment: 'No local deployment required, online service through cloud, realize intelligent water supply and drainage debugging, sprinkler one-click generation, automatic pipeline layout. Based on fire protection standards and intelligent algorithms, quickly generate compliant design solutions, support multiple scenario applications, help enterprises efficiently complete fire protection system design and operation, reduce costs and safety risks.',
               supplyChain: 'Supply Chain Selection',
               platformSelected: 'Platform selected suppliers, quality assurance',
               
               // 标签分类
               tagAll: 'All',
               tagWaterSupply: 'Smart Water Supply and Drainage',
               tagElectrical: 'Smart Electrical',
               tagHvac: 'Smart HVAC'
             }
           },
  zh: {
    ...zhCN,
    message: {
      // 错误提示
      loginExpired: '登录已过期，请重新登录',
      reLogin: '请重新登录',
      permissionDenied: '没有权限访问',
      resourceNotFound: '请求的资源不存在',
      serverError: '服务器错误，请稍后重试',
      networkError: '网络错误，请检查您的网络连接',
      requestConfigError: '请求配置错误',
      
      // 登录相关
      loginSuccess: '登录成功',
      loginFailed: '登录失败，请稍后重试',
      logoutSuccess: '退出登录成功',
      logoutFailed: '退出登录失败，请稍后重试',
      passwordResetSuccess: '密码重置成功',
      passwordResetFailed: '密码重置失败',
      registerSuccess: '注册成功',
      registerFailed: '注册失败',
      
      // 通用
      success: '成功',
      failed: '失败',
      error: '错误',
      warning: '警告',
      info: '信息',
      confirm: '确认',
      cancel: '取消',
      delete: '删除',
      edit: '编辑',
      save: '保存',
      loading: '加载中...',
      
      // 表单验证
      required: '此字段是必需的',
      invalidEmail: '无效的电子邮件格式',
      invalidPhone: '无效的电话号码',
      passwordMismatch: '密码不匹配',
      
               // 获取数据相关
               fetchDataFailed: '获取数据失败',
               getPrimaryCategoryFailed: '获取主分类数据失败',
               getSmartDrawing2DataFailed: '获取智能绘制2.0数据失败',
               noData: '暂无数据',
               
               // 导航栏
               personalCenter: '个人中心',
               accountManagement: '账户管理',
               backToWebsite: '返回官网',
               logout: '退出登录',
               
               // Dashboard
               welcome: '👋 欢迎使用 BeesFPD',
               smartDrawing2: '智能绘制2.0',
               newAlgorithm: '全新算法引擎重构底层架构，V2算法加持覆盖更多场景',
               releaseNotes: '发布计划说明',
               smartDrawing: '智能绘制',
               smartDrawingDesc: '用智能设计重新定义消防工程，五分钟解决消防点线布置',
               searchApps: '搜索应用...',
               beesCAD: 'BeesCAD',
               beesCADDesc: '基于云架构，完全自主产权',
               cadConverter: 'CAD转化',
               cadConverterDesc: 'CAD / PDF / 图片转换工具',
               smartBudget: '智能预算',
               smartBudgetDesc: '智能算量，预算精准无忧',
               smartManagement: '智慧管理',
               smartManagementDesc: '消防管理，智能一键掌控',
               equipment: '设备',
               systemIntegration: '系统集成',
               searchPlaceholder: '搜索应用...',
               refreshList: '刷新列表',
               create: '新建',
               permissionDenied2: '权限不足',
               youDontHavePermission: '您没有权限访问此功能',
               moreApps: '更多应用',
               cloudApps: '专注服务于建筑设计的云端应用',
               
               // 菜单项
               smartApps: '智能应用',
               myDesktop: '我的桌面',
               teamCollaboration: '团队协同',
               industryResources: '行业资源',
               learningCenter: '学习中心',
               designSquare: '设计广场',
               
               // Dashboard - 其他文本
               equipmentSelection: '消防设备选型',
               moreModels: '更多选型',
               certifiedSuppliers: '消防认证供应商',
               standardExplanation: '智能绘制平台上传图纸标准',
               ensureDrawing: '应确保图纸文件在本地能够使用AutoCAD正常打开。',
               fileFormat: '文件格式',
               fileSizeLimit: '文件大小限制',
               drawingStandard: '图纸标准',
               launchApp: '启动应用',
               appIntroduction: '应用介绍',
               noLocalDeployment: '，无需本地部署，通过云端在线服务，实现智能给排水调试、喷头一键生成、管线自动布置。基于消防规范与智能算法，快速生成合规设计方案，支持多场景应用，助力企业高效完成消防系统设计与运维，降低成本与安全风险。',
               supplyChain: '供应链精选',
               platformSelected: '平台精选供应商，品质保证',
               
               // 标签分类
               tagAll: '所有',
               tagWaterSupply: '智能给排水',
               tagElectrical: '智能电气',
               tagHvac: '智能暖通'
             }
           }
         }

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'zh',
  fallbackLocale: 'zh',
  messages
})


export default i18n
