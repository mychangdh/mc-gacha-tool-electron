const { clipboard, ipcMain } = require('electron')
function create() {
    ipcMain.on("copy", (e, text) => {
        clipboard.writeText(text)
    })
    ipcMain.handle("readClipboard", () => {
        return clipboard.readText()
    })
}
module.exports = {
    create
}