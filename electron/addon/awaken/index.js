const { app: electronApp } = require('electron');

/**
 * 唤醒插件
 */
class AwakenAddon {

  constructor() {
    this.protocol = 'ee';
  }

  /**
   * 创建
   */
  create () {
    console.log('[addon:awaken] load');

    const mainModule = require('../../../main.js');
    const config = mainModule.getConfig();
    const cfg = config.addons.awaken;
    this.protocol = cfg.protocol;

    electronApp.setAsDefaultProtocolClient(this.protocol);

    this.handleArgv(process.argv);
    electronApp.on('second-instance', (event, argv) => {
      if (process.platform === 'win32') {
        this.handleArgv(argv);
      }
    });

    // 仅用于macOS
    electronApp.on('open-url', (event, urlStr) => {
      this.handleUrl(urlStr);
    });
  }

  /**
   * 参数处理
   */
  handleArgv(argv) {
    const offset = electronApp.isPackaged ? 1 : 2;
    const url = argv.find((arg, i) => i >= offset && arg.startsWith(this.protocol));
    this.handleUrl(url);
  }

  /**
   * url解析
   */
  handleUrl(awakeUrlStr) {
    if (!awakeUrlStr || awakeUrlStr.length === 0) {
      return;
    }
    const {hostname, pathname, search} = new URL(awakeUrlStr);
    let awakeUrlInfo = {
      urlStr: awakeUrlStr,
      urlHost: hostname,
      urlPath: pathname,
      urlParams: search && search.slice(1)
    };
    console.log('[addon:awaken] awakeUrlInfo:', awakeUrlInfo);
  }
}

const awakenAddon = new AwakenAddon();
module.exports = awakenAddon;