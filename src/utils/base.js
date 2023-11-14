/**
 * 对于10000以上的数据做转换（配合单位转换）
 * 保留小数位数时不做四舍五入，默认保留2位小数
 * convertToWanArr(99999.99)=>[9.9, '万'] , convertToWanArr(44.89, 0)=>[44, '']
 * @param { type: number, desc: 需要转换的数值 } num
 * @param { type: number, desc: 保留小数位数 } decimalPlaces
 * @return { type: array, desc: 转化后的数字和单位}
 */

export function convertToWanArr(num, decimal = 2) {
  const thresholds = [10000, 10000, 10000]
  const units = ['万', '亿', '万亿']
  if (num === '' || num === null || isNaN(num)) {
    return ['--', '']
  }

  let newUnit = ''
  let newNum = num

  for (let i = 0; i < thresholds.length; i++) {
    const t = thresholds[i]
    if (Math.abs(newNum) >= t) {
      newNum /= t
      newUnit = units[i]
    } else {
      break
    }
  }

  newNum = Math.trunc(newNum * Math.pow(10, decimal)) / Math.pow(10, decimal)
  return [newNum, newUnit]
}

// 保留小数位数时不做四舍五入
export const numFloorFormat = (num, decimal = 2, nodataSymbol = '--') => {
  if (num === '' || num === null) {
    return nodataSymbol
  }

  if (isNaN(num)) {
    return nodataSymbol
  }
  const n = Number(num)
  return Math.trunc(n * Math.pow(10, decimal)) / Math.pow(10, decimal)
}
