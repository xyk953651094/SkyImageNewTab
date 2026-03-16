import {colorRegExp, darkColors, lightColors} from "./PublicConstants"
import {ThemeInterface} from "./PublicInterface";

// 获取日期与时间
export function getTimeDetails(param: Date) {
    if (isNaN(param.getTime())) {
        throw new Error("Invalid Date provided.");
    }

    // 辅助函数，用于将数字格式化为两位字符串
    function formatNumber(value: number): string {
        return value < 10 ? `0${value}` : value.toString();
    }

    const year = param.getFullYear().toString();
    const month = formatNumber(param.getMonth() + 1);
    const day = formatNumber(param.getDate());
    const hour = formatNumber(param.getHours());
    const minute = formatNumber(param.getMinutes());
    const second = formatNumber(param.getSeconds());
    const week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][param.getDay()];

    const localeDate: string = "农历" + param.toLocaleString("zh-Hans-u-ca-chinese").split(" ")[0] + "日";

    return {
        year, month, day, hour, minute, second, week, localeDate
    };
}

// 判断对象是否为空
export function isEmpty(param: any) {
    // null、undefined 或空数组/字符串
    if (param === null || param === undefined || param.length === 0) {
        return true;
    }
    
    // 如果是对象（包括JSON对象），需要进一步检查
    if (typeof param === 'object' && !Array.isArray(param)) {
        // 遍历对象的所有属性
        for (const key in param) {
            if (param.hasOwnProperty(key)) {
                // 如果有任何属性不为null或undefined，且length不为0，则不为空
                if (param[key] !== null && param[key] !== undefined && param[key].length !== 0) {
                    return false;
                }
            }
        }
        // 所有属性为 null 或 undefined 或 length 为 0，则返回空
        return true;
    }
    
    return false;
}

// 请求unsplash图片前随机显示多彩颜色主题
export function getRandomTheme() {
    let currentHour = parseInt(getTimeDetails(new Date()).hour);
    let lightRandomNum = Math.floor(Math.random() * lightColors.length);
    let darkRandomNum = Math.floor(Math.random() * darkColors.length);

    let theme: ThemeInterface = {
        primaryColor: lightColors[lightRandomNum],
        secondaryColor: darkColors[darkRandomNum],
        primaryFontColor: getFontColor(lightColors[lightRandomNum]),
        secondaryFontColor: getFontColor(darkColors[darkRandomNum])
    };
    if (currentHour > 18 || currentHour < 6) {  // 夜间显示深色背景
        theme = {
            primaryColor: darkColors[lightRandomNum],
            secondaryColor: lightColors[darkRandomNum],
            primaryFontColor: getFontColor(darkColors[lightRandomNum]),
            secondaryFontColor: getFontColor(lightColors[darkRandomNum])
        };
    }
    return theme;
}

// 根据图片背景颜色获取元素反色效果
export function getReverseColor(color: string) {
    // 验证输入是否为7字符长且以#开头
    if (!colorRegExp.test(color)) {
        throw new Error("Invalid color format. Expected a 6-digit hexadecimal color code prefixed with '#'.");
    }

    // 移除#并转换为16进制数，同时处理类型安全
    const colorValue = Number.parseInt(color.slice(1), 16);

    // 确保colorValue在正确的范围内
    if (colorValue > 0xFFFFFF) {
        throw new Error("Color value exceeds the maximum range.");
    }

    // 计算反色
    const reverseColorValue = 0xFFFFFF - colorValue;

    // 将计算出的反色值转换为16进制字符串，并确保它以6位数的形式呈现
    const reverseColorHex = reverseColorValue.toString(16).padStart(6, '0');

    // 返回最终结果，确保结果以#开头
    return "#" + reverseColorHex;
}

// 根据图片背景颜色改变字体颜色效果
export function getFontColor(color: string) {
    let rgb = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);

    if (!rgb) {
        return "#ffffff";
    }

    let r = parseInt(rgb[1], 16);
    let g = parseInt(rgb[2], 16);
    let b = parseInt(rgb[3], 16);

    if (isNaN(r) || isNaN(g) || isNaN(b)) {
        return "#ffffff";
    }

    let gray = Math.round(r * 0.299 + g * 0.587 + b * 0.114);
    return gray > 128 ? "#000000" : "#ffffff";
}

// 判断设备型号
export function getDeviceType() {
    const userAgent = navigator.userAgent;

    interface DeviceDetectionInterface {
        [key: string]: boolean;
    }

    const deviceDetection: DeviceDetectionInterface = {
        "iPhone": userAgent.includes("iPhone"),
        "iPad": userAgent.includes("iPad"),
        "Android": userAgent.includes("Android"),
    };

    for (const device in deviceDetection) {
        if (deviceDetection[device]) {
            return device;
        }
    }
    return "";
}

export function getBrowserType() {
    const userAgent = navigator.userAgent;

    interface BrowserDetectionInterface {
        [key: string]: boolean;
    }

    const browserDetection: BrowserDetectionInterface = {
        "Chrome": userAgent.includes("Chrome") && userAgent.includes("Safari") && !userAgent.includes("Edg"),
        "Edge": userAgent.includes("Edg"),
        "Firefox": userAgent.includes("Firefox"),
        "Safari": !userAgent.includes("Chrome") && userAgent.includes("Safari"),
    };

    for (const browser in browserDetection) {
        if (browserDetection[browser]) {
            return browser;
        }
    }
    return "Other";
}

// 过渡动画
export function changeTheme(element: string, backgroundColor: string, fontColor: string, time: number = 300) {
    if (!colorRegExp.test(backgroundColor) || !colorRegExp.test(fontColor)) {
        throw new Error("Invalid color format. Expected a 6-digit hexadecimal color code prefixed with '#'.");
    }
    
    const Element = document.getElementById(element);
    if (Element && Element as HTMLElement) {
        Element.style.backgroundColor = backgroundColor;
        Element.style.color = fontColor;
    }
    
    // $(element).animate({
    //     backgroundColor: backgroundColor,
    //     color: fontColor,
    // }, {queue: false, duration: time});
}

// 按钮鼠标悬停与离开事件
export function changeButtonTheme(backgroundColor: string, fontColor: string, e: any) {
    if (!colorRegExp.test(backgroundColor) && backgroundColor !== "transparent") {
        throw new Error("Invalid color format. Expected a 6-digit hexadecimal color code prefixed with '#' or 'transparent'.");
    }
    
    if (e.currentTarget && (e.currentTarget as HTMLElement).style) {
        (e.currentTarget as HTMLElement).style.backgroundColor = backgroundColor;
        (e.currentTarget as HTMLElement).style.color = fontColor;
    }
}