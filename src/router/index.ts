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
      },
      {
        path: '/collaboration',
        name: 'Collaboration',
        component: () => import('../views/collaboration/index.vue'),
        meta: {
          title: '协同空间',
          icon: '左栏 - 我的桌面'
        },
        children: [
          {
            path: 'members',
            name: 'Members',
            component: () => import('../views/collaboration/members/index.vue'),
            meta: {
              title: '人员管理'
            }
          },
          {
            path: 'tasks',
            name: 'Tasks',
            component: () => import('../views/collaboration/tasks/index.vue'),
            meta: {
              title: '任务管理'
            }
          },
          {
            path: 'board',
            name: 'Board',
            component: () => import('../views/collaboration/board/index.vue'),
            meta: {
              title: '进度看板'
            }
          }
        ]
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