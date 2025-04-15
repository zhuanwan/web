/**
 * 全局常量
 */

// 页面加载完标志
export const LoadStateEnum = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
}

export const RoleEnum = {
  ALL: 0, // 所有的
  SUPER_ADMIN: 1, // 超级管理员
  CUSTOMER_MANAGER: 2, // 客户管理员
  GENERAL_USER: 3, // 普通用户
  SALE_USER: 4, // 销售人员
}

// localstorage keys
export const LocalstorageKeys = {
  TOKEN: 'ccsic_token',
  USER_INFO: 'user_info',
  USER_ID: 'user_id',
  C_ID: 'cid',
}

// 文件类型
export const fileTypeList = ['jpg', 'jpeg', 'png', 'mp4', 'xls', 'xlsx', 'doc', 'docx']

// 个人设置校验
export const phoneNumberReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/ // 手机号校验
export const verificationCodeReg = /^\d{6}$/ // 验证码校验
export const twoDecimalReg = /^\d+(\.\d{1,2})?$/ // 两位小数
export const threeDecimalReg = /^\d+(\.\d{1,3})?$/ // 三位小数
export const fourDecimalReg = /^\d+(\.\d{1,4})?$/ // 4位小数
export const fiveDecimalReg = /^\d+(\.\d{1,5})?$/ // 5位小数
export const verificationCodeNullTip = '验证码不能为空！'
export const verificationCodeErrorTip = '验证码格式不正确！'
export const verificationCodeMismatch = '验证码不匹配！'
export const phoneNumberNullTip = '手机号码不能为空！'
export const phoneNumberErrorTip = '手机号码格式不正确！'
