const { QUALITY_LEVEL } = require("../../config/constants")

/**
 * 移除数组中的重复元素（已废弃，当前未使用）
 * @deprecated
 * @param {Array} arr - 输入数组
 * @returns {Array} 去重后的数组
 */
function removeDuplicate(arr) {
    let len = arr.length
    for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
            if (arr[i] === arr[j]) {
                arr.splice(j, 1)
                len-- // 减少循环次数提高性能
                j-- // 保证j的值自加后不变
            }
        }
    }
    return arr
}

/**
 * 为抽卡记录设置保底计数
 * 从最新记录开始倒序计算，遇到5星物品时重置计数
 * @param {Array<Object>} result - 抽卡记录数组
 * @returns {Array<Object>} 添加了 count 字段的抽卡记录数组
 */
function setCount(result) {
    let goldNum = 0

    // 从最新记录（数组末尾）开始倒序遍历
    for (let i = result.length - 1; i >= 0; i--) {
        goldNum++
        result[i].count = goldNum

        // 遇到5星物品时重置计数
        if (result[i].qualityLevel === QUALITY_LEVEL.FIVE_STAR) {
            goldNum = 0
        }
    }

    return result
}
/**
 * 比较两条抽卡记录是否相同
 * @param {Object} a - 第一条记录
 * @param {Object} b - 第二条记录
 * @returns {boolean} 如果时间和名称都相同则返回 true
 */
function isSameRecord(a, b) {
    return (a.time === b.time) && (a.name === b.name)
}

/**
 * 将日期时间字符串转换为数字用于比较
 * @param {string} date - 日期时间字符串，格式: "2024-10-26 12:00:00"
 * @returns {number} 转换后的数字
 * @example
 * getDateNumber("2024-10-26 12:00:00") // 返回 20241026120000
 */
function getDateNumber(date) {
    const numStr = date.replace(/-/g, "").replace(/:/g, "").replace(/ /g, "")
    return parseInt(numStr, 10)
}

/**
 * 确保数据按时间倒序排列（最新的在前）
 * @param {Array<Object>} data - 抽卡记录数组
 * @returns {Array<Object>} 排序后的数组
 */
function ensureDescendingOrder(data) {
    if (data.length === 0) return data

    // 检查是否需要反转（如果第一条记录的时间早于最后一条）
    if (getDateNumber(data[0].time) < getDateNumber(data[data.length - 1].time)) {
        return data.reverse()
    }

    return data
}

/**
 * 合并本地旧数据和从服务器获取的新数据
 *
 * 合并策略:
 * 1. 新数据按时间倒序排列（最新的在前）
 * 2. 找到新数据中与本地最新记录重复的位置
 * 3. 只保留新数据中不重复的部分，追加到本地数据前面
 * 4. 重新计算保底计数
 *
 * @param {Array<Object>} oldData - 本地已有的抽卡记录
 * @param {Array<Object>} data - 从服务器获取的新抽卡记录
 * @returns {Array<Object>} 合并后的抽卡记录数组
 */
function mergeData(oldData, data) {
    // 边界情况处理
    if (!oldData.length) return setCount(data)
    if (!data.length) return setCount(oldData)

    // 确保新数据按时间倒序排列
    const sortedNewData = ensureDescendingOrder([...data])

    // 获取本地最新的一条记录
    const latestLocalRecord = oldData[0]

    // 找到新数据中与本地数据重复的位置
    let duplicateIndex = 0
    for (; duplicateIndex < sortedNewData.length; duplicateIndex++) {
        if (isSameRecord(latestLocalRecord, sortedNewData[duplicateIndex])) {
            break
        }
    }

    // 合并数据：只取新数据中不重复的部分
    const result = [...sortedNewData.slice(0, duplicateIndex), ...oldData]

    return setCount(result)
}
module.exports = {
    mergeData
}