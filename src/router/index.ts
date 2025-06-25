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
        component: () => import('@/views/smart-computing/index.vue'),
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
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/error/404.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory (),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置（浏览器前进后退），则恢复到该位置
    // if (savedPosition) {
    //   return savedPosition
    // }
    
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
  
  // 如果访问登录页面且已登录，重定向到首页
  if (to.path === '/login' && userStore.isLoggedIn) {
    next('/dashboard')
    return
  }
  
  // 如果访问需要登录的页面但未登录，重定向到登录页
  if (to.path !== '/login' && !userStore.isLoggedIn) {
    next('/login')
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

// 添加全局错误处理
router.onError((error) => {
  console.error('路由错误:', error)
})

export default router 