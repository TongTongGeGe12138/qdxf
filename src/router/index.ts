import { createRouter, createWebHashHistory  } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('../layout/index.vue'),
    redirect: '/login',
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
      }
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
  routes
})

// 添加全局错误处理
router.onError((error) => {
  console.error('路由错误:', error)
})

export default router 