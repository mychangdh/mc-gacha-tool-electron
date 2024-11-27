// 将16进制颜色值转换成rgb颜色值
const hexToRGB = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

//生成指定的颜色系数组 从开始颜色逐渐变到结束颜色
export default (startColor: string, endColor: string, count: number) => {
    //只有一个时 返回起始颜色本身。
    if (count === 1) {
        return [startColor];
    }
    // 将起始颜色值转换成rgb颜色值
    const startRGB = hexToRGB(startColor);

    //将结束颜色值转换成rgb颜色值
    const endRGB = hexToRGB(endColor);

    // 确定颜色系的颜色间隔值，使用平均分配的方式
    const interval = {
        r: Math.round((endRGB.r - startRGB.r) / (count - 1)),
        g: Math.round((endRGB.g - startRGB.g) / (count - 1)),
        b: Math.round((endRGB.b - startRGB.b) / (count - 1)),
    };

    // 生成颜色系数组
    const colorSeries = [];
    for (let i = 0; i < count; i++) {
        const r = startRGB.r + interval.r * i;
        const g = startRGB.g + interval.g * i;
        const b = startRGB.b + interval.b * i;
        const color = `rgb(${r},${g},${b})`;
        colorSeries.push(color);
    }
    return colorSeries;
}
