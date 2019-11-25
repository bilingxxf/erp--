import request from '@/utils/request'

// 获取物料定额列表
export function qutoList(query) {
  return request({
    url: '/material-quota/find/list',
    method: 'get',
    params: query
  })
}

// 删除定额 通过id
export function deleteQuto(query) {
  return request({
    url: '/material-quota/delete',
    method: 'delete',
    params: query
  })
}

// 保存物料定额
export function saveQuto(data) {
  return request({
    url: '/material-quota/save',
    method: 'post',
    data
  })
}

// 修改物料定额
export function updateQuto(data) {
  return request({
    url: '/material-quota/update',
    method: 'put',
    data
  })
}

// 删除对应的物料定额
export function delQuto(data) {
  return request({
    url: '/material-quota/delete?id=' + data.id,
    method: 'delete'
  })
}

// 获取物料定额追踪列表
export function quotaTrackList(query) {
  return request({
    url: '/material-quota/find/page',
    method: 'get',
    params: query
  })
}

// 导出物料定额制定
export function exportFormulate(query) {
  return request({
    url: '/material-quota/record/export',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}

// 导出物料定额跟踪
export function downloadTracking(query) {
  return request({
    url: '/material-quota/record/export-track',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}

// 查询库存信息
export function queryInventory(query) {
  return request({
    url: '/material-quota/find/page-pool',
    method: 'get',
    params: query
  })
}
