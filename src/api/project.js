import request from '@/utils/request'

// 查询项目入库汇总信息（项目按年份区别）
export function fetchProjectGroupByYear(params) {
  return request({
    url: '/projects/find/list',
    // url: '/storage-list/find/sum-info',
    method: 'get',
    params
  })
}

// 查询项目入库汇总信息
export function fetchProjectInbound(params) {
  return request({
    url: '/storage-list/find/sum-info-page',
    method: 'get',
    params
  })
}

// 获取项目出库总额
export function fetchProjectOutbound(params) {
  return request({
    url: '/outboundDetail/project/record/list',
    method: 'get',
    params
  })
}
