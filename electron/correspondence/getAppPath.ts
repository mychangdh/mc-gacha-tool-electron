import { BrowserWindow } from "electron";
import { getWinInstalledApps } from 'get-installed-apps'

export default async function () {
    const arr: {
        name: string,
        path: string
    }[] = []
    const apps = await getWinInstalledApps()
    apps.forEach((item: any) => {
        console.log(item,3543);
        
        arr.push({
            name: item.appName,
            path: item.InstallLocation
        })
    })
    return arr
}