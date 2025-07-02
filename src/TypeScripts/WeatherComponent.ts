// 获取天气图标className
export function getWeatherIcon(weatherInfo: string) {
    interface IconMapInterface {
        "晴": string;
        "阴": string;
        "云": string;
        "雨": string;
        "雾": string;
        "霾": string;
        "雪": string;
        "雹": string;
        [key: string]: string; // 添加字符串索引签名
    }

    const iconMap: IconMapInterface = {
        "晴": "bi bi-sun",
        "阴": "bi bi-cloud",
        "云": "bi bi-clouds",
        "雨": "bi bi-cloud-rain",
        "雾": "bi bi-cloud-fog",
        "霾": "bi bi-cloud-haze",
        "雪": "bi bi-cloud-snow",
        "雹": "bi bi-cloud-hail",
    };

    // 构建正则表达式，以匹配映射中的天气情况
    const regex = new RegExp(Object.keys(iconMap).join("|"));
    // 在天气信息中寻找匹配的天气情况
    const match = weatherInfo.match(regex);

    // 如果找到匹配项，返回相应的图标类；否则返回空字符串
    return match ? iconMap[match[0]] : "";
}