/**
 * 鸣潮抽卡工具常量配置
 * 集中管理所有硬编码的常量、路径、API地址等
 */

/**
 * 状态码定义
 */
const STATUS_CODE = {
  SUCCESS: 100000,           // 操作成功
  ERROR: 1,                  // 一般错误
  NETWORK_ERROR: 2,          // 网络错误
  PATH_ERROR: 3              // 路径错误
};

/**
 * 游戏路径配置
 */
const GAME_PATHS = {
  // 官服客户端日志路径（相对于游戏安装目录）
  OFFICIAL: 'Wuthering Waves Game/Client/Saved/Logs/Client.log',
  // WeGame 客户端日志路径（相对于游戏安装目录）
  WEGAME: 'Client/Saved/Logs/Client.log',
  // 库街区启动器配置文件路径（相对于用户目录）
  KR_LAUNCHER: 'AppData/Roaming/KRLauncher/G152/C10003/kr_starter_game.json'
};

/**
 * API 配置
 */
const API = {
  // 国服 API 域名
  BASE_URL_CN: 'https://gmserver-api.aki-game2.com',
  // 国际服 API 域名
  BASE_URL_INTL: 'https://gmserver-api.aki-game2.net',
  // 抽卡记录查询接口
  GACHA_ENDPOINT: '/gacha/record/query',
  // 语言代码
  LANGUAGE_CODE: 'zh-Hans'
};

/**
 * 正则表达式模式
 */
const REGEX_PATTERNS = {
  // 匹配游戏日志中的抽卡 URL
  GACHA_URL: /"https:\/\/aki-gm-resources\.aki-game\.com\/[\s\S]*?"/
};

/**
 * 服务器类型标识
 */
const SERVER = {
  CN: 'com',    // 国服
  INTL: 'net'   // 国际服
};

/**
 * 卡池类型定义
 */
const CARD_POOL_TYPE = {
  CHARACTER_UP: 1,        // 角色 UP 池（精准调谐）
  WEAPON_UP: 2,           // 武器 UP 池（精准调谐）
  CHARACTER_STANDARD: 3,  // 常驻角色池
  WEAPON_STANDARD: 4,     // 常驻武器池
  NOVICE: 5               // 新手池
};

/**
 * 卡池类型名称映射（用于导出）
 */
const CARD_POOL_NAMES = {
  0: '角色精准调谐',
  1: '武器精准调谐',
  2: '角色调谐（常驻池）',
  3: '武器调谐（常驻池）',
  4: '角色调谐（新手池）'
};

/**
 * 物品品质等级
 */
const QUALITY_LEVEL = {
  FIVE_STAR: 5,   // 五星（金色）
  FOUR_STAR: 4,   // 四星（紫色）
  THREE_STAR: 3   // 三星（蓝色）
};

/**
 * HTTP 请求头配置
 */
const HTTP_HEADERS = {
  'accept-language': 'zh-Hans',
  'Content-Type': 'application/json;charset=UTF-8',
  'sec-ch-ua': '"Microsoft Edge";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': 'Windows',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site'
};

/**
 * 错误消息模板
 */
const ERROR_MESSAGES = {
  PATH_NOT_FOUND: '未找到安装目录呢，点击右上角设置手动选择一下安装目录吧',
  INVALID_INSTALL_PATH: '并没有找到现在的安装路径，手动选择一下吧',
  NEED_OPEN_GACHA: '不需要理会的问题，打开抽卡界面可解决',
  NETWORK_ERROR: '网络错误或链接已过期,请重新打开抽卡界面后再点击更新数据',
  INSTALL_PATH_ERROR: '安装路径错误，请手动选择安装路径',
  EXPORT_CANCELED: '用户已取消该操作',
  EXPORT_SUCCESS: '导出成功！'
};

/**
 * 文件名配置
 */
const FILE_NAMES = {
  INSTALL_PATH: 'InstallPath',          // 游戏安装路径配置文件
  UID_LIST: 'uidList',                  // 用户 ID 列表文件
  USER_URL_PATH: 'userUrlPath',         // 抽卡 API URL 文件
  GACHA_DATA_PREFIX: 'gachaByType'      // 抽卡数据文件前缀
};

/**
 * 所有卡池类型数组（用于批量操作）
 */
const ALL_CARD_POOL_TYPES = [
  CARD_POOL_TYPE.CHARACTER_UP,
  CARD_POOL_TYPE.WEAPON_UP,
  CARD_POOL_TYPE.CHARACTER_STANDARD,
  CARD_POOL_TYPE.WEAPON_STANDARD,
  CARD_POOL_TYPE.NOVICE
];

/**
 * 判断 player_id 对应的服务器类型
 * @param {string} playerId - 玩家 ID
 * @returns {string} 服务器域名后缀 ('com' 或 'net')
 */
function getServerType(playerId) {
  return String(playerId)[0] === '1' ? SERVER.CN : SERVER.INTL;
}

/**
 * 构建完整的 API URL
 * @param {string} playerId - 玩家 ID
 * @returns {string} 完整的 API 地址
 */
function buildApiUrl(playerId) {
  const serverType = getServerType(playerId);
  const baseUrl = serverType === SERVER.CN ? API.BASE_URL_CN : API.BASE_URL_INTL;
  return `${baseUrl}${API.GACHA_ENDPOINT}`;
}

/**
 * 生成抽卡数据文件名
 * @param {string|number} cardPoolType - 卡池类型
 * @returns {string} 文件名
 */
function getGachaDataFileName(cardPoolType) {
  return `${FILE_NAMES.GACHA_DATA_PREFIX}${cardPoolType}.json`;
}

module.exports = {
  // 状态码
  STATUS_CODE,

  // 路径配置
  GAME_PATHS,

  // API 配置
  API,

  // 正则表达式
  REGEX_PATTERNS,

  // 服务器类型
  SERVER,

  // 卡池配置
  CARD_POOL_TYPE,
  CARD_POOL_NAMES,
  ALL_CARD_POOL_TYPES,

  // 品质等级
  QUALITY_LEVEL,

  // HTTP 配置
  HTTP_HEADERS,

  // 错误消息
  ERROR_MESSAGES,

  // 文件名
  FILE_NAMES,

  // 工具函数
  getServerType,
  buildApiUrl,
  getGachaDataFileName
};
