import request from '@/utils/request'
import { dictionaryType as type } from '@/utils/conventionalContent'

// 获取单位列表
export function fetchUnitList() {
  return request({
    url: '/dictionary/getChildListByType',
    method: 'get',
    params: { type: type.UNIT }
  })
}

// 获取供应商类型列表
export function fetchSupplierTypeList() {
  return request({
    url: '/dictionary/getChildListByType',
    method: 'get',
    params: { type: type.SUPPLIER }
  })
}

// 获取企业类型列表
export function fetchEnterpriseTypeList() {
  return request({
    url: '/dictionary/getChildListByType',
    method: 'get',
    params: { type: type.EnterPrise }
  })
}
