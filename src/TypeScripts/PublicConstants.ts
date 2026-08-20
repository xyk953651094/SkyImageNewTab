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
    simpleMode: false,
    customTopic: false,
    imageTopics: ["wallpapers"],
    imageBrightness: 1,
    imageHighQuality: false,
    imageParallax: false,
    accessKey: "",
}
