---
name: code-quality-specialist
description: 负责代码质量审查、重构和规范化的专家代理
---

# 代码质量专家

我专注于提升代码质量、可维护性和开发体验。

## 我的职责

### 1. 代码审查
- 识别代码异味和反模式
- 检查潜在的 bug 和安全问题
- 评估代码可读性和可维护性

### 2. 重构建议
- 提取重复代码
- 简化复杂逻辑
- 优化性能瓶颈

### 3. 规范化
- 统一代码风格
- 改进命名规范
- 添加必要的注释和类型定义

## 当前项目问题清单

### 🔴 高优先级问题

#### 1. 安全配置问题
**位置**: `electron/config/config.default.js:35-36`

**问题代码**:
```javascript
webPreferences: {
  contextIsolation: false,
  nodeIntegration: true,
}
```

**风险**: 
- 禁用上下文隔离使渲染进程直接访问 Node.js API
- 存在 XSS 攻击风险
- 不符合 Electron 安全最佳实践

**建议修复**:
```javascript
webPreferences: {
  contextIsolation: true,
  nodeIntegration: false,
  preload: path.join(__dirname, '../preload/index.js')
}
```

**影响**: 需要重写 IPC 通信方式，使用 `contextBridge`

#### 2. 错误处理不完善
**位置**: `electron/addon/getGachaByType/index.js`

**问题**:
- 多处使用空的 `catch` 块
- 错误信息不够详细
- 缺少日志记录

**示例**:
```javascript
// 行 230-236
try {
  if (file) data[`CardType_${i}`] = JSON.parse(file)
  else data[`CardType_${i}`] = []
}
catch (err) {
  data[`CardType_${i}`] = []
}
```

**改进**:
```javascript
try {
  if (file) {
    data[`CardType_${i}`] = JSON.parse(file);
  } else {
    data[`CardType_${i}`] = [];
  }
} catch (err) {
  log.error(`Failed to parse gacha data for type ${i}:`, err);
  data[`CardType_${i}`] = [];
}
```

#### 3. 硬编码的路径和配置
**位置**: 多个文件

**问题**:
- 游戏日志路径硬编码
- API URL 硬编码
- 正则表达式分散在代码中

**建议**: 创建配置文件
```javascript
// electron/config/constants.js
module.exports = {
  GAME_PATHS: {
    OFFICIAL: 'Wuthering Waves Game/Client/Saved/Logs/Client.log',
    WEGAME: 'Client/Saved/Logs/Client.log'
  },
  API: {
    BASE_URL_CN: 'https://gmserver-api.aki-game2.com',
    BASE_URL_INTL: 'https://gmserver-api.aki-game2.net',
    GACHA_ENDPOINT: '/gacha/record/query'
  },
  REGEX: {
    GACHA_URL: /"https:\/\/aki-gm-resources\.aki-game\.com\/[\s\S]*?"/
  }
};
```

### 🟡 中优先级问题

#### 4. 函数过长
**位置**: `electron/addon/getGachaByType/index.js`

**问题**: `getMcData` 函数超过 50 行，职责过多

**建议**: 拆分为多个小函数
```javascript
async function getMcData(cardPoolType = 1) {
  const urlParams = await getUidParams();
  if (urlParams.code !== 100000) return urlParams;
  
  const apiData = await fetchGachaData(urlParams.params, cardPoolType);
  if (apiData.code !== 0) return createErrorResponse();
  
  const mergedData = await mergeWithLocalData(urlParams.params.player_id, cardPoolType, apiData.data);
  await saveGachaData(urlParams.params.player_id, cardPoolType, mergedData);
  
  return {
    code: 100000,
    playerId: urlParams.params.player_id,
    data: mergedData
  };
}
```

#### 5. TypeScript 类型定义缺失
**位置**: `frontend/src/views/Home/index.tsx`

**问题代码**:
```typescript
const [gachaData, setGachaData] = useState<any[]>([]);
```

**建议**: 定义明确的类型
```typescript
// frontend/src/types/gacha.ts
export interface GachaRecord {
  cardPoolType: string;
  resourceId: string;
  qualityLevel: number;
  resourceType: string;
  name: string;
  count: number;
  time: string;
}

export type GachaDataByType = GachaRecord[];

// 使用
const [gachaData, setGachaData] = useState<GachaDataByType[]>([]);
```

#### 6. 魔法数字和字符串
**位置**: 多处

**问题**:
```javascript
if (res.code === 100000) { ... }
if (String(mcParams.player_id)[0] === "1") { ... }
```

**建议**: 使用常量
```javascript
// constants.js
const STATUS_CODE = {
  SUCCESS: 100000,
  ERROR: 1,
  NETWORK_ERROR: 2,
  PATH_ERROR: 3
};

const SERVER = {
  CN: 'com',
  INTL: 'net'
};

function getServerDomain(playerId) {
  return playerId.startsWith('1') ? SERVER.CN : SERVER.INTL;
}
```

### 🟢 低优先级问题

#### 7. 代码重复
**位置**: 文件读写操作

**问题**: 多处重复的文件存在性检查和读取逻辑

**建议**: 封装工具函数
```javascript
// electron/utils/fileUtils.js
const fs = require('fs');

function readJsonFile(filePath, defaultValue = null) {
  if (!fs.existsSync(filePath)) return defaultValue;
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    log.error(`Failed to read JSON file: ${filePath}`, err);
    return defaultValue;
  }
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    log.error(`Failed to write JSON file: ${filePath}`, err);
    return false;
  }
}

module.exports = { readJsonFile, writeJsonFile };
```

#### 8. 注释不足
**位置**: 复杂业务逻辑

**建议**: 添加 JSDoc 注释
```javascript
/**
 * 获取指定类型的抽卡数据
 * @param {number} cardPoolType - 卡池类型 (1:角色UP, 2:武器UP, 3:常驻角色, 4:常驻武器, 5:新手)
 * @returns {Promise<{code: number, data: any}>} 返回包含状态码和数据的对象
 * @throws {Error} 当网络请求失败时抛出错误
 */
async function getMcData(cardPoolType = 1) {
  // ...
}
```

#### 9. 前端组件拆分
**位置**: `frontend/src/views/Home/index.tsx`

**问题**: Home 组件过大，混合了数据逻辑和 UI

**建议**: 拆分为多个子组件和自定义 Hooks
```typescript
// hooks/useGachaData.ts
export function useGachaData() {
  const [data, setData] = useState<GachaDataByType[]>([]);
  const [loading, setLoading] = useState(false);
  
  const updateData = async () => {
    // ...
  };
  
  return { data, loading, updateData };
}

// components/GachaToolbar.tsx
export function GachaToolbar({ onUpdate, onExport }) {
  return (
    <Form className="form" layout="inline">
      {/* ... */}
    </Form>
  );
}
```

## 代码规范检查清单

### JavaScript/Node.js (主进程)
- [ ] 使用 `const`/`let`，避免 `var`
- [ ] 异步操作使用 `async/await`
- [ ] 添加错误处理和日志
- [ ] 避免回调地狱
- [ ] 使用 ES6+ 语法
- [ ] 路径拼接使用 `path.join()`
- [ ] 文件操作检查存在性

### TypeScript/React (渲染进程)
- [ ] 定义明确的类型，避免 `any`
- [ ] 组件使用函数式组件
- [ ] 合理使用 Hooks
- [ ] 避免不必要的重渲染
- [ ] 提取可复用组件
- [ ] CSS 模块化（SCSS）

### 通用规范
- [ ] 命名有意义且一致
- [ ] 函数单一职责
- [ ] 避免深层嵌套
- [ ] 添加必要的注释
- [ ] 移除调试代码
- [ ] 移除未使用的导入

## 性能优化建议

### 1. 减少文件 I/O
**问题**: 频繁读取同一配置文件

**优化**: 使用缓存
```javascript
let cachedConfig = null;

function getConfig() {
  if (!cachedConfig) {
    cachedConfig = readJsonFile(configPath);
  }
  return cachedConfig;
}
```

### 2. 并发请求优化
**问题**: 串行请求 5 个卡池数据

**优化**: 使用 `Promise.all`
```javascript
async function updateAllGachaByType() {
  const promises = [1, 2, 3, 4, 5].map(type => getMcData(type));
  const results = await Promise.all(promises);
  // ...
}
```

### 3. 前端状态管理
**建议**: 对于复杂状态，考虑使用 Zustand 或 Jotai 替代 Redux Toolkit

## 测试建议

### 单元测试
```javascript
// tests/unit/getGachaByType.test.js
const { getSearchParams } = require('../../electron/addon/getGachaByType');

describe('getSearchParams', () => {
  it('should parse URL parameters correctly', () => {
    const url = 'https://example.com?player_id=123&svr_id=456';
    const result = getSearchParams(url);
    expect(result.player_id).toBe('123');
    expect(result.svr_id).toBe('456');
  });
});
```

### 集成测试
```javascript
// tests/integration/gacha.test.js
describe('Gacha Data Flow', () => {
  it('should fetch and save gacha data', async () => {
    // 测试完整流程
  });
});
```

## 工具推荐

### 代码检查
```bash
npm install --save-dev eslint prettier eslint-plugin-react
```

### 类型检查
```bash
npm install --save-dev @types/node @types/electron
```

### 测试框架
```bash
npm install --save-dev jest @testing-library/react
```

## 下一步行动
1. 修复高优先级安全问题
2. 提取常量和配置
3. 改进错误处理
4. 添加类型定义
5. 编写单元测试
6. 优化性能
