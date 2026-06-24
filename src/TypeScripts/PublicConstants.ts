import {ExtensionDataInterface, PreferenceInterface} from './PublicInterface'
import {getBrowserType, getDeviceType} from "./PublicFunctions";

// 常用变量
export const deviceType = getDeviceType();  // 获取当前设备类型
export const browserType = getBrowserType();
export const colorRegExp = /^#[0-9A-Fa-f]{6}$/;
export const clientId = process.env.REACT_APP_UNSPLASH_ACCESS_KEY ?? "";
export const unsplashUrl = "?utm_source=SkyNewTab&utm_medium=referral";  // Unsplash API规范
export const imageHistoryMaxSize = 5;
export const imageSwitchingInterval = 3600000;  // 图片切换间隔默认一小时 3600000
export const environment = process.env.NODE_ENV ?? "development";

export const defaultPreference: PreferenceInterface = {
    imageTopics: ["wallpapers"],
    customTopic: "",
}

// TODO:如果后续不再增加别的功能，例如数据导入导出、待办、倒数日之类的，这个常量可以删除。
export const defaultExtensionData: ExtensionDataInterface = {
    preference: defaultPreference
}

// 主题颜色
export const lightColors: string[] = [
    // "#A04F3C",
    // "#A0875A",
    // "#A08C9F",
    // "#A35842",
    // "#A55456",
    // "#A6845A",
    // "#AB8483",
    // "#AFC5C1",
    "#B19BA7",
    "#B1C5BA",
    "#B3C5AB",
    "#B49082",
    "#B8E8EB",
    "#B95D61",
    "#B9B0A1",
    "#BEB49B",
    "#C88D52",
    "#C9C7C5",
    "#CB8098",
    "#CCC4B3",
    "#CF9A8C",
    "#D3CFCA",
    "#D4DFBB",
    "#D4E1DA",
    "#D8C0A0",
    "#DAD3C7",
    "#DD94A1",
    "#DEB8B3",
    "#E1DAD8",
    "#E4CE84",
    "#E6C380",
    "#ECE2C6",
    "#F1EADC",
    "#F2EEE8",
    "#F7F7EB",
    "#FFE19A",
]

export const darkColors: string[] = [
    "#0E31A0",
    "#141F49",
    "#1A4D80",
    "#1F284C",
    "#3070A4",
    "#313A44",
    "#33415D",
    "#39364C",
    "#3A3E47",
    "#493C53",
    "#493F36",
    "#4F473A",
    "#51433F",
    "#504E4A",
    "#541831",
    "#547C97",
    "#665A4E",
    "#67363D",
    "#67A1C4",
    "#6E8E7C",
    "#70846A",
    "#745B9F",
    "#75706C",
    "#761521",
    // "#911D50",
    // "#91955F",
    // "#979AB9",
    // "#9B8A9D",
    // "#9E754E",
]
