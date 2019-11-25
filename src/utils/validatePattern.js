/**
 * author: duhh
 */
// 邮箱
const validatorEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

// 手机号
// const validatorPhone = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/
const validatorPhone = /^1([38]\d|4[5679]|5[0-35-9]|6[56]|7[01345678]|9[189])\d{8}$/

// 手机 + 固话
const validatorTel = /^(0\d{2}-\d{8}(-\d{1,4})?)|(0\d{3}-\d{7,8}(-\d{1,4})?)$|^1([38]\d|4[5679]|5[0-35-9]|6[56]|7[01345678]|9[189])\d{8}$/

// 密码正则 6-20位字母数字组合
const validatorPwd = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/

// 正整数(不含0)
const validatorPositiveInt = /^[1-9]\d*$/

// 身份证号
const validatorIDCard = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/

// 自然数 / 正整数(含0)
const validatorNatural = /^[+]{0,1}(\d+)$/

// 1-100整数
const validatorOneToHundred = /^(1|([1-9]\d{0,1})|100)$/

// 100-1000
const validatorMoreHundred = /^(100|([1-9][0-9]\d{1})|1000)$/

// 大小写字母
const validatorEn = {
  pattern: /^[A-Za-z]+$/,
  message: '请输入英文'
}

// 中文
const validatorCN = {
  pattern: /^[\u4e00-\u9fa5]+$/,
  message: '请输入中文'
}

const validatorCNENNUM = {
  pattern: /^[\u4E00-\u9FA5A-Za-z0-9]+$/,
  message: '请输入中文、英文或数字'
}

const validatorBankCard = /^([1-9]{1})(\d{14}|\d{15}|\d{17}|\d{18})$/

// 域名验证
const validatorDomain = /^(?=^.{3,255}$)(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*\/?$/

// 域名验证2(必须以/结尾)
const validatorDomain2 = /\/$/

// 银行卡账户
const validatorBankAcount = /^([1-9]{1})(\d{14}|\d{18})$/

export { validatorCNENNUM, validatorCN, validatorEmail, validatorPhone, validatorTel, validatorPwd, validatorPositiveInt, validatorNatural, validatorOneToHundred, validatorIDCard, validatorMoreHundred, validatorEn, validatorBankCard, validatorDomain, validatorDomain2, validatorBankAcount }
