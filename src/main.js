import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Vant from 'vant'
// 加载 Vant 全局样式
import 'vant/lib/index.css'
// 加载全局样式
import '@/styles/index.less'
// 加载dayjs初始化配置
import 'amfe-flexible'
// 加载 dayjs 初始化配置
import './utils/dayjs'

// 注册使用Vant组件库
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
