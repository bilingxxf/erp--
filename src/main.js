import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets（CSS重置的现代替代方法）

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css（全局css）

import App from './App'
import store from './store'
import router from './router'

import './icons' // 图标
import './permission' // 权限控制
import './utils/error-log' // 错误日志

import * as filters from './filters' // 全局过滤器
import { parseTime, digitUppercase } from './utils'
import permission from '@/directive/permission/index.js' // 权限判断指令

// DECIMAL_NUMBER
import { DECIMAL_NUMBER } from '@/utils/conventionalContent'
Vue.prototype.DECIMAL_NUMBER = DECIMAL_NUMBER

import echarts from 'echarts'
Vue.prototype.$echarts = echarts
/**
 *如果您不想使用模拟服务器
 *您想将MockJs用于模拟api
 *您可以执行：mockXHR（）
 *
 *目前，MockJs将用于生产环境，
 *请先删除它，然后再上网！ ！ ！
*/
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}

Vue.use(permission)

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // 设置element-ui默认大小
})

// 时间格式过滤器
Vue.filter('parseTime', parseTime)
Vue.filter('digitUppercase', digitUppercase)

Vue.filter('toFixed', (value, precision) => {
  if (value === undefined || value === null || isNaN(value)) return ''
  return value.toFixed(precision)
})

// register global utility filters（注册全局实用程序过滤器）
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
