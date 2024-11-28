const { dialog, ipcMain, shell } = require('electron');
async function create() {

    ipcMain.handle("openFilesDialog", async () => {
        const result = await dialog.showOpenDialog(
            {
                title: '安装目录选择',
                defaultPath: '',
                filters: [

                ],
                properties: ["openDirectory"],
                buttonLabel: '选择'
            });
        return result
    })
    ipcMain.handle("openFile", (e, path) => {
        const result = shell.showItemInFolder(path)
        return result
    })
    ipcMain.on("openBrowser", async (e, path) => {
        shell.openExternal(path)
    })

}
module.exports = {
    create
}