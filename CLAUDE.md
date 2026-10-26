# 鸣潮抽卡分析工具 (Wuthering Waves Gacha Analyzer)

一个用于分析《鸣潮》游戏抽卡数据的 Electron 桌面应用，支持国服、国际服和 WeGame 版本。

## 项目概述

### 功能特性
- 📊 **数据分析**：读取游戏日志文件，自动获取抽卡记录
- 📈 **可视化图表**：使用 ECharts 展示各卡池的抽卡统计
- 💾 **数据导出**：支持将抽卡记录导出为 Excel 格式
- 🔄 **多账号支持**：可管理和切换多个游戏账号的数据
- 🌍 **多服务器支持**：支持国服和国际服（通过 player_id 首位判断）
- 🎮 **多平台支持**：支持官服和 WeGame 版本

### 技术栈
- **前端框架**：React 18 + TypeScript + Vite
- **UI 组件库**：Ant Design
- **图表库**：ECharts
- **桌面框架**：Electron 21 + electron-egg 2.11.0
- **路由管理**：React Router v6
- **状态管理**：Redux Toolkit
- **HTTP 客户端**：Axios
- **构建工具**：electron-builder

## 项目结构

```
mc-gacha-tool-electron/
├── electron/                 # Electron 主进程代码
│   ├── addon/               # 功能模块
│   │   ├── autoUpdater/    # 自动更新模块
│   │   ├── awaken/         # 应用唤醒协议
│   │   ├── chromeExtension/# Chrome 扩展支持
│   │   ├── clipboardTool/  # 剪贴板工具
│   │   ├── getConfig/      # 配置获取
│   │   ├── getGachaByType/ # 抽卡数据获取（核心功能）
│   │   │   ├── index.js           # 主逻辑
│   │   │   ├── readData.js        # 读取本地数据
│   │   │   ├── writeData.js       # 写入本地数据
│   │   │   ├── mergeData.js       # 合并新旧数据
│   │   │   └── exportGachaData.js # 导出 Excel
│   │   ├── openFilesDialog/# 文件选择对话框
│   │   ├── security/       # 安全模块
│   │   └── tray/           # 系统托盘
│   ├── config/             # 配置文件
│   │   ├── config.default.js # 默认配置
│   │   ├── config.local.js   # 本地开发配置
│   │   ├── config.prod.js    # 生产环境配置
│   │   ├── builder.json      # electron-builder 打包配置
│   │   └── nodemon.json      # 热重载配置
│   ├── controller/         # 控制器
│   ├── service/            # 服务层
│   ├── preload/            # 预加载脚本
│   └── index.js            # 主进程入口
├── frontend/               # 前端代码
│   ├── src/
│   │   ├── views/         # 页面组件
│   │   │   ├── Home/      # 主页（数据展示）
│   │   │   └── FindMc/    # 设置页（路径配置）
│   │   ├── router/        # 路由配置
│   │   ├── store/         # Redux 状态管理
│   │   ├── utils/         # 工具函数
│   │   └── assets/        # 静态资源
│   ├── index.html
│   └── package.json
├── build/                  # 构建资源（图标等）
├── public/                 # 公共资源
└── main.js                 # Electron 应用入口

用户数据存储位置：
- Windows: C:\Users\{username}\AppData\Roaming\mc_gacha_tool\
  - InstallPath: 游戏安装路径
  - uidList: 用户 ID 列表
  - userUrlPath: 抽卡 API URL
  - {uid}_{cardPoolType}.json: 各卡池抽卡记录
```

## 核心业务逻辑

### 1. 游戏路径自动检测
系统优先级：
1. 读取已保存的路径配置
2. 通过 `get-installed-apps` 搜索"鸣潮"应用
3. 读取库街区启动器配置 `kr_starter_game.json`
4. 提示用户手动选择

### 2. 抽卡数据获取流程
```
读取游戏日志 → 提取 API URL → 解析参数 → 请求官方接口 → 合并本地数据 → 保存
```

关键文件：
- 官服日志路径：`{GamePath}/Wuthering Waves Game/Client/Saved/Logs/Client.log`
- WeGame 日志路径：`{GamePath}/Client/Saved/Logs/Client.log`
- API URL 正则：`https://aki-gm-resources.aki-game.com/...`

### 3. 卡池类型定义
- `1`: 角色 UP 池
- `2`: 武器 UP 池
- `3`: 常驻角色池
- `4`: 常驻武器池
- `5`: 新手池

### 4. 服务器判断
通过 `player_id` 首位区分：
- `1` 开头：国服 (`.com`)
- 其他：国际服 (`.net`)

### 5. 数据存储格式
```json
[
  {
    "cardPoolType": "1",
    "resourceId": "12345",
    "qualityLevel": 5,
    "resourceType": "角色",
    "name": "吟霖",
    "count": 1,
    "time": "2024-10-26 12:00:00"
  }
]
```

## 开发指南

### 环境要求
- Node.js >= 14
- npm >= 6

### 安装依赖
```bash
npm install
cd frontend && npm install
```

### 开发模式
```bash
# 启动完整开发环境（前端 + Electron）
npm run dev

# 仅启动前端开发服务器
npm run dev-frontend

# 仅启动 Electron
npm run dev-electron
```

### 构建打包
```bash
# 1. 编译前端资源
npm run build-frontend

# 2. 打包 Windows 安装程序
npm run build-w        # x64 NSIS 安装包
npm run build-w-32     # ia32 NSIS 安装包
npm run build-w-arm64  # ARM64 NSIS 安装包

# 其他格式
npm run build-we       # Portable 便携版
npm run build-wz       # 7z 压缩包
```

### 重要配置文件

#### `electron/config/config.default.js`
- 窗口配置（尺寸、无边框等）
- 开发者工具开关
- 日志配置
- 插件开关

#### `electron/config/builder.json`
- 应用名称和版本
- 打包输出目录
- 文件包含/排除规则
- 安装程序配置

## 代码规范

### 文件命名
- 组件文件：PascalCase (如 `MyChart.tsx`)
- 工具函数：camelCase (如 `ipcRender.ts`)
- 配置文件：kebab-case (如 `config.default.js`)

### 代码风格
- 使用 ESLint 进行代码检查
- 前端使用 TypeScript 严格模式
- 主进程使用 CommonJS 模块
- 异步操作优先使用 async/await

### IPC 通信规范
**主进程注册（electron/addon/）：**
```javascript
ipcMain.handle('handlerName', async (event, ...args) => {
  // 处理逻辑
  return result;
});
```

**渲染进程调用（frontend/src/utils/ipcRender.ts）：**
```typescript
const result = await ipc.invoke('handlerName', ...args);
```

### 错误处理
返回统一格式：
```javascript
{
  code: 100000,  // 成功
  data: any
}
// 或
{
  code: 1,       // 错误码
  data: "错误信息"
}
```

## 迁移计划：从 electron-egg 到纯 Electron

### 当前依赖分析
**electron-egg 提供的功能：**
- 应用生命周期管理
- 配置文件加载
- 日志系统
- 插件系统
- IPC 通信封装

**需要替换的部分：**
1. `ee-core` → 原生 Electron API
2. `ee-bin` 命令 → 自定义脚本
3. 配置系统 → 环境变量 + JSON 配置
4. 日志系统 → winston / electron-log

### 迁移步骤（待实施）
1. ✅ 创建项目文档
2. ⏳ 重构主进程入口（移除 ElectronEgg）
3. ⏳ 改造配置加载机制
4. ⏳ 迁移生命周期钩子
5. ⏳ 简化 IPC 通信
6. ⏳ 更新构建脚本
7. ⏳ 测试验证

详见：`.claude/agents/migration.md`

## 常见问题

### 1. 提示"未找到安装目录"
- 手动选择游戏安装根目录（包含 `Wuthering Waves Game` 或 `Client` 文件夹）

### 2. 提示"打开抽卡界面可解决"
- 进入游戏，打开任意抽卡界面
- 游戏会在日志中记录 API URL

### 3. 数据更新失败
- 检查网络连接
- 确认游戏日志文件存在
- 重新打开游戏抽卡界面

### 4. 导出 Excel 失败
- 检查是否有抽卡数据
- 确认有文件写入权限

## 许可证
Apache License 2.0

## 作者
ChangDh <1392238525@qq.com>

## 贡献指南
欢迎提交 Issue 和 Pull Request！

在提交代码前请确保：
- 代码通过 ESLint 检查
- 功能经过测试验证
- 提交信息清晰明确
