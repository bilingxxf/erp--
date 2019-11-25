import axios from 'axios'
import { Message } from 'element-ui'
import { Loading } from 'element-ui'
import { downloadFiles } from '@/utils'
import { apiResultCode } from '@/utils/conventionalContent'
import router from '@/router'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    config.headers['Content-Type'] = 'application/json'
    if (config.data === null || config.data === undefined) config.data = {}
    if (config.params === null || config.params === undefined) config.params = {}
    if (store.getters.token) {
      // let each request carry token
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      // please modify it according to the actual situation
      config.headers['Authorization'] = `cat ${getToken()}`
    }

    // config.data = Qs.stringify(config.data)
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  // response => {
  //   const res = response.data

  //   // if the custom code is not 20000, it is judged as an error.
  //   if (res.code !== 20000) {
  //     Message({
  //       message: res.message || 'Error',
  //       type: 'error',
  //       duration: 5 * 1000
  //     })

  //     // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
  //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //       // to re-login
  //       MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
  //         confirmButtonText: 'Re-Login',
  //         cancelButtonText: 'Cancel',
  //         type: 'warning'
  //       }).then(() => {
  //         store.dispatch('user/resetToken').then(() => {
  //           location.reload()
  //         })
  //       })
  //     }
  //     return Promise.reject(new Error(res.message || 'Error'))
  //   } else {
  //     return res
  //   }
  // },
  response => {
    // console.log(response)
    // var that = this
    const res = response.data
    if (res.resultCode === apiResultCode.AUTHORITY) {
      Message({
        // message: error.message,
        message: '登录超时',
        type: 'error',
        duration: 3 * 1000
      })
      const loadingInstance = Loading.service({ fullscreen: true, text: '登录超时,请重新登录' })
      setTimeout(() => {
        loadingInstance.close()
        router.push('/')
        store.dispatch('resetToken').then(() => {
          location.reload()// In order to re-instantiate the vue-router object to avoid bugs
        })
      }, 3000)
    } else if (res.resultCode === apiResultCode.API_VERSION) {
      Message({
        // message: error.message,
        message: '界面更新',
        type: 'info',
        duration: 1 * 1000
      })
      setTimeout(() => {
        window.location.reload()
      }, 100)
    } else if (res.code === 200) {
      return res
    }

    if (response.config.responseType === 'blob' || response.config.responseType === 'arraybuffer') {
      downloadFiles(response)
      return
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    // return Promise.reject(error)
    let _message = '服务器错误'
    const _type = 'error'
    if (error.response !== undefined) {
      const _status = error.response.status
      switch (_status) {
        case 400 : _message = '请求参数错误'
          break
        case 403 : _message = '您没有操作权限'
          break
        default : _message = '服务器错误'
          break
      }
      _message += '  ' + _status
    } else {
      _message = '请求超时'
    }

    Message({
      message: _message,
      type: _type,
      duration: 3 * 1000
    })

    // return Promise.reject(error)
  }
)

export default service
