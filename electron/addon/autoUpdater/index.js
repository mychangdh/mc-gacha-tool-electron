const { app: electronApp } = require('electron');
const { autoUpdater } = require("electron-updater");
const os = require('os');

/**
 * 自动升级插件
 */
class AutoUpdaterAddon {

  constructor() {
  }

  /**
   * 创建
   */
  create () {
    console.log('[addon:autoUpdater] load');

    const mainModule = require('../../../main.js');
    const config = mainModule.getConfig();
    const cfg = config.addons.autoUpdater;

    if ((os.platform() === 'win32' && cfg.windows)
        || (os.platform() === 'darwin' && cfg.macOS)
        || (os.platform() === 'linux' && cfg.linux))
    {
      // continue
    } else {
      return;
    }

    // 是否检查更新
    if (cfg.force) {
      this.checkUpdate();
    }

    const status = {
      error: -1,
      available: 1,
      noAvailable: 2,
      downloading: 3,
      downloaded: 4,
    };

    const version = electronApp.getVersion();
    console.log('[addon:autoUpdater] current version: ', version);

    // 设置下载服务器地址
    let server = cfg.options.url;
    let lastChar = server.substring(server.length - 1);
    server = lastChar === '/' ? server : server + "/";
    cfg.options.url = server;

    // 是否后台自动下载
    autoUpdater.autoDownload = cfg.force ? true : false;

    try {
      autoUpdater.setFeedURL(cfg.options);
    } catch (error) {
      console.error('[addon:autoUpdater] setFeedURL error : ', error);
    }

    autoUpdater.on('checking-for-update', () => {
      //sendStatusToWindow('正在检查更新...');
    });
    autoUpdater.on('update-available', (info) => {
      info.status = status.available;
      info.desc = '有可用更新';
      this.sendStatusToWindow(info);
    });
    autoUpdater.on('update-not-available', (info) => {
      info.status = status.noAvailable;
      info.desc = '没有可用更新';
      this.sendStatusToWindow(info);
    });
    autoUpdater.on('error', (err) => {
      let info = {
        status: status.error,
        desc: err
      };
      this.sendStatusToWindow(info);
    });
    autoUpdater.on('download-progress', (progressObj) => {
      let percentNumber = parseInt(progressObj.percent);
      let totalSize = this.bytesChange(progressObj.total);
      let transferredSize = this.bytesChange(progressObj.transferred);
      let text = '已下载 ' + percentNumber + '%';
      text = text + ' (' + transferredSize + "/" + totalSize + ')';

      let info = {
        status: status.downloading,
        desc: text,
        percentNumber: percentNumber,
        totalSize: totalSize,
        transferredSize: transferredSize
      };
      console.log('[addon:autoUpdater] progress: ', text);
      this.sendStatusToWindow(info);
    });
    autoUpdater.on('update-downloaded', (info) => {
      info.status = status.downloaded;
      info.desc = '下载完成';
      this.sendStatusToWindow(info);

      autoUpdater.quitAndInstall();
    });
  }

  /**
   * 检查更新
   */
  checkUpdate () {
    autoUpdater.checkForUpdates();
  }

  /**
   * 下载更新
   */
  download () {
    autoUpdater.downloadUpdate();
  }

  /**
   * 向前端发消息
   */
  sendStatusToWindow(content = {}) {
    const textJson = JSON.stringify(content);
    const channel = 'app.updater';
    const mainModule = require('../../../main.js');
    const win = mainModule.getMainWindow();
    win.webContents.send(channel, textJson);
  }

  /**
   * 单位转换
   */
  bytesChange (limit) {
    let size = "";
    if(limit < 0.1 * 1024){
      size = limit.toFixed(2) + "B";
    }else if(limit < 0.1 * 1024 * 1024){
      size = (limit/1024).toFixed(2) + "KB";
    }else if(limit < 0.1 * 1024 * 1024 * 1024){
      size = (limit/(1024 * 1024)).toFixed(2) + "MB";
    }else{
      size = (limit/(1024 * 1024 * 1024)).toFixed(2) + "GB";
    }

    let sizeStr = size + "";
    let index = sizeStr.indexOf(".");
    let dou = sizeStr.substring(index + 1 , index + 3);
    if(dou == "00"){
        return sizeStr.substring(0, index) + sizeStr.substring(index + 3, index + 5);
    }

    return size;
  }
}

const autoUpdaterAddon = new AutoUpdaterAddon();
module.exports = autoUpdaterAddon;