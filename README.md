# 鸣潮抽卡分析工具

<div align="center">

![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)
![Electron](https://img.shields.io/badge/Electron-21.4.4-47848F?logo=electron)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)

一个专业的《鸣潮》游戏抽卡记录分析工具

[下载体验](#下载安装) · [使用文档](CLAUDE.md) · [问题反馈](../../issues) · [参与贡献](CONTRIBUTING.md)

</div>

---

## ✨ 功能特性

- 📊 **自动获取数据** - 从游戏日志自动读取抽卡记录
- 📈 **可视化分析** - 使用 ECharts 展示直观的数据图表
- 💾 **Excel 导出** - 一键导出抽卡记录到 Excel 文件
- 🔄 **多账号支持** - 管理和切换多个游戏账号
- 🌍 **全服务器支持** - 支持国服、国际服和 WeGame 版本
- 🎯 **保底统计** - 自动计算当前保底进度
- ⚡ **增量更新** - 只获取新数据，不重复拉取

## 📸 界面预览

> 待添加：应用截图

## 📥 下载安装

### 从 Releases 下载

前往 [Releases](../../releases) 页面下载最新版本：

- **Windows x64**: `mc-gacha-tool-Setup-{version}.exe`
- **Windows ARM64**: `mc-gacha-tool-Setup-{version}-arm64.exe`
- **便携版**: `mc-gacha-tool-{version}.exe`（无需安装）

### 系统要求

- Windows 10/11 (64位)
- 已安装《鸣潮》游戏

## 🚀 快速开始

### 1. 安装并启动

下载安装包后运行安装，完成后启动应用。

### 2. 配置游戏路径

工具会自动检测游戏安装路径。如果检测失败：
1. 点击右上角的设置按钮 ⚙️
2. 选择游戏根目录（包含 `Wuthering Waves Game` 文件夹）
3. 点击确认

### 3. 获取抽卡数据

1. **打开游戏**：启动《鸣潮》
2. **打开抽卡界面**：进入游戏内任意卡池，查看抽卡历史
3. **更新数据**：返回工具，点击"更新数据"按钮 🔄

### 4. 查看和导出

- 查看各卡池的抽卡统计图表
- 点击"导出 Excel"按钮 📤 保存数据

## 📖 详细文档

- [完整项目文档](CLAUDE.md) - 项目结构、技术细节、开发指南
- [贡献指南](CONTRIBUTING.md) - 如何参与项目开发
- [更新日志](CHANGELOG.md) - 版本更新记录

## 🛠️ 开发指南

### 环境要求

- Node.js >= 16
- npm >= 8

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
cd frontend && npm install
```

### 开发模式

```bash
npm run dev
```

### 构建打包

```bash
# 构建前端资源
npm run build-frontend

# 打包 Windows 应用
npm run build-w        # x64 安装包
npm run build-w-arm64  # ARM64 安装包
npm run build-we       # 便携版
```

详见 [开发文档](CLAUDE.md)

## ❓ 常见问题

### 提示"未找到安装目录"
- 手动选择游戏根目录（包含 `Wuthering Waves Game` 或 `Client` 文件夹）

### 提示"打开抽卡界面可解决"
- 进入游戏，打开任意抽卡界面并查看历史记录
- 游戏会在日志中记录 API URL

### 数据更新失败
- 检查网络连接
- 确认游戏日志文件存在
- 重新打开游戏抽卡界面

### WeGame 版本支持
- 完全支持 WeGame 版本
- 路径结构略有不同，请手动选择游戏目录

更多问题请查看 [Issues](../../issues) 或提交新问题

## 🤝 参与贡献

欢迎提交 Issue 和 Pull Request！

在贡献代码前，请阅读 [贡献指南](CONTRIBUTING.md)。

### 贡献者

感谢所有贡献者的支持！

<!-- 如果有贡献者，可以添加：
<a href="https://github.com/yourusername/mc-gacha-tool-electron/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=yourusername/mc-gacha-tool-electron" />
</a>
-->

## 📄 许可证

本项目采用 [Apache-2.0](LICENSE) 许可证。

## 🙏 致谢

- [electron-egg](https://www.kaka996.com/) - 项目基于的框架（计划迁移到纯 Electron）
- [ECharts](https://echarts.apache.org/) - 数据可视化
- [Ant Design](https://ant.design/) - UI 组件库
- 所有使用和支持本工具的玩家们



<div align="center">

**如果这个工具对你有帮助，请给个 ⭐ Star 支持一下！**

Made with ❤️ for Wuthering Waves players

</div>
