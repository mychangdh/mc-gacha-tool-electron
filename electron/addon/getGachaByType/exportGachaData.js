
const xlsx = require("node-xlsx")
const fs = require("fs")
const dayjs = require("dayjs")
const { dialog } = require('electron');
const path = require("path");
const cardType = {
    0: "角色精准调谐",
    1: "武器精准调谐",
    2: "角色调谐（常驻池）",
    3: "武器调谐（常驻池）",
    4: "角色调谐（新手池）",
}
async function exportGachaData(e, data) {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        title: "请选择导出目录",
        properties: ['openDirectory']
    })
    if (canceled) return {
        code: 1,
        data: "用户已取消该操作"
    }
    const arr = []
    data.forEach((itemArr, cardIndex) => {
        itemArr.forEach((item, index) => {
            if (!arr[cardIndex]) arr[cardIndex] = { name: cardType[cardIndex], data: [] }
            if (arr[cardIndex].data.length === (itemArr.length - 1)) arr[cardIndex].data.unshift(["序号", cardType[cardIndex], "物品编号", "物品等级", "物品类型", "物品名称", "未出金抽数", "抽卡时间"])
            else arr[cardIndex].data.unshift([
                itemArr.length - index - 1, cardType[cardIndex], item.resourceId, item.qualityLevel, item.resourceType, item.name, item.count, item.time
            ])
        })
    })
    const buffer = xlsx.build(arr);
    const myPath = path.join(filePaths[0], `./抽卡数据${dayjs().format("YYYY年MM月DD分HH时mm分ss秒")}.xlsx`)
    fs.writeFileSync(myPath, buffer);
    return {
        code: 100000,
        data: "导出成功！",
        path: myPath
    }
}
module.exports = {
    exportGachaData
}