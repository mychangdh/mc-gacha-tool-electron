const xlsx = require("node-xlsx")
const fs = require("fs")
const dayjs = require("dayjs")
const { dialog } = require('electron')
const path = require("path")
const { STATUS_CODE, CARD_POOL_NAMES, ERROR_MESSAGES } = require("../../config/constants")

/**
 * Excel 表格列标题
 */
const EXCEL_HEADERS = ["序号", "卡池类型", "物品编号", "物品等级", "物品类型", "物品名称", "未出金抽数", "抽卡时间"]

/**
 * 生成默认的导出文件名
 * @returns {string} 带时间戳的文件名
 */
function generateFileName() {
    const timestamp = dayjs().format("YYYY年MM月DD日HH时mm分ss秒")
    return `抽卡数据${timestamp}.xlsx`
}

/**
 * 显示文件保存对话框
 * @returns {Promise<{canceled: boolean, filePath?: string}>}
 */
async function showSaveDialog() {
    return await dialog.showSaveDialog({
        title: "请选择导出目录",
        defaultPath: generateFileName(),
        filters: [{ name: 'Excel 文件', extensions: ['xlsx', 'xls'] }],
        properties: ['openFile']
    })
}

/**
 * 将单条抽卡记录转换为 Excel 行数据
 * @param {Object} item - 抽卡记录
 * @param {number} index - 记录索引
 * @param {number} totalCount - 总记录数
 * @param {number} cardIndex - 卡池索引
 * @returns {Array} Excel 行数据
 */
function convertRecordToRow(item, index, totalCount, cardIndex) {
    const cardPoolName = CARD_POOL_NAMES[cardIndex]
    return [
        totalCount - index,        // 序号（倒序）
        cardPoolName,              // 卡池类型
        item.resourceId,           // 物品编号
        item.qualityLevel,         // 物品等级
        item.resourceType,         // 物品类型
        item.name,                 // 物品名称
        item.count,                // 未出金抽数
        item.time                  // 抽卡时间
    ]
}

/**
 * 转换卡池数据为 Excel 工作表格式
 * @param {Array<Array<Object>>} data - 所有卡池的抽卡数据
 * @returns {Array<{name: string, data: Array}>} Excel 工作表数组
 */
function convertToExcelSheets(data) {
    const sheets = []

    data.forEach((itemArr, cardIndex) => {
        if (!itemArr || itemArr.length === 0) return

        const cardPoolName = CARD_POOL_NAMES[cardIndex]
        const sheetData = []

        // 添加表头
        const headers = [...EXCEL_HEADERS]
        headers[1] = cardPoolName // 替换"卡池类型"为具体卡池名称
        sheetData.push(headers)

        // 倒序添加数据行（最新的在下面）
        for (let i = itemArr.length - 1; i >= 0; i--) {
            const row = convertRecordToRow(itemArr[i], i, itemArr.length, cardIndex)
            sheetData.push(row)
        }

        sheets.push({
            name: cardPoolName,
            data: sheetData
        })
    })

    return sheets
}

/**
 * 导出抽卡数据为 Excel 文件
 * @param {Event} e - IPC 事件对象
 * @param {Array<Array<Object>>} data - 抽卡数据数组，按卡池类型分组
 * @returns {Promise<{code: number, data: string, path?: string, directory?: string}>}
 */
async function exportGachaData(e, data) {
    try {
        // 显示保存对话框
        const { canceled, filePath } = await showSaveDialog()

        if (canceled) {
            return {
                code: STATUS_CODE.ERROR,
                data: ERROR_MESSAGES.EXPORT_CANCELED
            }
        }

        // 转换数据为 Excel 格式
        const sheets = convertToExcelSheets(data)

        if (sheets.length === 0) {
            return {
                code: STATUS_CODE.ERROR,
                data: "没有可导出的数据"
            }
        }

        // 构建 Excel 文件
        const buffer = xlsx.build(sheets)

        // 写入文件
        fs.writeFileSync(filePath, buffer)

        return {
            code: STATUS_CODE.SUCCESS,
            data: ERROR_MESSAGES.EXPORT_SUCCESS,
            path: filePath,
            directory: path.dirname(filePath)
        }
    } catch (err) {
        console.error("Failed to export gacha data:", err)
        return {
            code: STATUS_CODE.ERROR,
            data: `导出失败: ${err.message}`
        }
    }
}

module.exports = {
    exportGachaData
}