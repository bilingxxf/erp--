/**
 * 时间格式化
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (!time) {
    return null
  }
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * 时间格式化
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * 获取url中查询内容，并合并为对象
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * 计算字节长度
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * 去除数组中 0,false,null,undefined 等
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * 将json转为url路径参数并拼接
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * url中的参数转对象
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * html2Text
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * 合并两个对象，后一个优先级更高
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * 更换element中的class
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * 函数防抖
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * 这只是深度复制的简单版本
 * 有很多边缘案例的错误
 * 如果要使用完美的深层副本，请使用lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * 数组去重
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * 创建唯一的字符串
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * 检查element是否有一个class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * 将class添加到element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * 从element中删除class
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

/**
 * 移除tree中child为空的字段
 * @param {Array} arr 数组
 * @param {string} childName 子节点字段名
 */
export function removeTreeEmptyFiled(arr, childName) {
  arr.forEach(a => {
    if (a[childName] && a[childName].length) {
      removeTreeEmptyFiled(a[childName], childName)
    } else {
      delete a[childName]
    }
  })
  return JSON.parse(JSON.stringify(arr))
}

/**
 * 对树的某一层设置信息
 * @export
 * @param {*} pendingArr 待处理数组
 * @param {*} childFieldName 子节点字段名
 * @param {*} needChangeField 需要修改的字段
 * @param {*} infoField 携带信息的字段
 * @param {*} pollingLimit 轮询次数（树层级）
 * @param {number} [currentIndex=1] 当前轮序下标
 * @author duhh
 */
export function setInfoOfTree(pendingArr, childFieldName, needChangeField, infoField, pollingLimit, currentIndex = 1) {
  if (pendingArr) {
    if ((currentIndex === pollingLimit) && !!pendingArr) {
      pendingArr.forEach(c => {
        if (c && c[needChangeField] && c[infoField]) {
          c[needChangeField] = `${c[needChangeField]}(${c[infoField]})`
        }
      })
    }
    if (currentIndex < pollingLimit && !!pendingArr) {
      pendingArr.forEach(c => {
        setInfoOfTree(c[childFieldName], childFieldName, needChangeField, infoField, pollingLimit, currentIndex + 1)
      })
    }
  }
}

/**
 * 根据节点数组获取所需的节点信息
 *
 * @export
 * @param {array} pendingArr 待处理数组
 * @param {array} ids ids 数组
 * @param {string} [idField='id'] id字段名称
 * @param {string} [childField='children'] children字段名称
 * @returns node 节点信息
 * @author duhh
 */
export function getNodeInfoByIds(pendingArr, ids, idField = 'id', childField = 'children') {
  const tempFlag = pendingArr && ids && ids.length && idField && childField
  if (!tempFlag) return
  let arr = [...pendingArr]
  let nodeInfo
  let currentIndex = 0
  do {
    for (let i = 0; i < arr.length; i++) {
      if (ids[currentIndex] === arr[i][idField]) {
        if (currentIndex === (ids.length - 1)) {
          nodeInfo = arr[i]
        } else {
          arr = arr[i][childField]
        }
        break
      }
    }
    ++currentIndex
  } while (currentIndex < ids.length)
  return nodeInfo
}

/**
 * 根据节点数组获取级联名称
 *
 * @export
 * @param {array} pendingArr 待处理数组
 * @param {array} ids ids 数组
 * @param {string} [idField='id'] id字段名称
 * @param {string} [childField='children'] children字段名称
 * @param {string} [nameField='name'] name字段名称
 * @returns node 节点信息
 * @author duhh
 */
export function getCascaderNameByIds(pendingArr, ids, idField = 'id', childField = 'children', nameField = 'name',) {
  const tempFlag = pendingArr && ids && ids.length && idField && childField
  if (!tempFlag) return ''
  let arr = [...pendingArr]
  let currentIndex = 0
  let name = ''
  do {
    for (let i = 0; i < arr.length; i++) {
      if (ids[currentIndex] === arr[i][idField]) {
        name += arr[i][nameField]
        arr = arr[i][childField]
        break
      }
    }
    ++currentIndex
  } while (currentIndex < ids.length)
  return name
}

/**
 * 数字转大写中文
 *
 * @export
 * @param {*} n 数字
 * @returns
 */
export function digitUppercase(n) {
  if (isNaN(n)) {
    return ''
  }
  const fraction = ['角', '分']
  const digit = [
    '零', '壹', '贰', '叁', '肆',
    '伍', '陆', '柒', '捌', '玖'
  ]
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ]
  const head = n < 0 ? '欠' : ''
  n = Math.abs(n)
  let s = ''
  for (let i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
  }
  s = s || '整'
  n = Math.floor(n)
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = ''
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p
      n = Math.floor(n / 10)
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
  }
  return head + s.replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整')
}

export function formatExcelDate(numb) {
  const time = new Date((numb - 1) * 24 * 3600000 + 1)
  time.setYear(time.getFullYear() - 70)
  return time.getTime()
}

export function downloadFiles(res) {
  const data = res.data
  if (!data) {
    return
  }
  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' }) // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
  const downloadElement = document.createElement('a')
  const href = window.URL.createObjectURL(blob) // 创建下载的链接
  downloadElement.href = href
  console.log('header', decodeURI(res.headers['content-disposition']))
  // 获取文件名
  let _name = res.headers && res.headers['content-disposition'] ? `${decodeURI(res.headers['content-disposition'].split('=')[1].split('.')[0])}` : ``// 处理文件名乱码问题
  const _suffix = res.headers && res.headers['content-disposition'] ? `${decodeURI(res.headers['content-disposition'].split('=')[1].split('.')[1])}` : ``// 处理文件名乱码问题
  if (!_suffix) {
    return
  }
  _name = `${_name}_`
  const fileName = `${_name}${parseTime(new Date(), '{y}{m}{d}{h}{i}{s}')}.${_suffix}`// 处理文件名乱码问题
  downloadElement.download = fileName // 下载后文件名
  document.body.appendChild(downloadElement)
  downloadElement.click() // 点击下载
  document.body.removeChild(downloadElement) // 下载完成移除元素
  window.URL.revokeObjectURL(href) // 释放掉blob对象
}
