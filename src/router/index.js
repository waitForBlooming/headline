import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/layout',
    // name: 'layout',
    redirect: '/layout/home',
    component: () => import('@/views/layout'),
    children: [
      {
        path: 'home', // 为空时，是默认子路由,只能有一个
        name: 'home',
        component: () => import('@/views/home'),
        meta: {
          title: '首页'
        }
      },
      {
        path: 'qa', // 为空时，是默认子路由,只能有一个
        name: 'qa',
        component: () => import('@/views/qa'),
        meta: {
          title: '问答'
        }
      },
      {
        path: 'video', // 为空时，是默认子路由,只能有一个
        name: 'video',
        component: () => import('@/views/video'),
        meta: {
          title: '视频'
        }
      },
      {
        path: 'my', // 为空时，是默认子路由,只能有一个
        name: 'my',
        component: () => import('@/views/my'),
        meta: {
          title: '个人中心'
        }
      }
    ]
  },
  {
    path: '/search',
    component: () => import('@/views/search'),
    meta: {
      title: '搜索'
    }
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    // 将路由动态参数映射到组件的 props 中，更推荐这种做法
    props: true// 开启 Props 传参，说白了就是把路由参数映射到组件的 props 数据中
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile')
  },
  {
    path: '/user/:userId',
    name: 'user',
    component: () => import('@/views/user'),
    props: true// 开启 Props 传参，把路由参数映射到src\views\user\index.vue组件的 props 数据中
  }
]

const router = new VueRouter({
  routes
})
// 利用导航守卫beforeEach在每次页面跳转前更改对应的title
router.beforeEach((to, from, next) => {
  // 路由发生变化修改页面title
  // 当to.meta.title不为空时，执行document.title = to.meta.title
  to.meta.title && (document.title = to.meta.title)
  next()
})
export default router
