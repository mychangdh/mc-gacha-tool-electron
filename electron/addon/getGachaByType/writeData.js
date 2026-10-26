const fs = require("fs")
const path = require("path")
const { USER_DATA_PATH } = require("../../config")
const { getGachaDataFileName } = require("../../config/constants")

/**
 * 确保目录存在，如果不存在则创建
 * @param {string} dirPath - 目录路径
 */
function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
    }
}

/**
 * 写入抽卡数据到本地文件
 * @param {string} id - 用户 ID (player_id)
 * @param {number} type - 卡池类型
 * @param {string} data - JSON 字符串格式的抽卡数据
 * @returns {boolean} 写入成功返回 true，失败返回 false
 */
function writeData(id, type, data) {
    try {
        ensureDirectoryExists(USER_DATA_PATH)

        const userDir = path.join(USER_DATA_PATH, id)
        ensureDirectoryExists(userDir)

        const fileName = getGachaDataFileName(type)
        const filePath = path.join(userDir, fileName)

        fs.writeFileSync(filePath, data, "utf-8")
        return true
    } catch (err) {
        console.error(`Failed to write gacha data for user ${id}, type ${type}:`, err)
        return false
    }
}

module.exports = {
    writeData
}