const fs = require("fs")
const path = require("path")
const { USER_DATA_PATH } = require("../../../config")
function readData(id, type) {
    if (!fs.existsSync(`${USER_DATA_PATH}/${id}/gachaByType${type}.json`)) return undefined
    return fs.readFileSync(path.join(USER_DATA_PATH, id, `gachaByType${type}.json`), "utf-8")
}
module.exports = {
    readData
}