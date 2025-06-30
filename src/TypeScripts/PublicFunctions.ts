import {
    colorRegExp,
    darkColors,
    defaultPreference,
    lightColors,
} from "./PublicConstants"
import {PreferenceInterface, ThemeInterface} from "./PublicInterface";
import $ from "jquery";

// 网络请求
export async function httpRequest(headers: object, url: string, data: object, method: "GET" | "POST") {
    // 验证输入数据
    if (!headers || typeof headers !== "object") {
        throw new Error("Invalid headers");
    }
    if (!url) {
        throw new Error("Invalid url");
    }
    if (!data || typeof data !== "object") {
        throw new Error("Invalid data");
    }

    return new Promise(function (resolve, reject) {
        $.ajax({
            headers: headers,
            url: url,
            type: method,
            data: data,
            timeout: 5000,
            success: (resultData: any) => {
                resolve(resultData);
            },
            error: function (xhr: any, status: string, error: string) {
                const errorMsg = `Request failed: ${status} ${error}`;
                reject(new Error(errorMsg)); // 提供详细的错误信息
            }
        });
    })
}

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
    return (param === null || param === undefined || param.length === 0);
}

// 请求unsplash图片前随机显示多彩颜色主题
export function setThemeColor() {
    let currentHour = parseInt(getTimeDetails(new Date()).hour);
    let lightRandomNum = Math.floor(Math.random() * lightColors.length);
    let darkRandomNum = Math.floor(Math.random() * darkColors.length);

    let theme: ThemeInterface = {
        "mainColor": lightColors[lightRandomNum],
        "backgroundColor": darkColors[darkRandomNum],
        "fontColor": getFontColor(darkColors[darkRandomNum])
    };
    if (currentHour > 18 || currentHour < 6) {  // 夜间显示深色背景
        theme = {
            "mainColor": darkColors[lightRandomNum],
            "backgroundColor": lightColors[darkRandomNum],
            "fontColor": getFontColor(lightColors[darkRandomNum])
        };
    }

    let body = document.getElementsByTagName("body")[0];
    if (body) {
        body.style.backgroundColor = theme.mainColor;    // 设置body背景颜色
    } else {
        console.error("Unable to find the <body> element.");
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

// 补全设置数据
export function fixPreference(preference: PreferenceInterface) {
    let isFixed = false;

    function setDefaultIfUndefinedOrNull(obj: any, key: string, defaultValue: any) {
        if (obj[key] === undefined || obj[key] === null) {
            obj[key] = defaultValue;
            isFixed = true;
        }
    }

    setDefaultIfUndefinedOrNull(preference, "imageQuality", defaultPreference.imageQuality);
    setDefaultIfUndefinedOrNull(preference, "imageTopics", defaultPreference.imageTopics);
    setDefaultIfUndefinedOrNull(preference, "customTopic", defaultPreference.customTopic);
    setDefaultIfUndefinedOrNull(preference, "changeImageTime", defaultPreference.changeImageTime);
    setDefaultIfUndefinedOrNull(preference, "buttonShape", defaultPreference.buttonShape);
    setDefaultIfUndefinedOrNull(preference, "accessKey", defaultPreference.accessKey);

    if (isFixed) {
        localStorage.setItem("preference", JSON.stringify(preference));  // 重新保存设置
    }
    return preference;
}

// 封装对 localStorage 的操作，增加异常处理
export async function getExtensionStorage(key: string, defaultValue: any) {
    try {
        let tempStorage;

        // 生产环境
        // if (["Chrome", "Edge"].indexOf(browserType) !== -1) {
        //     await chrome.storage.local.get(key).then((result) => {
        //         tempStorage = result[key];
        //     });
        // }
        // else if (["Firefox", "Safari"].indexOf(browserType) !== -1) {
        //     await browser.storage.local.get(key).then((result) => {
        //         tempStorage = result[key];
        //     });
        // }
        //
        // if (tempStorage === null || tempStorage === undefined) {
        //     if (defaultValue !== null && defaultValue !== undefined) {
        //         setExtensionStorage(key, defaultValue);
        //     }
        //     return defaultValue;
        // }
        // return tempStorage;

        // 开发环境
        tempStorage = localStorage.getItem(key);
        if (tempStorage) {
            try {
                return JSON.parse(tempStorage);
            } catch(error) {
                return tempStorage;  // 不是 JSON 的纯字符串
            }
        } else {
            if (defaultValue !== null && defaultValue !== undefined) {
                localStorage.setItem(key, JSON.stringify(defaultValue));
            }
            return defaultValue;
        }
    } catch (error) {
        console.error("Error reading from storage:", error);
        return defaultValue;
    }
}

export function setExtensionStorage(key: string, value: any) {
    try {
        // 生产环境
        // if (["Chrome", "Edge"].indexOf(browserType) !== -1) {
        //     chrome.storage.local.set({[key]: value});
        // }
        // else if (["Firefox", "Safari"].indexOf(browserType) !== -1) {
        //     browser.storage.local.set({[key]: value});
        // }

        // 开发环境
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error("Error writing to storage:", error);
    }
}

export function removeExtensionStorage(key: string) {
    try {
        // 生产环境
        // if (["Chrome", "Edge"].indexOf(browserType) !== -1) {
        //     chrome.storage.local.remove(key);
        // }
        // else if (["Firefox", "Safari"].indexOf(browserType) !== -1) {
        //     browser.storage.local.remove(key);
        // }

        // 开发环境
        localStorage.removeItem(key);
    } catch (error) {
        console.error("Error removing from storage:", error);
    }
}

export function clearExtensionStorage() {
    try {
        // 生产环境
        // if (["Chrome", "Edge"].indexOf(browserType) !== -1) {
        //     chrome.storage.local.clear();
        // }
        // else if (["Firefox", "Safari"].indexOf(browserType) !== -1) {
        //     browser.storage.local.clear();
        // }

        // 开发环境
        localStorage.clear();
    } catch (error) {
        console.error("Error clearing storage:", error);
    }
}

export function getPreferenceStorage() {
    let tempPreference = localStorage.getItem("preference");
    if (tempPreference === null) {
        localStorage.setItem("preference", JSON.stringify(defaultPreference));
        return defaultPreference;
    } else {
        return fixPreference(JSON.parse(tempPreference));  // 检查是否缺少数据
    }
}

export function getImageHistoryStorage() {
    let imageHistoryStorage = localStorage.getItem("imageHistory");
    if (imageHistoryStorage !== null) {
        let tempImageHistoryJson = JSON.parse(imageHistoryStorage);
        if (!isEmpty(tempImageHistoryJson)) {
            return tempImageHistoryJson.reverse();  // 重新到旧排序
        } else {
            return [];
        }
    } else {
        return [];
    }
}

// 过渡动画
export function changeTheme(element: string, backgroundColor: string, fontColor: string, time: number = 300) {
    if (!colorRegExp.test(backgroundColor) || !colorRegExp.test(fontColor)) {
        throw new Error("Invalid color format. Expected a 6-digit hexadecimal color code prefixed with '#'.");
    }
    
    $(element).animate({
        backgroundColor: backgroundColor,
        color: fontColor,
    }, {queue: false, duration: time});
}