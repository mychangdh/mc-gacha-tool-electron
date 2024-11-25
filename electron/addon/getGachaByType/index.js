const { ipcMain } = require("electron/main")
const { getInstalledApps } = require("get-installed-apps")
const path = require("path")
const fs = require("fs")
const axios = require("axios")
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
async function getMcPostion() {
    const data = await getInstalledApps()
    const mc = data.find(item => item.appName.includes("鸣潮"))
    if (!mc) return null
    return mc.InstallPath
}
function create() {
    ipcMain.handle("getMcPostion", getMcPostion)
    /** 参数 1:up角色,2:up武器,3:常驻角色, 4:武器常驻,5:新手卡池 */
    ipcMain.handle("getGachaByType", async (e, cardPoolType = 1) => {
        const mcInitPath = await getMcPostion()
        if (!mcInitPath) return
        const mcPath = path.resolve(mcInitPath, "./Wuthering Waves Game/Client/Saved/Logs/Client.log")
        const text = fs.readFileSync(mcPath, "utf-8")
        const mcurl = text.match(/"https:\/\/aki-gm-resources.aki-game.com\/[\s\S]*?"/)[0].replace(/"/g, "")
        const mcParams = getSearchParams(mcurl)
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

        fs.writeFileSync(path.join(__dirname, './data.json'), JSON.stringify(res.data), 'utf-8')

        return res.data
    })

}
module.exports = {
    create
}