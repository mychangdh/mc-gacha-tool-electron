const { VERSION } = require("../../config")
const { ipcMain } = require("electron")
function create() {

    ipcMain.handle("getVersion", () => {
        return VERSION
    })
}
module.exports = {
    create
}