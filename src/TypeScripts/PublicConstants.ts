import {PreferenceInterface} from './PublicInterface';
import {getBrowserType, getDeviceType} from "./PublicFunctions";

// 常用变量
export const deviceType = getDeviceType();  // 获取当前设备类型
export const browserType = getBrowserType();
export const colorRegExp = /^#[0-9A-Fa-f]{6}$/;
export const clientId = process.env.REACT_APP_UNSPLASH_ACCESS_KEY ?? "";
export const unsplashUrl = "?utm_source=SkyNewTab&utm_medium=referral";  // Unsplash API规范
export const imageHistoryMaxSize = 5;
export const imageSwitchingInterval = 3600000;  // 图片切换间隔默认一小时 3600000

export const defaultPreference: PreferenceInterface = {
    showGreet: true,
    showWeather: true,
    showTodo: true,
    showCountdown: true,
    showFocus: true,
    showSearch: true,
    customTopic: false,
    imageTopics: ["bo8jQKTaE0Y"],
    imageBrightness: 1,
    imageHighQuality: false,
    imageParallax: false,
    accessKey: "",
    fontFamily: "LXGWWenKai",
}

// 字体中文名，声明顺序即菜单展示顺序；新增字体时编译器会强制此处同步
export const fontFamilyLabels: Record<PreferenceInterface["fontFamily"], string> = {
    LXGWWenKai: "霞鹜文楷",
    LXGWWenKaiLight: "霞鹜文楷 Light",
    LXGWNeoXiHei: "霞鹜新晰黑",
    LXGWNeoZhiSong: "霞鹜新致宋",
    LXGWMarkerGothic: "霞鹜漫黑",
    Xiaolai: "小赖字体",
    Yozai: "悠哉字体",
    YozaiLight: "悠哉字体 Light",
}
