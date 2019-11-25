import request from '@/utils/request'

/**
 * 查看某分类的供应商简单信息
 * @param {string/number} baseType 基础分类
 * @author duhh
 */
export function fetchListByBaseType(baseType) {
  return request({
    url: '/cost-supplier/find/list-simple',
    method: 'get',
    params: { classification: baseType }
  })
}

// 创建供应商
export function save(data) {
  return request({
    url: '/cost-supplier/save',
    method: 'post',
    data
  })
}

// 更新
export function update(data) {
  return request({
    url: '/cost-supplier/update',
    method: 'put',
    data
  })
}

// 查询供应商列表
export function list(query) {
  return request({
    url: '/cost-supplier/find/page-list',
    method: 'get',
    params: query
  })
}

//  供应商详情
export function detail(query) {
  return request({
    url: '/cost-supplier/find/get',
    method: 'get',
    params: query
  })
}

// 通过id删除
export function delItem(data) {
  return request({
    url: '/cost-supplier/delete?id=' + data.id,
    method: 'delete'
  })
}

// 省市区
export function getProvice(query) {
  return request({
    url: '/states/list-chinese-state',
    method: 'get',
    params: query
  })
}

// 交易记录按天查询
// export function getRecord(query) {
//   return request({
//     url: '/storage-list/page/supplier-storage',
//     method: 'get',
//     params: query
//   })
// }

//  交易记录按年查询
export function getRecord(query) {
  return request({
    url: '/storage-list/page/supplier-storage-year',
    method: 'get',
    params: query
  })
}

//  上传附件
export function exportAnnex(data) {
  return request({
    url: '/attachments',
    method: 'post',
    data
  })
}
