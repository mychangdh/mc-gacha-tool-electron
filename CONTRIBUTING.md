# 贡献指南

感谢你对鸣潮抽卡分析工具的关注！

## 开发环境搭建

### 环境要求
- Node.js >= 16
- npm >= 8
- Git

### 克隆项目
```bash
git clone https://github.com/yourusername/mc-gacha-tool-electron.git
cd mc-gacha-tool-electron
```

### 安装依赖
```bash
# 安装主项目依赖
npm install

# 安装前端依赖
cd frontend
npm install
cd ..
```

### 启动开发模式
```bash
npm run dev
```

浏览器会自动打开前端开发服务器，Electron 窗口会同时启动。

## 项目结构

详见 [CLAUDE.md](CLAUDE.md)

## 代码规范

### JavaScript/Node.js
- 使用 `const`/`let`，避免 `var`
- 优先使用 `async/await` 处理异步
- 函数名使用 camelCase
- 类名使用 PascalCase
- 使用 ESLint 进行代码检查

### TypeScript/React
- 定义明确的类型，避免 `any`
- 使用函数式组件和 Hooks
- 组件名使用 PascalCase
- Props 接口以 `IProps` 或 `Props` 结尾

### 命名规范
- 文件名：
  - 组件文件：`PascalCase.tsx`
  - 工具函数：`camelCase.ts`
  - 配置文件：`kebab-case.js`
- 变量名：有意义的英文单词，避免拼音
- 常量：使用 `UPPER_SNAKE_CASE`

### IPC 通信规范
```javascript
// 主进程注册
ipcMain.handle('handlerName', async (event, ...args) => {
  // 处理逻辑
  return result;
});

// 渲染进程调用
const result = await ipc.invoke('handlerName', ...args);
```

## 提交规范

### Commit Message 格式
遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 类型**：
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 重构（既不是新功能也不是 bug 修复）
- `perf`: 性能优化
- `test`: 添加或修改测试
- `chore`: 构建过程或辅助工具的变动

**示例**：
```
feat(gacha): 添加数据备份功能

- 支持一键备份所有抽卡数据
- 备份文件以时间戳命名
- 添加数据恢复功能

Closes #123
```

## 开发流程

### 1. Fork 项目
点击右上角的 Fork 按钮

### 2. 创建功能分支
```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/bug-description
```

### 3. 开发和测试
- 编写代码
- 添加必要的注释
- 运行 `npm run dev` 测试功能
- 确保代码通过 ESLint 检查

### 4. 提交更改
```bash
git add .
git commit -m "feat: your feature description"
```

### 5. 推送到 GitHub
```bash
git push origin feature/your-feature-name
```

### 6. 创建 Pull Request
1. 在 GitHub 上打开你的 fork
2. 点击 "New Pull Request"
3. 填写 PR 描述：
   - 说明改动内容
   - 解释为什么需要这个改动
   - 列出测试步骤
   - 如果修复了 issue，添加 `Closes #issue-number`

## Pull Request 检查清单

提交 PR 前请确认：

- [ ] 代码通过 ESLint 检查
- [ ] 功能已经过测试
- [ ] 添加了必要的注释
- [ ] 更新了相关文档
- [ ] Commit message 符合规范
- [ ] 没有包含不相关的文件更改
- [ ] PR 描述清晰明了

## 报告 Bug

使用 [Issue 模板](../../issues/new) 提交 Bug 报告。

**必需信息**：
- 操作系统和版本
- 工具版本
- 游戏版本（官服/国际服/WeGame）
- 详细的复现步骤
- 预期行为
- 实际行为
- 错误截图或日志

**日志文件位置**：
- Windows: `C:\Users\{用户名}\AppData\Roaming\mc_gacha_tool\logs\`

## 功能建议

欢迎提出新功能建议！

**提交功能建议时请说明**：
- 使用场景（什么时候需要这个功能）
- 期望效果（功能应该如何工作）
- 可能的实现方案（可选）

## 代码审查

所有 PR 都会经过代码审查。审查关注点：

1. **功能正确性**：是否实现了预期功能
2. **代码质量**：可读性、可维护性
3. **性能影响**：是否有性能问题
4. **安全性**：是否有安全隐患
5. **测试覆盖**：是否充分测试
6. **文档完整性**：是否更新了文档

## 开发技巧

### 调试主进程
```bash
# 启动 Electron 并开启 Inspector
npm run dev
# 然后在 Chrome 中打开 chrome://inspect
```

### 调试渲染进程
开发模式下按 `F12` 打开 DevTools

### 查看日志
```bash
# Windows
type %APPDATA%\mc_gacha_tool\logs\ee.log
```

### 清理缓存
```bash
npm run clean
rm -rf node_modules
npm install
```

## 发布流程

仅项目维护者可执行：

1. 更新版本号 (`package.json`)
2. 更新 `CHANGELOG.md`
3. 提交并打 tag
4. 运行 `npm run build-w` 构建
5. 在 GitHub 创建 Release
6. 上传构建产物

## 行为准则

参与本项目时请遵守以下准则：

- **尊重他人**：友善对待所有贡献者
- **建设性反馈**：提供有帮助的建议而非单纯批评
- **保持专业**：专注于技术讨论
- **包容开放**：欢迎不同背景和经验水平的贡献者

## 需要帮助？

- 📖 查看 [文档](CLAUDE.md)
- 💬 在 [Discussions](../../discussions) 提问
- 🐛 报告 [Issues](../../issues)
- 📧 联系维护者：1392238525@qq.com

## 许可证

通过向本项目提交代码，你同意你的贡献将以 Apache-2.0 许可证发布。
