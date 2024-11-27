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
    ipcMain.handle("openFile", async (e, path) => {
        const result = await shell.openPath(path)
        return result
    })

}
module.exports = {
    create
}