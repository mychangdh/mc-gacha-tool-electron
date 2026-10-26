/**
 * 鸣潮 Client.log XOR 解密模块
 *
 * 从 3.4 版本开始，库洛对客户端日志进行了 XOR 加密
 * 解密算法来自 wuwatracker 开源项目
 * https://github.com/wuwatracker/wuwatracker
 *
 * 感谢 @RabbyDevs 和 @kyuxu 发现并分享解密方法
 */

/**
 * XOR 解密日志文件内容
 * @param {Buffer} buffer - 加密的日志文件 Buffer
 * @returns {Buffer} 解密后的 Buffer
 */
function decryptClientLog(buffer) {
    const decrypted = Buffer.alloc(buffer.length);

    for (let i = 0; i < buffer.length; i++) {
        const byte = buffer[i];
        // XOR 解密算法：根据字节最低位选择密钥
        // 如果最低位为 1，使用 0xA5；否则使用 0xEF
        const key = (byte & 1) !== 0 ? 0xA5 : 0xEF;
        decrypted[i] = byte ^ key;
    }

    return decrypted;
}

/**
 * 从加密的日志文件中提取抽卡 URL
 * @param {string} logPath - 日志文件路径
 * @param {RegExp} urlPattern - URL 匹配正则表达式
 * @returns {{url: string|null, error: string|null}} URL 或错误信息
 */
function extractUrlFromEncryptedLog(logPath, urlPattern) {
    const fs = require('fs');

    try {
        // 读取加密的日志文件
        const encryptedBuffer = fs.readFileSync(logPath);

        // XOR 解密
        const decryptedBuffer = decryptClientLog(encryptedBuffer);

        // 转换为字符串
        const logContent = decryptedBuffer.toString('utf-8');

        // 提取 URL
        const match = logContent.match(urlPattern);

        if (!match) {
            return {
                url: null,
                error: 'URL not found in log'
            };
        }

        const url = match[0].replace(/"/g, '');
        return { url, error: null };

    } catch (err) {
        console.error('Failed to decrypt and read log:', err);
        return {
            url: null,
            error: err.message
        };
    }
}

module.exports = {
    decryptClientLog,
    extractUrlFromEncryptedLog
};
