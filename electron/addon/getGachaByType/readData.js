const fs = require("fs")
const path = require("path")
const { USER_DATA_PATH } = require("../../config")
const { getGachaDataFileName } = require("../../config/constants")

/**
 * 读取指定用户和卡池类型的抽卡数据
 * @param {string} id - 用户 ID (player_id)
 * @param {number} type - 卡池类型 (1:角色UP, 2:武器UP, 3:常驻角色, 4:常驻武器, 5:新手)
 * @returns {string|undefined} 返回 JSON 字符串，如果文件不存在则返回 undefined
 */
function readData(id, type) {
    const fileName = getGachaDataFileName(type)
    const filePath = path.join(USER_DATA_PATH, id, fileName)

    if (!fs.existsSync(filePath)) {
        return undefined
    }

    try {
        return fs.readFileSync(filePath, "utf-8")
    } catch (err) {
        console.error(`Failed to read gacha data: ${filePath}`, err)
        return undefined
    }
}

module.exports = {
    readData
}