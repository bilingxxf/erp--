/**
 * 物料接口
 * @author duhh
 */
import request from '@/utils/request'

// 获取物料名称
export function fetchTypeList(query) {
  return request({
    url: '/material-type/find/list',
    method: 'get',
    params: query
  })
}

// 创建物料名称
export function createType(data) {
  return request({
    url: '/material-type/save',
    method: 'post',
    data
  })
}

// 删除物料名称
export function delType(id) {
  return request({
    url: '/material-type/delete',
    method: 'delete',
    params: { id }
  })
}

// 获取物料种类列表
export function fetchClassList(query) {
  return request({
    url: '/material-class/find/list',
    method: 'get',
    params: query
  })
}

// 创建物料种类
export function createClass(data) {
  return request({
    url: '/material-class/save',
    method: 'post',
    data
  })
}

// 修改物料种类
export function updateClass(data) {
  return request({
    url: '/material-class/update',
    method: 'put',
    data
  })
}

// 删除物料种类
export function delClass(id) {
  return request({
    url: '/material-class/delete',
    method: 'delete',
    params: { id }
  })
}

// 获取物料材质列表
export function fetchMaterialList(query) {
  return request({
    url: '/material-detail/find/list',
    method: 'get',
    params: query
  })
}

// 新增物料材质
export function createMaterial(data) {
  return request({
    url: '/material-detail/save',
    method: 'post',
    data
  })
}

// 修改物料材质
export function updateMaterial(data) {
  return request({
    url: '/material-detail/update',
    method: 'put',
    data
  })
}

// 删除物料材质
export function delMaterial(id) {
  return request({
    url: '/material-detail/delete',
    method: 'delete',
    params: { id }
  })
}

// 修改物料最低库存
export function updateMinimumInventory(data) {
  return request({
    url: '/material-detail/update/minimum-inventory',
    method: 'put',
    data
  })
}

// 查询物料分类和其级联信息
export function fetchMaterialClassTree(baseType) {
  return request({
    url: '/material-type/option/list',
    method: 'get',
    params: { formType: baseType }
  })
}

// 查询物料树
export function fetchMaterialTree(baseType) {
  return request({
    url: '/material-type/tree/list',
    method: 'get',
    params: { formType: baseType }
  })
}

// 查询物料树(全)
export function fetchAllMaterialTree(params) {
  return request({
    url: '/material-type/tree/listAll',
    method: 'get',
    params
  })
}

// 获取物料材质列表
export function fetchScrapList(query) {
  return request({
    url: '/materialScrap/find/list',
    method: 'get',
    params: query
  })
}

// 废料定义
export function updateScrap(data) {
  return request({
    url: '/materialScrap/save',
    method: 'post',
    data
  })
}

// 获取库存预警列表
export function fetchInventoryWarningList(query) {
  return request({
    url: '/material-detail/inventory/reminder/list',
    method: 'get',
    params: query
  })
}
