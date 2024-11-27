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
function setCount(result) {
    let goldNum = 0
    for (let i = (result.length - 1); i >= 0; i--) {
        goldNum++
        result[i].count = goldNum
        if (result[i].qualityLevel === 5) {
            goldNum = 0
        }
    }
    return result
}
/** 
 * @param {Array} oldData 
 * @param {Array} data 
 */
function mergeData(oldData, data) {
    if (!oldData.length) return setCount(data)
    if (!data.length) return setCount(oldData)
    const latestData = oldData[0]
    if (getDataNum(data[0].time) < getDataNum(data[data.length - 1].time)) data.reverse()
    let i = 0
    for (; i < data.length; i++) {
        if (diffData(latestData, data[i])) {
            break
        }
    }
    let result = [...data.slice(0, i), ...oldData]

    return setCount(result)
}
function diffData(a, b) {
    return (a.time === b.time) && (a.name === b.name)
}
/** 
 * @param {string} date 
 */
function getDataNum(date) {
    const numStr = date.replace(/-/, "").replace(/:/, "").replace(/ /, "")
    return parseInt(numStr)
}
module.exports = {
    mergeData
}