const fs = require("fs")
const path = require("path")
const { USER_DATA_PATH } = require("../../config")
function writeData(id, type, data) {
    if (!fs.existsSync(USER_DATA_PATH)) fs.mkdirSync(USER_DATA_PATH);
    if (!fs.existsSync(path.join(USER_DATA_PATH, id))) fs.mkdirSync(path.join(USER_DATA_PATH, id));
    fs.writeFileSync(path.join(USER_DATA_PATH, id, `gachaByType${type}.json`), data)
    return
}
module.exports = {
    writeData
}