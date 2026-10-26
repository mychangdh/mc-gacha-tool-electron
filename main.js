const { app, BrowserWindow } = require('electron');
const path = require('path');
const { loadConfig } = require('./electron/utils/configLoader');

let mainWindow = null;
let config = null;

/**
 * 创建主窗口
 */
function createWindow() {
  config = loadConfig();
  const windowOptions = config.windowsOption;

  mainWindow = new BrowserWindow(windowOptions);

  // 加载页面
  const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local';
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    if (config.openDevTools) {
      const devToolsMode = typeof config.openDevTools === 'object' ? config.openDevTools.mode : 'undocked';
      mainWindow.webContents.openDevTools({ mode: devToolsMode });
    }
  } else {
    const indexPath = path.join(__dirname, 'public', 'dist', 'index.html');
    mainWindow.loadFile(indexPath);
  }

  // 延迟显示窗口（避免白屏）
  if (windowOptions.show === false) {
    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
      mainWindow.focus();
    });
  }

  // 应用菜单
  if (!config.openAppMenu) {
    mainWindow.setMenu(null);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * 加载所有插件
 */
function loadAddons() {
  const addonsConfig = config.addons;

  // 安全模块
  if (addonsConfig.security && addonsConfig.security.enable) {
    const securityAddon = require('./electron/addon/security');
    securityAddon.create();
  }

  // 唤醒协议
  if (addonsConfig.awaken && addonsConfig.awaken.enable) {
    const awakenAddon = require('./electron/addon/awaken');
    awakenAddon.create();
  }

  // 系统托盘
  if (addonsConfig.tray && addonsConfig.tray.enable) {
    const trayAddon = require('./electron/addon/tray');
    trayAddon.create();
  }

  // 自动更新
  if (addonsConfig.autoUpdater && addonsConfig.autoUpdater.enable) {
    const autoUpdaterAddon = require('./electron/addon/autoUpdater');
    autoUpdaterAddon.create();
  }

  // 核心功能模块（始终加载）
  const getGachaByType = require('./electron/addon/getGachaByType');
  getGachaByType.create();

  const getConfig = require('./electron/addon/getConfig');
  getConfig.create();

  const openFilesDialog = require('./electron/addon/openFilesDialog');
  openFilesDialog.create();

  const clipboardTool = require('./electron/addon/clipboardTool');
  clipboardTool.create();
}

/**
 * 应用初始化
 */
app.whenReady().then(() => {
  // 加载配置
  config = loadConfig();

  // 硬件加速
  if (config.hardGpu && !config.hardGpu.enable) {
    app.disableHardwareAcceleration();
  }

  // 加载所有插件
  loadAddons();

  // 创建窗口
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

/**
 * 所有窗口关闭
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * 异常捕获
 */
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// 导出主窗口（供插件使用）
module.exports = {
  getMainWindow: () => mainWindow,
  getConfig: () => config
};