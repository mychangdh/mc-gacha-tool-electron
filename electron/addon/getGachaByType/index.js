const { ipcMain } = require("electron/main")
const { getInstalledApps } = require("get-installed-apps")
const path = require("path")
const fs = require("fs")
const { USER_DATA_PATH } = require("../../../config")
const axios = require("axios")
const { writeData } = require("./writeData")
const { readData } = require("./readData")
const { mergeData } = require("./mergeData")
const { forEach } = require("lodash")
const { exportGachaData } = require("./exportGachaData")
const getSearchParams = (url) => {
    // 获取查询参数前的 ? 对应的索引位置
    const searchIndex = url.indexOf('?')
    // 截取出查询参数字符串，并根据 & 将其分割成一个个 name=bruce 形式字符串组成的数组
    const searchParamsArray = url.slice(searchIndex + 1).split('&')
    // 遍历数组，组成查询参数对象
    return searchParamsArray.reduce((pre, cur) => {
        const [key, value] = cur.split('=')
        return {
            ...pre,
            // 需要使用 decodeURIComponent 对参数进行解码
            [key]: decodeURIComponent(value),
        }
    }, {})
}

function setMcPath(url) {
    if (!fs.existsSync(USER_DATA_PATH)) fs.mkdirSync(USER_DATA_PATH);
    fs.writeFileSync(path.join(USER_DATA_PATH, 'InstallPath'), url)
    return
}

async function getMcPostion() {
    if (fs.existsSync(path.join(USER_DATA_PATH, 'InstallPath'))) return
    const data = await getInstalledApps()
    const mc = data.find(item => item.appName.includes("鸣潮"))
    if (!mc) return "未找到安装目录呢，手动选择一下安装目录吧"
    setMcPath(mc.InstallPath)
    return
}
/** 得到网络地址，参数 1:up角色,2:up武器,3:常驻角色, 4:武器常驻,5:新手卡池 */
async function getUidParams() {
    const posError = await getMcPostion()
    if (posError) return {
        code: 3,
        data: posError
    }
    const mcInstallPath = fs.readFileSync(path.join(USER_DATA_PATH, 'InstallPath'), 'utf-8')
    let mcLogPath = path.resolve(mcInstallPath, "./Wuthering Waves Game/Client/Saved/Logs/Client.log")
    let text
    try {
        text = fs.readFileSync(mcLogPath, "utf-8")
    }
    catch {
        fs.unlinkSync(path.join(USER_DATA_PATH, 'InstallPath'))
        return {
            code: 1,
            data: "文件数据错误，请勿手动去本地修改文件！！！"
        }
    }
    const mcurl = text.match(/"https:\/\/aki-gm-resources.aki-game.com\/[\s\S]*?"/)[0].replace(/"/g, "")
    const mcParams = getSearchParams(mcurl)
    setUidList(mcParams.player_id)
    return {
        code: 100000,
        params: mcParams
    }
}
function getUidList() {
    const uidPath = `${USER_DATA_PATH}/uidList`
    if (!fs.existsSync(uidPath)) return []
    try {
        return JSON.parse(fs.readFileSync(uidPath, "utf-8"))
    }
    catch (err) {
        console.log(err);
        return []
    }
}
function setUidList(uid) {
    const uidPath = `${USER_DATA_PATH}/uidList`
    try {
        const uidList = getUidList()
        if (uidList.includes(uid)) return true
        fs.writeFileSync(uidPath, JSON.stringify([uid, ...uidList]))
        return true
    }
    catch (err) {
        console.log(err);
        return false
    }
}
const getMcData = async (cardPoolType = 1) => {
    const urlList = await getUidParams()
    if (urlList.code !== 100000) return urlList
    const mcParams = urlList.params
    const res = await axios({
        url: "https://gmserver-api.aki-game2.com/gacha/record/query",
        method: "post",
        data: {
            cardPoolId: mcParams.resources_id,
            languageCode: "zh-Hans",
            playerId: mcParams.player_id,
            recordId: mcParams.record_id,
            serverId: mcParams.svr_id,
            cardPoolType: cardPoolType
        },
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0",
            "Content-Type": "application/json;text/plain;*/*"
        }
    })

    if (res.data.code !== 0) return {
        code: 2,
        data: "网络错误或链接已过期,请重新打开抽卡界面后再刷新"
    }
    const fileData = readData(String(mcParams.player_id), cardPoolType)
    let resData
    if (fileData) {
        try {
            /** 尝试合并数据 */
            resData = mergeData(JSON.parse(fileData), res.data.data)
        }
        catch (err) {
            resData = res.data.data
        }
    }
    else resData = mergeData([], res.data.data)

    writeData(String(mcParams.player_id), cardPoolType, JSON.stringify(resData))

    return {
        code: 100000,
        playerId: mcParams.player_id,
        data: resData
    }
}



function create() {
    ipcMain.handle("getMcPostion", getMcPostion)
    ipcMain.on("setMcPostion", (e, path) => {
        setMcPath(path)
    })

    ipcMain.handle("getUidParams", () => {
        return getUidParams()
    })
    ipcMain.handle("getUrlList", () => {
        return getUidList()
    })
    ipcMain.handle("exportGachaData", exportGachaData)
    ipcMain.handle("updateAllGachaByType", async () => {
        const data = {}
        for (let i = 1; i <= 5; i++) {
            const res = await getMcData(i)
            if (res.code === 100000) {
                data[`CardType_${i}`] = res.data
            }
            else {
                return res
            }
        }
        return {
            code: 100000,
            data
        }
    })
    ipcMain.handle("getOldAllGachaByType", async () => {
        const urlList = await getUidParams()
        const uid = urlList?.params?.player_id || getUidList()[0]
        if (!uid) return {
            code: 1,
            data: "安装路径错误，请手动选择安装路径"
        }
        const data = {}
        for (let i = 1; i <= 5; i++) {
            const file = readData(uid, i)
            try {
                if (file) data[`CardType_${i}`] = JSON.parse(file)
                else data[`CardType_${i}`] = []
            }
            catch (err) {
                data[`CardType_${i}`] = []
            }
        }
        return data
    })

}
module.exports = {
    create
}