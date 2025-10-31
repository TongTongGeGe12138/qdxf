import { createRouter, createWebHashHistory  } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '../stores/user'
import { nextTick } from 'vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('../layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/index.vue'),
        meta: {
          title: '智能应用',
          icon: 'smart_application'
        }
      },
      {
        path: '/workspace',
        name: 'Workspace',
        component: () => import('../views/workspace/index.vue'),
        meta: {
          title: '工作空间',
          icon: '顶栏 - 工作空间'
        }
      },
      {
        path: '/desktop',
        name: 'Desktop',
        component: () => import('../views/desktop/index.vue'),
        meta: {
          title: '我的桌面',
          icon: '左栏 - 我的桌面'
        }
      },

      {
        path: '/smart-computing',
        name: 'SmartComputing',
        // component: () => import('@/views/smart-computing/index.vue'),
        component: () => import('@/views/smart-computing/temp.vue'),
        // component: () => import('@/views/smart-computing/test.vue'),
        meta: {
          title: '团队协同',
          icon: '左栏 - 团队协同',
        }
      },
      {
        path: '/knowledge-base',
        name: 'KnowledgeBase',
        component: () => import('../views/knowledge-base/index.vue'),
        meta: {
          title: '行业资源',
          icon: '左栏 - 知识库'
        }
      },
      {
        path: '/learning-center',
        name: 'LearningCenter',
        component: () => import('@/views/learning-center/index.vue'),
        meta: {
          title: '学习中心',
          icon: '左栏 - 学习中心'
        }
      },
      {
        path: '/account',
        name: 'Account',
        component: () => import('../views/account/index.vue'),
        meta: {
          title: '账户管理',
          icon: 'zhgl',
          hidden: true
        }
      },
      {
        path: '/design-square',
        name: 'DesignSquare',
        component: () => import('@/views/design-square/index.vue'),
        meta: {
          title: '设计广场',
          icon: '左栏 - 设计广场',
        }
      },

      // {
      //   path: '/collaboration',
      //   name: 'Collaboration',
      //   component: () => import('../views/collaboration/index.vue'),
      //   meta: {
      //     title: '协同空间',
      //     icon: '左栏 - 团队协同'
      //   },
      //   children: [
      //     {
      //       path: 'members',
      //       name: 'Members',
      //       component: () => import('../views/collaboration/members/index.vue'),
      //       meta: {
      //         title: '人员管理'
      //       }
      //     },
      //     {
      //       path: 'tasks',
      //       name: 'Tasks',
      //       component: () => import('../views/collaboration/tasks/index.vue'),
      //       meta: {
      //         title: '任务管理'
      //       }
      //     },
      //     {
      //       path: 'board',
      //       name: 'Board',
      //       component: () => import('../views/collaboration/board/index.vue'),
      //       meta: {
      //         title: '进度看板'
      //       }
      //     }
      //   ]
      // }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/login/index.vue')
  },
  {
    path: '/converter',
    name: 'Converter',
    component: () => import('@/views/converter/index.vue'),
    meta: { title: 'CAD工具 - BeesFPD' },
    children: [
      {
        path: 'intro',
        name: 'ConverterIntro',
        component: () => import('@/views/converter/intro.vue'),
        meta: { title: '智能消防建筑设计 - BeesFPD' }
      },
      {
        path: 'image',
        name: 'ConverterImage',
        component: () => import('@/views/converter/image.vue'),
        meta: { title: 'CAD转图片 - BeesFPD' }
      },
      {
        path: 'cad-to-pdf',
        name: 'CadToPdf',
        component: () => import('@/views/converter/dwg-to-pdf.vue'),
        meta: { title: 'CAD转PDF - BeesFPD' }
      },
      {
        path: 'cad-to-png',
        name: 'CadToPng',
        component: () => import('@/views/converter/dwg-to-svg.vue'),
        meta: { title: 'CAD转PNG - BeesFPD' }
      },
      {
        path: 'pdf-to-cad',
        name: 'PdfToCad',
        component: () => import('@/views/converter/pdf-to-cad.vue'),
        meta: { title: 'PDF转CAD - BeesFPD' }
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/error/404.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory (),
  routes,
  scrollBehavior(to, from) {
    // 如果是路由切换，滚动到顶部
    if (to.path !== from.path) {
      return { top: 0 }
    }
    
    // 默认行为
    return { top: 0 }
  }
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()
  // /converter 及其所有子路由不需要登录就能查看
  if (to.path.startsWith('/converter')) {
    next()
    return
  }
  // 如果访问登录页面且已登录，重定向到首页
  if (to.path === '/login' && userStore.isLoggedIn) {
    next('/dashboard')
    return
  }
  // 注册页无需登录
  if (to.path === '/register') {
    next()
    return
  }
  // 如果访问需要登录的页面但未登录，重定向到登录页
  if (to.path !== '/login' && !userStore.isLoggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }
  next()
})

// 路由后置守卫 - 确保页面滚动到顶部
router.afterEach((to, from) => {
  // 如果是路由切换（不是同一页面），滚动到顶部
  if (to.path !== from.path) {
    // 使用 nextTick 确保 DOM 更新完成后再滚动
    nextTick(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    })
  }
})

// 动态设置页面标题
router.afterEach((to) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title as string
  } else {
    document.title = 'BeesFPD - 只关注消防领域的智慧云平台'
  }
})

// 添加全局错误处理
router.onError((error) => {
  console.error('路由错误:', error)
})

export default router 