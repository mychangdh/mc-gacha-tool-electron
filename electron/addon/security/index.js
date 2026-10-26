const { app } = require('electron');

/**
 * 安全插件
 */
function create() {
  console.log('[addon:security] load');

  const runWithDebug = process.argv.find(function(e){
    let isHasDebug = e.includes("--inspect") || e.includes("--inspect-brk") || e.includes("--remote-debugging-port");
    return isHasDebug;
  });

  // 不允许远程调试
  if (runWithDebug) {
    console.error('[error] Remote debugging is not allowed, runWithDebug:', runWithDebug);
    app.quit();
  }
}

module.exports = { create };