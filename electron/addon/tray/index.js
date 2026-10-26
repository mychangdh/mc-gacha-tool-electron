const { Tray, Menu, app } = require('electron');
const path = require('path');

/**
 * 托盘插件
 */
class TrayAddon {

  constructor() {
    this.tray = null;
  }

  /**
   * 创建托盘
   */
  create () {
    console.log('[addon:tray] load');

    const mainModule = require('../../../main.js');
    const mainWindow = mainModule.getMainWindow();
    const config = mainModule.getConfig();
    const cfg = config.addons.tray;

    // 托盘图标
    let iconPath = path.join(app.getAppPath(), cfg.icon);

    // 托盘菜单功能列表
    let trayMenuTemplate = [
      {
        label: '显示',
        click: function () {
          mainWindow.show();
        }
      },
      {
        label: '退出',
        click: function () {
          app.quit();
        }
      }
    ];

    // 点击关闭，最小化到托盘
    mainWindow.on('close', (event) => {
      mainWindow.hide();
      event.preventDefault();
    });

    // 实例化托盘
    this.tray = new Tray(iconPath);
    this.tray.setToolTip(cfg.title);
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
    this.tray.setContextMenu(contextMenu);
    this.tray.on('double-click', () => {
      mainWindow.show();
    });
  }
}

const trayAddon = new TrayAddon();
module.exports = trayAddon;