const { ipcMain } = require("electron/main")
const { getInstalledApps } = require("get-installed-apps")
const path = require("path")
const { app } = require("electron")
const fs = require("fs")
const { USER_DATA_PATH } = require("../../config")
const axios = require("axios")
const { writeData } = require("./writeData")
const { readData } = require("./readData")
const { mergeData } = require("./mergeData")
const { exportGachaData } = require("./exportGachaData")
const { extractUrlFromEncryptedLog } = require("./decryptLog")
const {
    STATUS_CODE,
    GAME_PATHS,
    API,
    REGEX_PATTERNS,
    HTTP_HEADERS,
    ERROR_MESSAGES,
    FILE_NAMES,
    ALL_CARD_POOL_TYPES,
    buildApiUrl
} = require("../../config/constants")

// ==================== 文件路径管理 ====================

const mcInstallFilePath = path.join(USER_DATA_PATH, FILE_NAMES.INSTALL_PATH)
const uidListPath = path.join(USER_DATA_PATH, FILE_NAMES.UID_LIST)
const gachaUrlPath = path.join(USER_DATA_PATH, FILE_NAMES.USER_URL_PATH)

/**
 * 确保用户数据目录存在
 */
function ensureUserDataDir() {
    if (!fs.existsSync(USER_DATA_PATH)) {
        fs.mkdirSync(USER_DATA_PATH, { recursive: true })
    }
}

/**
 * 保存游戏安装路径
 * @param {string} installPath - 游戏安装路径
 */
function setMcPath(installPath) {
    try {
        ensureUserDataDir()
        fs.writeFileSync(mcInstallFilePath, installPath, "utf-8")
        console.log(`Game install path saved: ${installPath}`)
    } catch (err) {
        console.error("Failed to save game install path:", err)
    }
}

// ==================== URL 参数解析 ====================

/**
 * 解析 URL 查询参数
 * @param {string} url - 完整的 URL 字符串
 * @returns {Object} 解析后的参数对象
 * @example
 * getSearchParams("https://example.com?a=1&b=2")
 * // 返回 { a: "1", b: "2" }
 */
function getSearchParams(url) {
    const searchIndex = url.indexOf('?')
    if (searchIndex === -1) return {}

    const searchParamsArray = url.slice(searchIndex + 1).split('&')
    return searchParamsArray.reduce((pre, cur) => {
        const [key, value] = cur.split('=')
        return {
            ...pre,
            [key]: decodeURIComponent(value)
        }
    }, {})
}

// ==================== 游戏路径检测 ====================

/**
 * 尝试从库街区启动器配置读取游戏安装路径
 * @returns {string|null} 游戏安装路径，失败返回 null
 */
function tryGetPathFromKRLauncher() {
    try {
        const home = app.getPath("home")
        const krConfigPath = path.join(home, GAME_PATHS.KR_LAUNCHER)

        if (!fs.existsSync(krConfigPath)) {
            return null
        }

        const configData = fs.readFileSync(krConfigPath, "utf-8")
        const config = JSON.parse(configData)
        return config.path ? path.join(config.path, "./") : null
    } catch (err) {
        console.error("Failed to read KR Launcher config:", err)
        return null
    }
}

/**
 * 尝试通过系统已安装应用列表查找游戏
 * @returns {Promise<string|null>} 游戏安装路径，失败返回 null
 */
async function tryGetPathFromInstalledApps() {
    try {
        const apps = await getInstalledApps()
        const mcApp = apps.find(item => item.appName && item.appName.includes("鸣潮"))

        if (!mcApp) {
            return null
        }

        return mcApp.InstallPath || mcApp.InstallLocation || null
    } catch (err) {
        console.error("Failed to get installed apps:", err)
        return null
    }
}

/**
 * 自动检测游戏安装路径
 * @returns {Promise<string|undefined>} 成功返回 undefined，失败返回错误消息
 */
async function efficacyMcPath() {
    // 如果已有保存的路径，直接返回
    if (fs.existsSync(mcInstallFilePath)) {
        return undefined
    }

    // 尝试从已安装应用列表获取
    let installPath = await tryGetPathFromInstalledApps()

    // 尝试从库街区启动器配置获取
    if (!installPath) {
        installPath = tryGetPathFromKRLauncher()
    }

    // 都失败了，返回错误消息
    if (!installPath) {
        return ERROR_MESSAGES.PATH_NOT_FOUND
    }

    setMcPath(installPath)
    return undefined
}

// ==================== 日志文件读取 ====================

/**
 * 查找游戏日志文件路径
 * @param {string} installPath - 游戏安装路径
 * @returns {{path: string|null, error: string|null}} 日志路径或错误信息
 */
function findGameLogPath(installPath) {
    // 官服日志路径
    const officialLogPath = path.join(installPath, GAME_PATHS.OFFICIAL)
    // WeGame 日志路径
    const wegameLogPath = path.join(installPath, GAME_PATHS.WEGAME)

    if (fs.existsSync(officialLogPath)) {
        return { path: officialLogPath, error: null }
    }

    if (fs.existsSync(wegameLogPath)) {
        return { path: wegameLogPath, error: null }
    }

    return {
        path: null,
        error: ERROR_MESSAGES.PATH_NOT_FOUND
    }
}

/**
 * 从游戏日志中提取抽卡 URL（支持加密日志）
 *
 * 从 3.4 版本开始，库洛对客户端日志进行了 XOR 加密
 * 本函数会先尝试使用解密方式读取，如果失败则回退到普通读取
 *
 * @param {string} logPath - 日志文件路径
 * @returns {{url: string|null, error: string|null}} URL 或错误信息
 */
function extractGachaUrlFromLog(logPath) {
    try {
        // 先尝试使用解密方式读取（适用于 3.4+ 版本）
        const decryptResult = extractUrlFromEncryptedLog(logPath, REGEX_PATTERNS.GACHA_URL)

        if (decryptResult.url) {
            console.log("Successfully extracted URL from encrypted log")
            return decryptResult
        }

        // 如果解密方式没找到 URL，尝试普通读取（兼容旧版本）
        console.log("Attempting to read log without decryption...")
        const logContent = fs.readFileSync(logPath, "utf-8")
        const match = logContent.match(REGEX_PATTERNS.GACHA_URL)

        if (!match) {
            return {
                url: null,
                error: ERROR_MESSAGES.NEED_OPEN_GACHA
            }
        }

        const url = match[0].replace(/"/g, "")
        console.log("Successfully extracted URL from plain log")
        return { url, error: null }

    } catch (err) {
        console.error("Failed to read game log:", err)
        return {
            url: null,
            error: ERROR_MESSAGES.NEED_OPEN_GACHA
        }
    }
}

// ==================== UID 管理 ====================

/**
 * 获取已保存的 UID 列表
 * @returns {Array<string>} UID 列表
 */
function getUidList() {
    if (!fs.existsSync(uidListPath)) {
        return []
    }

    try {
        const content = fs.readFileSync(uidListPath, "utf-8")
        return JSON.parse(content)
    } catch (err) {
        console.error("Failed to read UID list:", err)
        return []
    }
}

/**
 * 保存新的 UID 到列表
 * @param {string} uid - 用户 ID
 * @returns {boolean} 成功返回 true
 */
function setUidList(uid) {
    try {
        ensureUserDataDir()
        const uidList = getUidList()

        if (uidList.includes(uid)) {
            return true
        }

        const newList = [uid, ...uidList]
        fs.writeFileSync(uidListPath, JSON.stringify(newList), "utf-8")
        return true
    } catch (err) {
        console.error("Failed to save UID list:", err)
        return false
    }
}

// ==================== 获取抽卡参数 ====================

/**
 * 获取抽卡 API 所需的 URL 参数
 * @returns {Promise<{code: number, params?: Object, data?: string}>}
 */
async function getUidParams() {
    // 1. 检查游戏路径是否有效
    const pathError = await efficacyMcPath()
    if (pathError) {
        return {
            code: STATUS_CODE.PATH_ERROR,
            data: pathError
        }
    }

    // 2. 读取已保存的游戏安装路径
    const mcInstallPath = fs.readFileSync(mcInstallFilePath, 'utf-8')

    // 3. 查找游戏日志文件
    const { path: logPath, error: pathError2 } = findGameLogPath(mcInstallPath)
    if (!logPath) {
        fs.unlinkSync(mcInstallFilePath)
        return {
            code: STATUS_CODE.ERROR,
            data: pathError2
        }
    }

    // 4. 从日志中提取抽卡 URL
    const { url: mcUrl, error: urlError } = extractGachaUrlFromLog(logPath)
    if (!mcUrl) {
        return {
            code: STATUS_CODE.ERROR,
            data: urlError
        }
    }

    // 5. 解析 URL 参数
    const mcParams = getSearchParams(mcUrl)

    // 6. 保存 UID 和 URL
    setUidList(mcParams.player_id)
    ensureUserDataDir()
    fs.writeFileSync(gachaUrlPath, mcUrl, "utf-8")

    return {
        code: STATUS_CODE.SUCCESS,
        params: mcParams
    }
}

// ==================== 抽卡数据获取 ====================

/**
 * 从服务器获取抽卡数据
 * @param {Object} params - URL 参数对象
 * @param {number} cardPoolType - 卡池类型
 * @returns {Promise<Object>} API 响应数据
 */
async function fetchGachaDataFromServer(params, cardPoolType) {
    const apiUrl = buildApiUrl(params.player_id)

    const response = await axios({
        url: apiUrl,
        method: "post",
        data: {
            cardPoolId: params.resources_id,
            languageCode: API.LANGUAGE_CODE,
            playerId: params.player_id,
            recordId: params.record_id,
            serverId: params.svr_id,
            cardPoolType: cardPoolType
        },
        headers: HTTP_HEADERS
    })

    return response.data
}

/**
 * 获取指定卡池类型的抽卡数据（核心函数）
 * @param {number} cardPoolType - 卡池类型 (1-5)
 * @returns {Promise<{code: number, playerId?: string, data?: Array}>}
 */
async function getMcData(cardPoolType = 1) {
    try {
        // 1. 获取 URL 参数
        const urlResult = await getUidParams()
        if (urlResult.code !== STATUS_CODE.SUCCESS) {
            return urlResult
        }

        const mcParams = urlResult.params

        // 2. 从服务器获取数据
        const serverResponse = await fetchGachaDataFromServer(mcParams, cardPoolType)

        if (serverResponse.code !== 0) {
            return {
                code: STATUS_CODE.NETWORK_ERROR,
                data: ERROR_MESSAGES.NETWORK_ERROR
            }
        }

        // 3. 读取本地数据
        const localData = readData(String(mcParams.player_id), cardPoolType)
        let parsedLocalData = []

        if (localData) {
            try {
                parsedLocalData = JSON.parse(localData)
            } catch (err) {
                console.error("Failed to parse local data, will use server data only:", err)
            }
        }

        // 4. 合并数据
        const mergedData = mergeData(parsedLocalData, serverResponse.data)

        // 5. 保存到本地
        writeData(String(mcParams.player_id), cardPoolType, JSON.stringify(mergedData))

        return {
            code: STATUS_CODE.SUCCESS,
            playerId: mcParams.player_id,
            data: mergedData
        }
    } catch (err) {
        console.error(`Failed to get gacha data for type ${cardPoolType}:`, err)
        return {
            code: STATUS_CODE.NETWORK_ERROR,
            data: ERROR_MESSAGES.NETWORK_ERROR
        }
    }
}

// ==================== IPC 处理器注册 ====================

/**
 * 更新所有卡池类型的抽卡数据
 * @returns {Promise<{code: number, data?: Object}>}
 */
async function updateAllGachaByType() {
    const data = {}

    for (const cardPoolType of ALL_CARD_POOL_TYPES) {
        const res = await getMcData(cardPoolType)

        if (res.code === STATUS_CODE.SUCCESS) {
            data[`CardType_${cardPoolType}`] = res.data
        } else {
            return res
        }
    }

    return {
        code: STATUS_CODE.SUCCESS,
        data
    }
}

/**
 * 获取本地所有卡池类型的抽卡数据
 * @param {Event} e - IPC 事件对象
 * @param {string} thisUid - 指定的用户 ID（可选）
 * @returns {Promise<{code?: number, data?: string, requiredNone?: boolean, CardType_1-5?: Array}>}
 */
async function getOldAllGachaByType(e, thisUid) {
    const urlList = await getUidParams()
    const uid = thisUid || urlList?.params?.player_id || getUidList()[0]

    if (!uid) {
        return {
            code: STATUS_CODE.ERROR,
            data: ERROR_MESSAGES.INSTALL_PATH_ERROR
        }
    }

    let requiredNone = true
    const data = {}

    for (const cardPoolType of ALL_CARD_POOL_TYPES) {
        const file = readData(uid, cardPoolType)

        if (file) {
            requiredNone = false
        }

        try {
            data[`CardType_${cardPoolType}`] = file ? JSON.parse(file) : []
        } catch (err) {
            console.error(`Failed to parse data for CardType_${cardPoolType}:`, err)
            data[`CardType_${cardPoolType}`] = []
        }
    }

    return {
        ...data,
        requiredNone
    }
}

/**
 * 获取已保存的游戏安装路径
 * @returns {string} 安装路径，不存在返回空字符串
 */
function getInstallPath() {
    if (!fs.existsSync(mcInstallFilePath)) {
        return ""
    }

    try {
        return fs.readFileSync(mcInstallFilePath, "utf-8")
    } catch (err) {
        console.error("Failed to read install path:", err)
        return ""
    }
}

/**
 * 获取已保存的抽卡 URL
 * @returns {string} 抽卡 URL，不存在返回空字符串
 */
function getGachaPath() {
    if (!fs.existsSync(gachaUrlPath)) {
        return ""
    }

    try {
        return fs.readFileSync(gachaUrlPath, "utf-8")
    } catch (err) {
        console.error("Failed to read gacha URL:", err)
        return ""
    }
}

/**
 * 注册所有 IPC 通信处理器
 */
function create() {
    // 验证游戏路径
    ipcMain.handle("efficacyMcPath", efficacyMcPath)

    // 设置游戏安装路径
    ipcMain.on("setMcPostion", (e, installPath) => {
        setMcPath(installPath)
    })

    // 获取 UID 参数
    ipcMain.handle("getUidParams", getUidParams)

    // 获取 UID 列表
    ipcMain.handle("getUrlList", getUidList)

    // 导出抽卡数据
    ipcMain.handle("exportGachaData", exportGachaData)

    // 更新所有卡池数据
    ipcMain.handle("updateAllGachaByType", updateAllGachaByType)

    // 获取本地所有卡池数据
    ipcMain.handle("getOldAllGachaByType", getOldAllGachaByType)

    // 获取游戏安装路径
    ipcMain.handle("getInstallPath", getInstallPath)

    // 获取抽卡 URL
    ipcMain.handle("getGachaPath", getGachaPath)

    console.log("Gacha service IPC handlers registered successfully")
}

module.exports = {
    create
}
