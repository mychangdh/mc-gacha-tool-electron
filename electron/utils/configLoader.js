const path = require('path');
const { app } = require('electron');

/**
 * 配置加载器 - 替代 electron-egg 的配置系统
 */
function loadConfig() {
  const env = process.env.NODE_ENV || 'production';

  // 构造 appInfo 对象（兼容原配置文件）
  const appInfo = {
    baseDir: path.join(__dirname, '..'),
    home: app.getAppPath(),
    env: env
  };

  // 加载默认配置
  const defaultConfig = require('../config/config.default.js')(appInfo);

  // 加载环境配置
  let envConfig = {};
  try {
    const envConfigPath = path.join(__dirname, '../config', `config.${env}.js`);
    envConfig = require(envConfigPath)(appInfo);
  } catch (e) {
    // 环境配置文件不存在时忽略
  }

  // 合并配置
  const config = {
    ...defaultConfig,
    ...envConfig,
    appInfo
  };

  return config;
}

module.exports = { loadConfig };
