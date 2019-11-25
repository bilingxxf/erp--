// 接口返回码
const apiResultCode = {
  AUTHORITY: 401, // 权限认证失败
  API_VERSION: 50001 // 接口版本更新
}

const dictionaryType = {
  UNIT: 1,
  SUPPLIER: 2,
  EnterPrise: 0
}

// 小数位数
const DECIMAL_NUMBER = {
  ton: 3 // 吨
}

// 物料池类型 整料/余料
const MATERIAL_POOL_TYPE = {
  entire: 0,
  remainder: 1
}

// 物料搬家类型
const MATERIAL_MOVE_TYPE = {
  common: 0,
  partyA: 1,
  scrap: 2
}
const MATERIAL_MOVE_INDEX_TYPE = {
  0: '常规物料仓',
  1: '归还甲方',
  2: '设为废料'
}

// 物料入库类型 正常/甲供
const MATERIAL_INBOUND_TYPE = {
  normal: 0,
  partyA: 1
}

const MATERIAL_RETURN_STATUS = {
  verify: { index: 0, name: '未审核', tip: 'warning' },
  success: { index: 1, name: '已通过', tip: 'success' },
  error: { index: 2, name: '已退回', tip: 'danger' }
}

const MATERIAL_RETURN_INDEX_STATUS = {
  0: { name: '未审核', tip: 'warning' },
  1: { name: '已通过', tip: 'success' },
  2: { name: '已退回', tip: 'danger' }
}

// 退库状态和入库清单状态结合才能知道当前物料状态
const MATERIAL_RETURN_INDEX_STATUS_2 = {
  0: { name: '未办理', tip: 'primary' },
  1: { name: '办理中', tip: 'warning' },
  2: { name: '已退库', tip: 'danger' }
}

// 退库验证
const MATERIAL_RETURN_STATUS_2 = {
  normal: 0,
  processing: 1,
  return: 2
}

const MATERIAL_BASE_TYPE = {
  steelPlate: { index: 0, name: '钢板', value: 'steelPlate', icon: 'steel-plate', unit: '张' },
  steel: { index: 1, name: '型钢', value: 'steel', icon: 'steel', unit: '根' },
  stripSteel: { index: 2, name: '彩卷/带钢', value: 'stripSteel', icon: 'strip-steel', unit: 'kg' },
  enclosure: { index: 3, name: '成品围护', value: 'enclosure', icon: 'enclosure', unit: 'm' },
  material: { index: 4, name: '一般物料', value: 'material', icon: 'material' }
}

const MATERIAL_BASE_NUM = {
  0: { index: 0, name: '钢板', value: 'steelPlate', icon: 'steel-plate', unit: '张' },
  1: { index: 1, name: '型钢', value: 'steel', icon: 'steel', unit: '根' },
  2: { index: 2, name: '彩卷/带钢', value: 'stripSteel', icon: 'strip-steel', unit: 'kg' },
  3: { index: 3, name: '成品围护', value: 'enclosure', icon: 'enclosure', unit: 'm' },
  4: { index: 4, name: '一般物料', value: 'material', icon: 'material' }
}

// 物料密度
const MATERIAL_DENSITY = {
  STEEL: 7.85,
  STAINLESS_STEEL: 7.93
}

// 报表icon
const REPORT_ICON = {
  0: 'steel-plate',
  1: 'steel',
  2: 'strip-steel',
  3: 'enclosure',
  4: 'material',
  100: 'inventory',
  101: 'monthPurchase',
  102: 'yearPurchase',
  103: 'out'
}

// 报表icon
const REPORT_ICON_BY_TEXT = [
  { name: '钢板', icon: 'steel-plate' },
  { name: '型钢', icon: 'steel' },
  { name: '彩卷', icon: 'strip-steel' },
  { name: '带钢', icon: 'strip-steel' },
  { name: '围护', icon: 'enclosure' },
  { name: '劳保', icon: 'labor-protection' },
  { name: '焊接', icon: 'welding' },
  { name: '紧固件', icon: 'fastener' },
  { name: '工机具', icon: 'tool' },
  { name: '工具', icon: 'tool' },
  { name: '配件', icon: 'accessories' },
  { name: '电气', icon: 'electric' },
  { name: '气体', icon: 'gas' },
  { name: '油漆', icon: 'paint' }

]

// 入库状态验证
const INBOUND_VERIFY_STATUS = {
  0: '未审核',
  1: '已通过',
  2: '已退回',
  3: '已退库'
}

// 入库验证
const INBOUND_VERIFY = {
  unfinished: 0,
  success: 1,
  return: 2,
  quit: 3
}

// 退库验证
const RETURN_VERIFY = {
  success: true,
  return: false
}

// 出库方式
const OUTBOUND_MODE = {
  0: { name: '整料整出', type: 'primary' },
  1: { name: '整料半出', type: 'warning' }
}

// 日期选择配置
const DATE_PICKER_OPTION = {
  shortcuts: [{
    text: '最近一周',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }]
}

const MONTH_PICKER_OPTION = {
  shortcuts: [{
    text: '本月',
    onClick(picker) {
      picker.$emit('pick', [new Date(), new Date()])
    }
  }, {
    text: '今年至今',
    onClick(picker) {
      const end = new Date()
      const start = new Date(new Date().getFullYear(), 0)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近六个月',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 6)
      picker.$emit('pick', [start, end])
    }
  }]
}

export { apiResultCode, dictionaryType, DECIMAL_NUMBER, MATERIAL_RETURN_INDEX_STATUS_2, MATERIAL_RETURN_STATUS_2, OUTBOUND_MODE, REPORT_ICON_BY_TEXT, REPORT_ICON, RETURN_VERIFY, MATERIAL_RETURN_STATUS, MATERIAL_RETURN_INDEX_STATUS, MATERIAL_BASE_TYPE, MATERIAL_BASE_NUM, MATERIAL_DENSITY, INBOUND_VERIFY_STATUS, INBOUND_VERIFY, DATE_PICKER_OPTION, MONTH_PICKER_OPTION, MATERIAL_POOL_TYPE, MATERIAL_MOVE_TYPE, MATERIAL_MOVE_INDEX_TYPE, MATERIAL_INBOUND_TYPE }
