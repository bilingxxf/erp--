import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { splicingPermissionGroup } from '@/utils/other'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // 白名单

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，重定向到主页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 确定用户是否已通过getInfo获得其权限角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户信息
          // note: 角色必须是对象数组！ 例如: ['admin'] or ,['developer','editor']
          const { rolePermissionGroupLinks } = await store.dispatch('user/getInfo')
          const roles = splicingPermissionGroup(rolePermissionGroupLinks)
          // roles.push('admin')
          // 根据角色生成可访问的路线图
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // 动态添加可访问的路线
          router.addRoutes(accessRoutes)

          // hack方法，以确保addRoutes是完整的
          // 设置replace：true，导航将不会留下历史记录
          next({ ...to, replace: true })
        } catch (error) {
          // remove token 并重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // 登录白名单
      next()
    } else {
      // 其他无权访问的页面将重定向到登录页面。
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
