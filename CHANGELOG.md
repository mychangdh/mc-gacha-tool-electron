# 更新日志

所有重要的项目变更都会记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [未发布]

### 计划中
- 数据备份与恢复功能
- 深色模式支持
- 统计面板增强
- 国际化支持

## [1.1.0] - 2024-10-27

### 重大变更
- 🎉 完成从 electron-egg 到纯 Electron 的架构迁移
- 🗑️ 移除 ee-core 和 ee-bin 依赖（精简 227 个包）
- 🔧 实现独立的配置加载系统
- 🔌 改造插件系统，使用标准 Electron API
- 📝 重构所有构建脚本

### 新增功能
- 🔓 支持 3.4+ 版本的加密日志解密（XOR 算法）
- 📊 智能兼容：自动识别加密/未加密日志
- 🔄 向后兼容旧版本游戏

### 代码质量改进
- 📦 新增统一的常量管理（constants.js）
- 🛠️ 提取硬编码到配置文件
- 📖 添加完整的 JSDoc 注释
- 🔨 拆分长函数，提升可维护性
- ✨ 统一错误处理格式

### 文档
- 📚 创建完整的项目文档（CLAUDE.md）
- 🤝 新增贡献指南（CONTRIBUTING.md）
- 📋 新增更新日志（CHANGELOG.md）
- 🤖 创建 5 个专业 AI 代理配置
- 📄 改进 README.md

### 工具链
- 🎨 添加 Prettier 代码格式化
- ✅ 配置 ESLint 代码检查
- 🔍 添加 lint 和 format npm scripts

## [1.0.2] - 2024-10-26

### 修复
- 修复 WeGame 版本无法访问的问题
- 改进游戏路径检测逻辑，支持更多安装方式

### 文档
- 新增完整的项目文档 (CLAUDE.md)
- 新增贡献指南 (CONTRIBUTING.md)
- 创建 Claude AI 代理配置文件

### 技术改进
- 改进代码组织结构
- 添加详细的代码注释

## [1.0.1] - 2024-XX-XX

### 新增
- 支持国际服务器（自动根据 UID 识别）
- 支持 WeGame 版本的游戏客户端
- 多账号管理功能

### 优化
- 优化游戏路径自动检测
- 改进错误提示信息
- 提升数据加载速度

### 修复
- 修复某些情况下路径检测失败的问题
- 修复数据合并时的重复问题

## [1.0.0] - 2024-XX-XX

### 初始版本
这是项目的第一个正式版本。

#### 核心功能
- ✨ 自动读取游戏日志获取抽卡记录
- 📊 数据可视化展示（ECharts 图表）
- 📈 抽卡统计分析
- 💾 Excel 数据导出
- 🔄 增量数据更新（与本地数据合并）

#### 支持的卡池
- 角色 UP 池
- 武器 UP 池
- 常驻角色池
- 常驻武器池
- 新手池

#### 技术栈
- Electron 21.4.4
- React 18
- TypeScript
- Ant Design
- ECharts
- electron-egg 2.11.0

## 版本说明

### 版本号规则
- **主版本号**：重大架构变更或不兼容的 API 变更
- **次版本号**：向后兼容的新功能
- **修订号**：向后兼容的 bug 修复

### 变更类型
- `新增`：新功能
- `修复`：Bug 修复
- `优化`：改进现有功能
- `变更`：可能影响兼容性的变更
- `弃用`：即将移除的功能
- `移除`：已移除的功能
- `安全`：安全相关的修复
- `文档`：文档更新

---

[未发布]: https://github.com/yourusername/mc-gacha-tool-electron/compare/v1.0.2...HEAD
[1.0.2]: https://github.com/yourusername/mc-gacha-tool-electron/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/yourusername/mc-gacha-tool-electron/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/yourusername/mc-gacha-tool-electron/releases/tag/v1.0.0
