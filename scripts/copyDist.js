const fs = require('fs-extra');
const path = require('path');

const src = path.join(__dirname, '../frontend/dist');
const dest = path.join(__dirname, '../public/dist');

try {
  // 确保目标目录存在
  fs.ensureDirSync(path.dirname(dest));

  // 复制构建产物
  fs.copySync(src, dest, { overwrite: true });

  console.log('✓ Frontend build copied to public/dist');
} catch (error) {
  console.error('✗ Failed to copy frontend build:', error);
  process.exit(1);
}
