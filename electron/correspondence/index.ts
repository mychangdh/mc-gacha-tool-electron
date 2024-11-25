import { BrowserWindow, ipcMain, ipcRenderer } from "electron";
import getAppPath from "./getAppPath";

export default function correspondence(win: BrowserWindow) {
    ipcMain.handle('getAppPath', getAppPath)
}