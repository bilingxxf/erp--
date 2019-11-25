import { MATERIAL_DENSITY, MATERIAL_BASE_TYPE, DECIMAL_NUMBER } from '@/utils/conventionalContent'

/**
 * 将年份分组的项目转化为级联(树)
 * @param {Array} arr 数组
 * @param {string} tip 提示
 * @param {string} tipField 提示携带字段
 * @author dhh
 */
export function changeProjectToCascadeByYear(arr, tip = '', tipField) {
  const newArr = []
  arr.forEach(a => {
    if (a.project && a.project.length) {
      const _child = a.project.map(p => {
        const _otherInfo = tipField ? ` | ${tip}:${p[tipField]}` : ''
        const _new = {
          id: p.projectId,
          name: `${p.projectName}${_otherInfo}`
        }
        return _new
      })
      const _node = {
        id: a.year,
        name: a.year,
        children: _child
      }
      newArr.push(_node)
    }
  })
  // console.log(newArr)
  return JSON.parse(JSON.stringify(newArr))
}

/**
 * 计算物料（钢板/不锈钢）重量
 *
 * @param {number} length 长（m）
 * @param {number} width 宽（m）
 * @param {number} thick 厚度（mm）
 * @param {number} number 数量
 * @param {string} name 物料名称
 * @returns 重量（kg）
 * @author duhh
 */
export function calcWeightByMateName(length, width, thick, number = 1, name) {
  if (!length && !width && !thick) {
    return
  }
  let weight = 0
  let density = MATERIAL_DENSITY.STEEL
  if (name && name.indexOf('不锈钢') > -1) {
    density = MATERIAL_DENSITY.STAINLESS_STEEL
  }
  weight = Number((length * width * thick * density * number).toFixed(DECIMAL_NUMBER.ton))
  return weight
}

/**
 * 拼接权限组
 * @param {*} permissionGroup 权限组
 * @returns {array} permission 权限
 * @author duhh
 */
export function splicingPermissionGroup(permissionGroup) {
  if (!permissionGroup) {
    return []
  }
  // 先获取物料的权限 moduleId: 50, permissionModuleName: "物料管理" 根据moduleId来取
  let permission = ''
  permissionGroup = permissionGroup.filter(p => p.moduleId === 50)
  permission = permissionGroup.map(p => {
    return `${p.moduleId}_${p.id}_${p.type}`
  })
  if (permission.indexOf('50_205_2') === -1) {
    permission = []
  }
  return permission
}

/**
 * 设置物料规格
 * @param {number/string} baseType 基础类型
 * @param {object} material 物料
 * @returns {string} specification 规格
 * @author duhh
 */
export function setMaterialSpecification(baseType, material) {
  const materialBaseType = MATERIAL_BASE_TYPE
  let specification = ''
  if (+baseType === materialBaseType.material.index) {
    specification = material.specification
  }
  if (+baseType === materialBaseType.steelPlate.index || +baseType === materialBaseType.stripSteel.index) {
    specification = `${material.length} * ${material.width} * ${material.thickness}`
  }
  if (+baseType === materialBaseType.steel.index) {
    specification = `${material.specification} * ${material.length}`
  }
  if (+baseType === materialBaseType.enclosure.index) {
    specification = `${material.specification} * ${material.length} * ${material.thickness}`
  }
  return specification || ''
}
