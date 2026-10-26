# Claude Code 代理配置索引

本目录包含针对鸣潮抽卡分析工具项目的专业代理配置文件。

## 📋 代理列表

### [迁移专家](agents/migration.md)
**专长**：electron-egg → 纯 Electron 迁移
- 分析框架依赖
- 重构主进程代码
- 改造配置系统
- 替换构建工具
- 提供详细的迁移路线图

### [代码质量专家](agents/code-quality.md)
**专长**：代码审查与重构
- 识别安全问题和代码异味
- 提供重构建议
- 制定编码规范
- 性能优化建议
- 包含当前项目的问题清单

### [文档专家](agents/docs.md)
**专长**：项目文档编写
- 用户使用手册
- 开发文档
- API 文档
- 贡献指南
- 文档维护策略

### [功能开发专家](agents/feature-dev.md)
**专长**：新功能实现
- 需求分析
- 功能设计
- 代码实现
- 用户体验优化
- 包含功能增强建议列表

### [测试专家](agents/testing.md)
**专长**：测试策略与实现
- 单元测试
- 集成测试
- E2E 测试
- 测试框架选择
- CI/CD 配置

## 🎯 快速开始

### 查看项目文档
项目的完整文档在 [CLAUDE.md](../CLAUDE.md)，包含：
- 项目概述和功能特性
- 完整的目录结构说明
- 核心业务逻辑详解
- 开发和构建指南

### 参与贡献
阅读 [CONTRIBUTING.md](../CONTRIBUTING.md) 了解：
- 开发环境搭建
- 代码规范
- 提交流程
- Pull Request 要求

### 查看更新
[CHANGELOG.md](../CHANGELOG.md) 记录了所有版本的变更历史。

## 💡 使用建议

### 当你需要迁移到纯 Electron
阅读 [migration.md](agents/migration.md)，它提供了：
- 完整的迁移步骤
- 代码示例对比
- 依赖替换方案
- 常见问题解决

### 当你需要改进代码质量
查看 [code-quality.md](agents/code-quality.md)，它列出了：
- 当前项目的具体问题
- 优先级分类
- 修复建议和代码示例
- 性能优化方向

### 当你需要添加新功能
参考 [feature-dev.md](agents/feature-dev.md)，它包含：
- 现有功能模块说明
- 潜在功能增强建议
- 开发工作流
- 技术栈升级建议

### 当你需要编写测试
使用 [testing.md](agents/testing.md)，它提供了：
- 测试框架推荐
- 完整的测试用例示例
- Mock 工具配置
- CI/CD 集成方案

### 当你需要完善文档
参考 [docs.md](agents/docs.md)，它包含：
- 文档结构模板
- 写作技巧
- 维护清单

## 🔧 项目当前状态

### ✅ 已完成
- [x] 创建完整的项目文档 (CLAUDE.md)
- [x] 创建贡献指南 (CONTRIBUTING.md)
- [x] 创建更新日志 (CHANGELOG.md)
- [x] 更新 README.md
- [x] 创建 5 个专业代理配置文件
- [x] 添加 ESLint 配置
- [x] 添加 Prettier 配置

### ⏳ 待处理（根据需要）
- [ ] 执行 electron-egg 到纯 Electron 的迁移
- [ ] 修复代码质量问题（安全配置、错误处理等）
- [ ] 添加单元测试和集成测试
- [ ] 实现功能增强（备份、统计面板等）
- [ ] 优化性能和打包体积

## 📚 相关资源

### 官方文档
- [Electron 文档](https://www.electronjs.org/docs)
- [React 文档](https://react.dev/)
- [Ant Design 文档](https://ant.design/)
- [ECharts 文档](https://echarts.apache.org/)

### 工具和库
- [electron-builder](https://www.electron.build/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)

## 🤝 反馈和改进

如果你有任何建议或发现问题，欢迎：
- 提交 GitHub Issue
- 创建 Pull Request
- 联系项目维护者

---

**最后更新**: 2024-10-26
