import request from '@/utils/request'

// 根据年份查询当年采购的每月信息
export function fetchPurchaseSumByYear(params) {
  return request({
    url: '/report-form/monthPurchase/sum',
    method: 'get',
    params
  })
}

// 根据月份查询具体的采购信息
export function fetchMonthPurchaseDetail(params) {
  return request({
    url: '/report-form/monthPurchase/details/sum',
    method: 'get',
    params
  })
}

// 根据年份查询当年出库的每月信息
export function fetchOutboundSumByYear(params) {
  return request({
    url: '/report-form/monthOutbound/sum',
    method: 'get',
    params
  })
}

// 根据月份查询具体的出库信息
export function fetchMonthOutboundDetail(params) {
  return request({
    url: '/report-form/monthOutbound/details/sum',
    method: 'get',
    params
  })
}

// 获取项目成本分析列表
export function fetchProjectAnalysis(params) {
  return request({
    url: '/report-form/find/project-cost-analysis',
    method: 'get',
    params
  })
}

// 查询库存汇总
export function fetchInventorySum(params) {
  return request({
    url: '/report-form/dynamics/inventory/sum',
    method: 'get',
    params
  })
}

// 根据年份查询水电费
export function fetchUtilityFee(params) {
  return request({
    url: '/report-form/find/list',
    method: 'get',
    params
  })
}

// 保存水电费
export function updateUtilityFee(data) {
  return request({
    url: '/cost/update',
    method: 'put',
    data
  })
}

//  生产成本分析
export function productCost(data) {
  return request({
    url: '/report-form/find/production-cost-analysis',
    method: 'post',
    data
  })
}
